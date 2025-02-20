"""
Allervie Analytics Implementation
Main class for accessing GA4 analytics data
"""

import os
from pathlib import Path
from datetime import datetime, timedelta
import time
import socket

# Add protected imports with helpful error message
try:
    from google.oauth2.credentials import Credentials # type: ignore
    from google.auth.transport.requests import Request # type: ignore
    from google_auth_oauthlib.flow import InstalledAppFlow # type: ignore
    from googleapiclient.discovery import build # type: ignore
    import pandas as pd # type: ignore
except ImportError as e:
    print(f"Required package missing: {str(e)}")
    print("Please install required packages: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client pandas")
    raise

# Add custom exception class
class AnalyticsError(Exception):
    """Custom exception for analytics errors"""
    pass

# Add rate limiting class
class RateLimiter:
    def __init__(self, max_requests=100, time_window=60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def wait_if_needed(self):
        now = datetime.now()
        # Remove old requests
        self.requests = [req_time for req_time in self.requests 
                        if (now - req_time).total_seconds() < self.time_window]
        
        if len(self.requests) >= self.max_requests:
            sleep_time = (self.requests[0] + timedelta(seconds=self.time_window) - now).total_seconds()
            if sleep_time > 0:
                time.sleep(sleep_time)
        self.requests.append(now)

class AllervieAnalytics:
    def __init__(self, property_id=None):
        """Initialize AllervieAnalytics with configuration."""
        # Use environment variable or fallback for property ID
        self.PROPERTY_ID = property_id or os.getenv('GA4_PROPERTY_ID') or '399455767'
        
        # Look for credentials file in multiple locations and names
        possible_cred_files = [
            'gcp-oauth.keys.json',
            'client_secret*.json'  # Will match client_secret_*.json files
        ]
        
        # Find first existing credentials file
        self.CREDENTIALS_PATH = None
        for cred_file in possible_cred_files:
            # Check current directory
            matches = list(Path.cwd().glob(cred_file))
            if matches:
                self.CREDENTIALS_PATH = str(matches[0])
                break
            
            # Check script directory
            matches = list(Path(__file__).parent.glob(cred_file))
            if matches:
                self.CREDENTIALS_PATH = str(matches[0])
                break
        
        if not self.CREDENTIALS_PATH:
            print("⚠️ Warning: Could not find credentials file. Looked for:")
            for file in possible_cred_files:
                print(f"  - {file}")
            print("Please ensure one of these files exists in the current or script directory.")
        
        # Set up token path
        self.TOKEN_PATH = str(Path(__file__).parent / 'token' / 'allervie_token.json')
        self.service = None
        
        # Create token directory if it doesn't exist
        os.makedirs(os.path.dirname(self.TOKEN_PATH), exist_ok=True)
        
        # Add rate limiter
        self.rate_limiter = RateLimiter()
        
        print(f"Using credentials file: {self.CREDENTIALS_PATH}")
        print(f"Saving token to: {self.TOKEN_PATH}")
    
    def _find_available_port(self, start_port=8080, max_attempts=10):
        """Find an available port starting from start_port."""
        for port in range(start_port, start_port + max_attempts):
            try:
                # Try to create a socket with the port
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('localhost', port))
                    print(f"Found available port: {port}")
                    return port
            except OSError:
                print(f"Port {port} is busy, trying next port...")
                continue
        
        raise OSError("No available ports found in range")

    def initialize_service(self):
        """Initialize the GA4 service with authentication."""
        SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        creds = None
        
        # Try higher ports that are less likely to be in use
        PORTS = [49152, 49153, 49154, 49155]
        
        for PORT in PORTS:
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.CREDENTIALS_PATH,
                    SCOPES
                )
                
                print(f"Attempting authentication on port {PORT}")
                creds = flow.run_local_server(
                    port=PORT,
                    success_message='Authentication successful! You can close this window.',
                    authorization_prompt_message='Please sign in with your internal account.',
                    open_browser=True
                )
                print("Successfully authenticated")
                break
            except OSError:
                print(f"Port {PORT} is busy, trying next port...")
                continue
            except Exception as e:
                print(f"Error during authentication: {str(e)}")
                return None
        
        if not creds:
            print("All ports failed")
            return None
        
        try:
            os.makedirs(os.path.dirname(self.TOKEN_PATH), exist_ok=True)
            with open(self.TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())
            print("New credentials saved successfully")
            
            self.service = build('analyticsdata', 'v1beta', credentials=creds)
            print("Analytics service initialized successfully")
            return True
        except Exception as e:
            print(f"Error building analytics service: {str(e)}")
            return False

    def test_connection(self):
        """Test the connection to GA4."""
        if not self.service:
            raise AnalyticsError("Service not initialized. Run initialize_service() first.")
            
        try:
            self.rate_limiter.wait_if_needed()
            response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            return True
        except Exception as e:
            raise AnalyticsError(f"Connection test failed: {str(e)}")

    def get_active_users(self, days=7, end_date=None):
        """Get active users for the specified number of days."""
        if not self.service:
            raise AnalyticsError("Service not initialized")
        
        if days < 1:
            raise ValueError("Days must be a positive integer")
        
        end_date = end_date or datetime.now()
        start_date = end_date - timedelta(days=days-1)
        
        try:
            self.rate_limiter.wait_if_needed()
            response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{
                        "startDate": start_date.strftime('%Y-%m-%d'),
                        "endDate": end_date.strftime('%Y-%m-%d')
                    }],
                    "dimensions": [{"name": "date"}],
                    "metrics": [
                        {"name": "activeUsers"},
                        {"name": "newUsers"},
                        {"name": "sessions"}
                    ]
                }
            ).execute()
            
            df = pd.DataFrame([
                {
                    'date': row['dimensionValues'][0]['value'],
                    'active_users': int(row['metricValues'][0]['value']),
                    'new_users': int(row['metricValues'][1]['value']),
                    'sessions': int(row['metricValues'][2]['value'])
                }
                for row in response.get('rows', [])
            ])
            
            df['returning_users'] = df['active_users'] - df['new_users']
            return df
            
        except Exception as e:
            raise AnalyticsError(f"Error getting active users: {str(e)}")

    def get_traffic_sources(self, days=7, end_date=None):
        """Get traffic source metrics."""
        if not self.service:
            raise AnalyticsError("Service not initialized")
            
        if days < 1:
            raise ValueError("Days must be a positive integer")
            
        end_date = end_date or datetime.now()
        start_date = end_date - timedelta(days=days-1)
        
        try:
            self.rate_limiter.wait_if_needed()
            response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{
                        "startDate": start_date.strftime('%Y-%m-%d'),
                        "endDate": end_date.strftime('%Y-%m-%d')
                    }],
                    "dimensions": [
                        {"name": "sessionSource"},
                        {"name": "sessionMedium"}
                    ],
                    "metrics": [
                        {"name": "sessions"},
                        {"name": "activeUsers"},
                        {"name": "engagementRate"}
                    ]
                }
            ).execute()
            
            return pd.DataFrame([
                {
                    'source': row['dimensionValues'][0]['value'],
                    'medium': row['dimensionValues'][1]['value'],
                    'sessions': int(row['metricValues'][0]['value']),
                    'users': int(row['metricValues'][1]['value']),
                    'engagement_rate': float(row['metricValues'][2]['value'])
                }
                for row in response.get('rows', [])
            ])
            
        except Exception as e:
            raise AnalyticsError(f"Error getting traffic sources: {str(e)}")

    def get_daily_overview(self, days=7, end_date=None):
        """Get a daily overview combining multiple metrics."""
        if not self.service:
            raise AnalyticsError("Service not initialized")
            
        if days < 1:
            raise ValueError("Days must be a positive integer")
            
        end_date = end_date or datetime.now()
        start_date = end_date - timedelta(days=days-1)
        
        try:
            self.rate_limiter.wait_if_needed()
            response = self.service.properties().runReport(
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
                        {"name": "conversions"},
                        {"name": "totalRevenue"},
                        {"name": "screenPageViews"},
                        {"name": "userEngagementDuration"}
                    ]
                }
            ).execute()
            
            df = pd.DataFrame([
                {
                    'date': row['dimensionValues'][0]['value'],
                    'active_users': int(row['metricValues'][0]['value']),
                    'sessions': int(row['metricValues'][1]['value']),
                    'conversions': int(row['metricValues'][2]['value']),
                    'revenue': float(row['metricValues'][3]['value']),
                    'pageviews': int(row['metricValues'][4]['value']),
                    'engagement_duration': float(row['metricValues'][5]['value'])
                }
                for row in response.get('rows', [])
            ])
            
            # Add calculated metrics
            df['pages_per_session'] = (df['pageviews'] / df['sessions']).round(2)
            df['conversion_rate'] = (df['conversions'] / df['sessions'] * 100).round(2)
            df['avg_session_duration'] = (df['engagement_duration'] / df['sessions']).round(2)
            
            return df
            
        except Exception as e:
            raise AnalyticsError(f"Error getting daily overview: {str(e)}")

    def check_service_status(self):
        """Check if service is initialized and working"""
        if not self.service:
            return False
        
        try:
            self.rate_limiter.wait_if_needed()
            self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{"startDate": "today", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            return True
        except Exception:
            return False