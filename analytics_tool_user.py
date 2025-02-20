"""
Allervie Analytics User Tool
Handles user-based authentication and automatic account/property listing for Google Analytics
"""

import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import time
from http.server import SimpleHTTPRequestHandler, HTTPServer

class AllervieAnalyticsUser:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        
        # Create credentials directory if it doesn't exist
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        self.CREDENTIALS_PATH = os.path.join(self.credentials_dir, 'desktop_1_client.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'token_user.json')
        
        self.analytics_service = None
        self.admin_service = None
        
        print("\nAllervie Analytics Authentication Setup")
        print("=====================================")
        print(f"Checking credentials in: {self.credentials_dir}")

    def authenticate_and_list(self):
        """Combined method to handle authentication and immediately list accounts/properties."""
        SCOPES = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit'
        ]
        creds = None
        PORTS = [8080, 8081, 8082]

        # Check and handle credentials file
        if not os.path.exists(self.CREDENTIALS_PATH):
            old_client_path = os.path.join(self.base_dir, 'desktop 1 client.json')
            if os.path.exists(old_client_path):
                print("Moving client secrets file to credentials directory...")
                os.rename(old_client_path, self.CREDENTIALS_PATH)
            else:
                print("\n⚠️  Client secrets file not found!")
                print("Please ensure you have:")
                print("1. Downloaded the OAuth 2.0 client secrets from Google Cloud Console")
                print("2. Renamed it to 'desktop_1_client.json'")
                print(f"3. Placed it in: {self.credentials_dir}")
                return False

        # Try to load existing token
        if os.path.exists(self.TOKEN_PATH):
            try:
                creds = Credentials.from_authorized_user_file(self.TOKEN_PATH, SCOPES)
                print("Found existing credentials...")
            except Exception as e:
                print(f"Error with existing credentials: {str(e)}")
                os.remove(self.TOKEN_PATH)

        # Handle authentication
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Refreshing expired credentials...")
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing credentials: {str(e)}")
                    if os.path.exists(self.TOKEN_PATH):
                        os.remove(self.TOKEN_PATH)
                    return self.authenticate_and_list()
            else:
                print("\nStarting new authentication flow...")
                print("Please sign in with your Google account in the browser window that opens.")
                
                for port in PORTS:
                    try:
                        flow = InstalledAppFlow.from_client_secrets_file(
                            self.CREDENTIALS_PATH,
                            SCOPES
                        )
                        creds = flow.run_local_server(
                            port=port,
                            success_message='Successfully signed in! You can close this window.',
                            authorization_prompt_message='Please sign in to your Google account.',
                            open_browser=True
                        )
                        break
                    except OSError:
                        if port == PORTS[-1]:
                            print("❌ All ports are busy. Please try again in a few minutes.")
                            return False
                        continue
                    except Exception as e:
                        print(f"Authentication error: {str(e)}")
                        return False

        # Save credentials and initialize services
        try:
            with open(self.TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())
            
            print("\n🔄 Initializing Analytics services...")
            self.analytics_service = build('analyticsdata', 'v1beta', credentials=creds)
            self.admin_service = build('analyticsadmin', 'v1beta', credentials=creds)
            
            print("✅ Successfully authenticated!\n")
            
            # Immediately list accounts and properties
            print("\n📊 Fetching your Google Analytics accounts and properties...")
            print("=" * 60)
            time.sleep(1)  # Brief pause for better readability
            
            self.list_accounts_and_properties()
            return True
            
        except Exception as e:
            print(f"Setup error: {str(e)}")
            return False

    def list_accounts_and_properties(self):
        """List all accessible Google Analytics accounts and properties."""
        try:
            account_response = self.admin_service.accounts().list().execute()
            accounts = account_response.get('accounts', [])
            
            if not accounts:
                print("📭 No Google Analytics accounts found.")
                print("Make sure you signed in with the correct Google account.")
                return
            
            for account in accounts:
                account_name = account.get('displayName', 'Unnamed Account')
                account_id = account.get('name', '').split('/')[-1]
                
                print(f"\n📁 Account: {account_name}")
                print(f"   ID: {account_id}")
                print("-" * 60)
                
                try:
                    property_response = self.admin_service.properties().list(
                        filter=f"parent:accounts/{account_id}"
                    ).execute()
                    
                    properties = property_response.get('properties', [])
                    
                    if properties:
                        print("\n   Properties:")
                        for prop in properties:
                            prop_name = prop.get('displayName', 'Unnamed Property')
                            prop_id = prop.get('name', '').split('/')[-1]
                            
                            print(f"\n   📊 {prop_name}")
                            print(f"      Property ID: {prop_id}")
                            
                            try:
                                details = self.admin_service.properties().get(
                                    name=f"properties/{prop_id}"
                                ).execute()
                                
                                if 'websiteUrl' in details:
                                    print(f"      🌐 Website: {details['websiteUrl']}")
                                if 'timeZone' in details:
                                    print(f"      🕒 Timezone: {details['timeZone']}")
                                if 'currencyCode' in details:
                                    print(f"      💰 Currency: {details['currencyCode']}")
                            except:
                                pass  # Skip additional details if not available
                    else:
                        print("\n   📭 No properties found in this account.")
                
                except Exception as e:
                    print(f"\n   ⚠️  Couldn't fetch properties: {str(e)}")
            
            print("\n✨ Account and Property listing complete!")
            
        except HttpError as error:
            print(f"\n❌ HTTP error occurred: {error.resp.status} - {error.content}")
        except Exception as e:
            print(f"\n❌ Error listing accounts and properties: {str(e)}")

    def serve_html(self):
        handler = SimpleHTTPRequestHandler
        PORTS = [5000, 8000, 8001, 8002]  # Try port 5000 first
        for port in PORTS:
            try:
                httpd = HTTPServer(('localhost', port), handler)
                print(f"Serving on http://localhost:{port}")
                os.system(f"open http://localhost:{port}/properties.html")
                httpd.serve_forever()
                break
            except OSError:
                print(f"Port {port} is busy, trying next port...")
                continue

def main():
    """Main function that combines authentication and listing in one smooth flow."""
    analytics = AllervieAnalyticsUser()
    analytics.authenticate_and_list()

if __name__ == "__main__":
    main()