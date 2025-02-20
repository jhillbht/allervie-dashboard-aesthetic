"""
Allervie Analytics Service Class
"""

import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import pandas as pd
from datetime import datetime, timedelta

class AllervieAnalytics:
    def __init__(self):
        self.PROPERTY_ID = os.getenv('GA4_PROPERTY_ID', '399455767')  # Allervie GA4 Property ID
        self.CREDENTIALS_PATH = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 
                                        os.path.join(os.path.dirname(__file__), '..', 'client_secret.json'))
        self.service = None
        self.port = 49152  # Starting port for OAuth callback
    
    def initialize_service(self):
        """Initialize the GA4 service with authentication."""
        SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        creds = None
        token_path = os.path.join(os.path.dirname(__file__), '..', 'token.json')
        
        if os.path.exists(token_path):
            try:
                creds = Credentials.from_authorized_user_file(token_path, SCOPES)
                print("Found existing credentials")
            except Exception as e:
                print(f"Error loading credentials: {str(e)}")
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    print("Refreshing expired credentials")
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing credentials: {str(e)}")
                    return None
            else:
                # Try different ports from the allowed redirect URIs
                for port_offset in range(4):  # We have 4 allowed ports
                    try:
                        current_port = self.port + port_offset
                        print(f"Attempting OAuth flow on port {current_port}")
                        
                        flow = Flow.from_client_secrets_file(
                            self.CREDENTIALS_PATH,
                            scopes=SCOPES,
                            redirect_uri=f'http://localhost:{current_port}'
                        )
                        
                        creds = flow.run_local_server(port=current_port)
                        print(f"Successfully authenticated on port {current_port}")
                        
                        # Save the credentials
                        with open(token_path, 'w') as token:
                            token.write(creds.to_json())
                        print("Credentials saved successfully")
                        break
                    except Exception as e:
                        print(f"Failed on port {current_port}: {str(e)}")
                        if port_offset == 3:  # Last attempt
                            print("All OAuth attempts failed")
                            return None
                        continue
        
        try:
            self.service = build('analyticsdata', 'v1beta', credentials=creds)
            print("Analytics service initialized successfully")
            return True
        except Exception as e:
            print(f"Error building analytics service: {str(e)}")
            return False

    def get_analytics_data(self, days=7):
        """Get all required analytics data for the dashboard."""
        if not self.service:
            if not self.initialize_service():
                return None
        
        end_date = datetime.now() - timedelta(days=1)
        start_date = end_date - timedelta(days=int(days)-1)
        
        try:
            # Get users data
            users_response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{
                        "startDate": start_date.strftime('%Y-%m-%d'),
                        "endDate": end_date.strftime('%Y-%m-%d')
                    }],
                    "dimensions": [{"name": "date"}],
                    "metrics": [
                        {"name": "activeUsers"},
                        {"name": "sessions"},
                        {"name": "conversions"}
                    ]
                }
            ).execute()
            
            # Get traffic sources data
            sources_response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{
                        "startDate": start_date.strftime('%Y-%m-%d'),
                        "endDate": end_date.strftime('%Y-%m-%d')
                    }],
                    "dimensions": [{"name": "sessionSource"}],
                    "metrics": [{"name": "sessions"}],
                    "limit": 5
                }
            ).execute()
            
            # Process data for the dashboard
            users_data = {
                'dates': [],
                'values': []
            }
            
            total_users = 0
            total_sessions = 0
            total_conversions = 0
            
            for row in users_response.get('rows', []):
                date = datetime.strptime(row['dimensionValues'][0]['value'], '%Y%m%d').strftime('%Y-%m-%d')
                users = int(row['metricValues'][0]['value'])
                sessions = int(row['metricValues'][1]['value'])
                conversions = int(row['metricValues'][2]['value'])
                
                users_data['dates'].append(date)
                users_data['values'].append(users)
                
                total_users += users
                total_sessions += sessions
                total_conversions += conversions
            
            # Process traffic sources data
            sources_data = {
                'labels': [],
                'values': []
            }
            
            for row in sources_response.get('rows', []):
                sources_data['labels'].append(row['dimensionValues'][0]['value'])
                sources_data['values'].append(int(row['metricValues'][0]['value']))
            
            # Calculate conversion rate
            conversion_rate = (total_conversions / total_sessions * 100) if total_sessions > 0 else 0
            
            return {
                'quick_stats': {
                    'total_users': total_users,
                    'total_sessions': total_sessions,
                    'conversion_rate': round(conversion_rate, 2)
                },
                'users_data': users_data,
                'sources_data': sources_data,
                'conversion_data': {
                    'dates': users_data['dates'],
                    'values': [total_conversions / len(users_data['dates'])] * len(users_data['dates'])
                }
            }
            
        except Exception as e:
            print(f"Error getting analytics data: {str(e)}")
            return None