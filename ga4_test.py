"""
GA4 verification with correct client credentials
"""

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
from pathlib import Path

class GA4Tester:
    def __init__(self):
        self.PROPERTY_ID = '399455767'
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.CLIENT_SECRET_FILE = 'client_secret_22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com.json'
        self.TOKEN_PATH = Path('token/ga4_token.json')
        
        # Create token directory if it doesn't exist
        self.TOKEN_PATH.parent.mkdir(exist_ok=True)

    def authenticate(self):
        """Handle authentication flow"""
        print("\n=== GA4 Authentication ===")
        creds = None

        # Load existing token if available
        if self.TOKEN_PATH.exists():
            try:
                creds = Credentials.from_authorized_user_file(str(self.TOKEN_PATH), self.SCOPES)
                print("Found existing token")
            except Exception as e:
                print(f"Error loading existing token: {e}")

        # If no valid credentials available, authenticate
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Refreshing expired token...")
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing token: {e}")
                    creds = None

            if not creds:
                print("Starting new authentication flow...")
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.CLIENT_SECRET_FILE,
                        self.SCOPES,
                        redirect_uri='http://localhost:0'
                    )
                    creds = flow.run_local_server(port=0)
                    
                    # Save the credentials
                    with open(self.TOKEN_PATH, 'w') as token:
                        token.write(creds.to_json())
                    print("✅ New credentials saved successfully")
                except Exception as e:
                    print(f"❌ Error in authentication flow: {e}")
                    return None

        return creds

    def test_ga4_connection(self, creds):
        """Test connection to GA4"""
        print("\n=== Testing GA4 Connection ===")
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            # Test with simple request
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

            # Parse response
            users = int(response['rows'][0]['metricValues'][0]['value'])
            print(f"✅ Successfully connected to GA4!")
            print(f"Active users (last 24h): {users}")
            return True

        except Exception as e:
            print(f"❌ Error testing GA4 connection: {e}")
            return False

def main():
    """Main test function"""
    tester = GA4Tester()
    
    # Step 1: Authenticate
    creds = tester.authenticate()
    if not creds:
        print("❌ Authentication failed")
        return

    # Step 2: Test connection
    if not tester.test_ga4_connection(creds):
        print("❌ Connection test failed")
        return

    print("\n✅ All tests completed successfully!")

if __name__ == "__main__":
    main()