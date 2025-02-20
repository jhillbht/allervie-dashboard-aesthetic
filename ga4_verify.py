"""
GA4 verification with specific OAuth credentials for Allervie Dashboard
"""

import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from pathlib import Path
import json

class AllervieGA4:
    def __init__(self):
        self.PROPERTY_ID = '399455767'
        self.CLIENT_CONFIG = {
            'web': {
                'client_id': '22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com',
                'client_secret': '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',
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token',
                'redirect_uris': [
                    'https://seal-app-3mp4e.ondigitalocean.app/auth/v1/callback',
                    'https://ccsqfaobfzngvmhpnogi.supabase.co/auth/v1/callback'
                ]
            }
        }
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.token_dir = Path('token')
        self.token_path = self.token_dir / 'allervie_token.json'
        self.client_path = self.token_dir / 'client_config.json'
        
        # Ensure token directory exists
        self.token_dir.mkdir(exist_ok=True)
        
        # Save client config
        with open(self.client_path, 'w') as f:
            json.dump(self.CLIENT_CONFIG, f)

    def authenticate(self):
        """Handle OAuth2 authentication flow."""
        print("\n1. Starting authentication process...")
        
        creds = None
        
        # Check for existing token
        if self.token_path.exists():
            print("Found existing token, attempting to load...")
            try:
                creds = Credentials.from_authorized_user_file(str(self.token_path), self.SCOPES)
            except Exception as e:
                print(f"Error loading existing token: {e}")
        
        # If no valid credentials available, start new flow
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Token expired, attempting to refresh...")
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing token: {e}")
                    creds = None
            
            if not creds:
                print("Starting new authentication flow...")
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        str(self.client_path),
                        self.SCOPES,
                        redirect_uri='http://localhost:8080'
                    )
                    creds = flow.run_local_server(port=8080)
                    
                    # Save credentials
                    with open(self.token_path, 'w') as token:
                        token.write(creds.to_json())
                    print("New credentials saved successfully")
                    
                except Exception as e:
                    print(f"Error in authentication flow: {e}")
                    return None
        
        return creds

    def verify_access(self):
        """Verify GA4 API access."""
        print("\n=== Allervie GA4 Access Verification ===")
        
        # Step 1: Authentication
        creds = self.authenticate()
        if not creds:
            print("❌ Authentication failed")
            return False
        
        print("✅ Authentication successful")
        
        # Step 2: Test GA4 API
        print("\n2. Testing GA4 API access...")
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            print("Making test request...")
            response = service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [
                        {
                            "startDate": "yesterday",
                            "endDate": "today"
                        }
                    ],
                    "metrics": [
                        {
                            "name": "activeUsers"
                        }
                    ]
                }
            ).execute()
            
            users = int(response['rows'][0]['metricValues'][0]['value'])
            print(f"\n✅ GA4 API access successful!")
            print(f"Active users (last 24h): {users}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error accessing GA4 API: {str(e)}")
            print("\nTroubleshooting tips:")
            print("1. Check if you're logged in with data@bluehighlightedtext.com")
            print("2. Verify the Property ID is correct")
            print("3. Check if GA4 API is enabled in Google Cloud Console")
            return False

def main():
    ga4 = AllervieGA4()
    if ga4.verify_access():
        print("\n✅ Verification completed successfully!")
    else:
        print("\n❌ Verification failed. Please check the errors above.")

if __name__ == "__main__":
    main()