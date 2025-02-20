"""
Test OAuth2.0 Authentication for Allervie Analytics
"""

import os
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
import google.auth
import time
import socket
from google.auth.exceptions import RefreshError
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest

# Path to the credentials
CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, 'desktop_1_client.json')
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')
PROPERTY_ID = '399455767'

class TestOAuth:
    def __init__(self):
        self.PROPERTY_ID = PROPERTY_ID
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.service = None
        self.project_dir = Path(__file__).parent
        
    def initialize_oauth(self):
        """Initialize OAuth2.0 authentication."""
        creds = None
        try:
            # Check if token file exists
            if os.path.exists(TOKEN_FILE):
                try:
                    print("Loading existing credentials...")
                    creds = Credentials.from_authorized_user_file(TOKEN_FILE, self.SCOPES)
                    print("Credentials loaded successfully")
                except Exception as e:
                    print(f"⚠️ Error loading existing credentials: {str(e)}")

            # If no valid credentials, initiate OAuth flow
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    print("Refreshing expired credentials...")
                    creds.refresh(Request())
                else:
                    print("Starting new OAuth flow...")
                    flow = InstalledAppFlow.from_client_secrets_file(
                        CLIENT_SECRET_FILE, 
                        scopes=self.SCOPES,
                        redirect_uri='http://localhost:5001/oauth2callback'
                    )
                    creds = flow.run_local_server(port=0)
                    print("New credentials obtained")

                # Save the credentials for the next run
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())
                    print("Credentials saved successfully")

            self.service = BetaAnalyticsDataClient(credentials=creds)
            print("✅ Analytics service initialized successfully")
            return True
        except Exception as e:
            print(f"❌ Error in OAuth initialization: {str(e)}")
            return False

    def test_connection(self):
        """Test the connection to GA4."""
        if not self.service:
            print("❌ Service not initialized")
            return False

        max_retries = 3
        retry_count = 0

        while retry_count < max_retries:
            try:
                print(f"Attempting connection (attempt {retry_count + 1}/{max_retries})...")
                request = RunReportRequest(
                    property=f"properties/{self.PROPERTY_ID}",
                    date_ranges=[{"start_date": "yesterday", "end_date": "yesterday"}],
                    metrics=[
                        {"name": "totalUsers"},
                        {"name": "screenPageViews"},
                        {"name": "averageSessionDuration"}
                    ]
                )
                response = self.service.run_report(request)
                print("✅ Connection test successful")
                return True
            except Exception as e:
                retry_count += 1
                print(f"⚠️ Connection attempt {retry_count} failed: {str(e)}")
                if retry_count < max_retries:
                    print("Retrying in 5 seconds...")
                    time.sleep(5)
                else:
                    print("❌ All connection attempts failed")
                    return False

    def get_test_data(self):
        """Fetch some test data to verify working connection."""
        if not self.service:
            print("❌ Service not initialized")
            return None

        end_date = datetime.now() - timedelta(days=1)
        start_date = end_date - timedelta(days=6)  # Last 7 days
        
        try:
            request = RunReportRequest(
                property=f"properties/{self.PROPERTY_ID}",
                date_ranges=[{"start_date": start_date.strftime('%Y-%m-%d'), "end_date": end_date.strftime('%Y-%m-%d')}],
                dimensions=[{"name": "date"}],
                metrics=[
                    {"name": "activeUsers"},
                    {"name": "newUsers"},
                    {"name": "sessions"}
                ]
            )
            response = self.service.run_report(request)
            
            df = pd.DataFrame([
                {
                    'date': row.dimension_values[0].value,
                    'active_users': int(row.metric_values[0].value),
                    'new_users': int(row.metric_values[1].value),
                    'sessions': int(row.metric_values[2].value)
                }
                for row in response.rows
            ])
            
            print("\n📊 Test Data Report:")
            print(df)
            return df
            
        except Exception as e:
            print(f"❌ Error getting test data: {str(e)}")
            return None

def main():
    """Run OAuth test."""
    print("🚀 Starting OAuth Authentication Test")
    print("=" * 50)
    
    test = TestOAuth()
    
    print("\n1️⃣ Initializing OAuth...")
    if test.initialize_oauth():
        print("\n2️⃣ Testing Connection...")
        if test.test_connection():
            print("\n3️⃣ Fetching Test Data...")
            test.get_test_data()
    
    print("\n" + "=" * 50)

def test_ga4():
    print("🚀 Testing GA4 connection...")
    
    try:
        # Load credentials
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, [
            'https://www.googleapis.com/auth/analytics.readonly'
        ])
        
        # Initialize client
        client = BetaAnalyticsDataClient(credentials=creds)
        
        # Make a simple request with all dashboard metrics
        request = RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            date_ranges=[{"start_date": "yesterday", "end_date": "yesterday"}],
            metrics=[
                # First row metrics
                {"name": "totalUsers"},
                {"name": "screenPageViews"},
                {"name": "averageSessionDuration"},
                # Second row metrics
                {"name": "bounceRate"},
                {"name": "engagementRate"},
                {"name": "screenPageViewsPerSession"}
            ]
        )
        
        response = client.run_report(request)
        
        print("\n✅ Connection successful!")
        print("\nMetrics for yesterday:")
        print("\nFirst Row Metrics:")
        print(f"Total Users: {response.rows[0].metric_values[0].value}")
        print(f"Page Views: {response.rows[0].metric_values[1].value}")
        print(f"Avg Session Duration: {float(response.rows[0].metric_values[2].value):.2f} seconds")
        
        print("\nSecond Row Metrics:")
        print(f"Bounce Rate: {float(response.rows[0].metric_values[3].value) * 100:.2f}%")
        print(f"Engagement Rate: {float(response.rows[0].metric_values[4].value) * 100:.2f}%")
        print(f"Pages per Session: {float(response.rows[0].metric_values[5].value):.2f}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_ga4()