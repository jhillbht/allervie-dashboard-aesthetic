"""
GA4 verification with updated GCP credentials
"""

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
from pathlib import Path

class GA4Verifier:
    def __init__(self):
        self.PROPERTY_ID = '399455767'  # Allervie GA4 Property ID
        self.CREDENTIALS_PATH = '/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/client_secret_22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com.json'
        self.TOKEN_PATH = Path('token/allervie_token.json')
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        
        # Create token directory if it doesn't exist
        self.TOKEN_PATH.parent.mkdir(exist_ok=True)

    def authenticate(self):
        """Handle authentication flow"""
        print("\n1. Starting authentication process...")
        
        creds = None
        if self.TOKEN_PATH.exists():
            try:
                creds = Credentials.from_authorized_user_file(str(self.TOKEN_PATH), self.SCOPES)
                print("Found existing token")
            except Exception as e:
                print(f"Error loading existing token: {e}")

        # If no valid credentials available, let's authenticate
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Refreshing expired credentials...")
                creds.refresh(Request())
            else:
                print("Starting new authentication flow...")
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.CREDENTIALS_PATH, 
                        self.SCOPES,
                        redirect_uri='http://localhost:0'  # Use dynamic port
                    )
                    creds = flow.run_local_server(
                        port=0,
                        access_type='offline',
                        include_granted_scopes=True
                    )
                    
                    # Save credentials
                    with open(self.TOKEN_PATH, 'w') as token:
                        token.write(creds.to_json())
                    print("✅ New credentials saved successfully")
                except Exception as e:
                    print(f"❌ Error in authentication flow: {e}")
                    return None

        return creds

    def verify_connection(self, creds):
        """Verify connection to GA4"""
        print("\n2. Testing GA4 connection...")
        
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            print("Making test request to GA4...")
            response = service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{"startDate": "yesterday", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            
            users = int(response['rows'][0]['metricValues'][0]['value'])
            print(f"✅ Successfully connected to GA4!")
            print(f"Active users (last 24h): {users}")
            return True
            
        except Exception as e:
            print(f"❌ Error connecting to GA4: {e}")
            return False

def main():
    print("=== Allervie GA4 Connection Test ===")
    
    verifier = GA4Verifier()
    
    # Step 1: Authenticate
    creds = verifier.authenticate()
    if not creds:
        print("❌ Authentication failed")
        return
        
    # Step 2: Verify connection
    if verifier.verify_connection(creds):
        print("\n✅ All tests passed successfully!")
    else:
        print("\n❌ Connection test failed")

if __name__ == "__main__":
    main()