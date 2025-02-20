"""
Fixed GA4 Authentication with proper redirect URI handling
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from pathlib import Path
import json

class GA4Authenticator:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.CREDS_FILE = 'gcp-oauth.keys.json'
        self.TOKEN_DIR = Path('token')
        self.TOKEN_PATH = self.TOKEN_DIR / 'allervie_token.json'
        
        # Create token directory if it doesn't exist
        self.TOKEN_DIR.mkdir(exist_ok=True)

    def authenticate(self):
        """Complete authentication flow with proper redirect URI"""
        print("=== GA4 Authentication Process ===")
        
        # Step 1: Check for existing token
        print("\n1. Checking for existing credentials...")
        creds = None
        if self.TOKEN_PATH.exists():
            try:
                creds = Credentials.from_authorized_user_file(str(self.TOKEN_PATH), self.SCOPES)
                print("Found existing credentials")
            except Exception as e:
                print(f"Error loading existing credentials: {e}")

        # Step 2: Refresh or create new credentials
        if creds and creds.valid:
            print("✅ Existing credentials are valid")
        else:
            if creds and creds.expired and creds.refresh_token:
                print("Refreshing expired credentials...")
                try:
                    creds.refresh(Request())
                    print("✅ Credentials refreshed successfully")
                except Exception as e:
                    print(f"Error refreshing credentials: {e}")
                    creds = None
            
            if not creds:
                print("\n2. Starting new authentication flow...")
                try:
                    # Load client secrets
                    if not os.path.exists(self.CREDS_FILE):
                        print(f"❌ Credentials file not found: {self.CREDS_FILE}")
                        return None
                    
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.CREDS_FILE,
                        self.SCOPES,
                        redirect_uri='http://localhost:8085'  # Fixed redirect URI
                    )
                    
                    # Run local server with fixed port
                    creds = flow.run_local_server(
                        port=8085,
                        prompt='consent',
                        authorization_prompt_message=(
                            "\nPlease log in with data@bluehighlightedtext.com "
                            "when the browser opens\n"
                        )
                    )
                    
                    # Save the credentials
                    with open(self.TOKEN_PATH, 'w') as token:
                        token.write(creds.to_json())
                    print("✅ New credentials saved successfully")
                    
                except Exception as e:
                    print(f"❌ Error in authentication flow: {e}")
                    return None

        # Step 3: Test the credentials
        print("\n3. Testing GA4 connection...")
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            # Test with a simple request
            response = service.properties().runReport(
                property="properties/399455767",
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
            
            users = response['rows'][0]['metricValues'][0]['value']
            print(f"✅ GA4 connection successful!")
            print(f"Active users (last 24h): {users}")
            return creds
            
        except Exception as e:
            print(f"❌ Error testing GA4 connection: {str(e)}")
            return None

def main():
    # First, clean up any existing tokens
    token_dir = Path('token')
    if token_dir.exists():
        import shutil
        shutil.rmtree(token_dir)
        print("Cleaned up existing tokens")
    
    # Start authentication process
    authenticator = GA4Authenticator()
    creds = authenticator.authenticate()
    
    if creds:
        print("\n✅ Authentication completed successfully!")
        print("\nYou can now use these credentials for GA4 API calls")
    else:
        print("\n❌ Authentication failed. Please check the errors above.")

if __name__ == "__main__":
    main()