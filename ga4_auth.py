"""
GA4 Authentication with correct GCP project credentials
"""

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
from pathlib import Path

class GA4Auth:
    def __init__(self):
        self.PROPERTY_ID = '399455767'  # Allervie GA4 Property ID
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.CLIENT_SECRET_PATH = '/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/client_secret_22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com.json'
        self.TOKEN_PATH = Path('token/allervie_token.json')
        
        # Create token directory if it doesn't exist
        self.TOKEN_PATH.parent.mkdir(exist_ok=True)

    def authenticate(self):
        """Handle the authentication flow."""
        print("\n=== GA4 Authentication Process ===")
        
        # Check if secret file exists
        if not os.path.exists(self.CLIENT_SECRET_PATH):
            print(f"❌ Client secret file not found at: {self.CLIENT_SECRET_PATH}")
            return None
            
        creds = None
        
        # Check for existing token
        if self.TOKEN_PATH.exists():
            print("Found existing token, attempting to use it...")
            try:
                creds = Credentials.from_authorized_user_file(str(self.TOKEN_PATH), self.SCOPES)
            except Exception as e:
                print(f"Error loading existing token: {e}")
        
        # If no valid credentials available, authenticate
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Token expired, refreshing...")
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing token: {e}")
                    creds = None
            
            if not creds:
                print("\nStarting new authentication flow...")
                print("Please login with data@bluehighlightedtext.com when the browser opens")
                
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.CLIENT_SECRET_PATH, 
                        self.SCOPES,
                        redirect_uri='http://localhost:0'
                    )
                    creds = flow.run_local_server(port=0)
                    
                    # Save the credentials
                    with open(self.TOKEN_PATH, 'w') as token:
                        token.write(creds.to_json())
                    print("✅ New credentials saved successfully")
                    
                except Exception as e:
                    print(f"❌ Error during authentication: {e}")
                    return None
        
        return creds

    def verify_ga4_access(self, creds):
        """Verify access to GA4 API."""
        print("\nVerifying GA4 access...")
        
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            # Test with a simple request
            response = service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{"startDate": "yesterday", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            
            users = int(response['rows'][0]['metricValues'][0]['value'])
            print(f"✅ GA4 access verified successfully!")
            print(f"Active users (last 24h): {users}")
            return True
            
        except Exception as e:
            print(f"❌ Error verifying GA4 access: {e}")
            return False

def main():
    auth = GA4Auth()
    
    # Step 1: Authenticate
    print("1. Authenticating with Google...")
    creds = auth.authenticate()
    if not creds:
        print("❌ Authentication failed")
        return
    print("✅ Authentication successful")
    
    # Step 2: Verify GA4 access
    print("\n2. Verifying GA4 access...")
    if auth.verify_ga4_access(creds):
        print("\n✅ All systems operational!")
    else:
        print("\n❌ GA4 access verification failed")

if __name__ == "__main__":
    main()