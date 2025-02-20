"""
Allervie Analytics Authentication Module
Handles OAuth 2.0 flow with proper web application credentials
"""

import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from pathlib import Path
import json
import socket

class AllervieAuth:
    def __init__(self):
        # Initialize paths and configurations
        self.base_path = Path('/Users/supabowl/Downloads/Cursor/Allervie Analytics Test')
        self.credentials_path = self.base_path / 'gcp-oauth.keys.json'
        self.token_dir = self.base_path / 'token'
        self.token_path = self.token_dir / 'allervie_token.json'
        
        # GA4 specific configurations
        self.property_id = '399455767'  # Allervie GA4 Property ID
        self.scopes = ['https://www.googleapis.com/auth/analytics.readonly']
        
        # Available ports from credentials
        self.redirect_ports = [49152, 49153, 49154, 49155]
        
        # Create token directory if it doesn't exist
        self.token_dir.mkdir(exist_ok=True)
        
        # Store the credentials configuration
        self.creds_config = {
            "web": {
                "client_id": "22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com",
                "project_id": "allervie-dashboard",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": "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",
                "redirect_uris": [
                    f"http://localhost:{port}" for port in [49152, 49153, 49154, 49155]
                ]
            }
        }

    def find_available_port(self):
        """Find the first available port from the configured list"""
        for port in self.redirect_ports:
            try:
                # Try to create a socket with the port
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.bind(('localhost', port))
                sock.close()
                return port
            except socket.error:
                continue
        return None

    def save_credentials_file(self):
        """Save the credentials configuration to a file"""
        print("\nSaving credentials configuration...")
        try:
            with open(self.credentials_path, 'w') as f:
                json.dump(self.creds_config, f, indent=2)
            print("✅ Credentials file saved successfully")
            return True
        except Exception as e:
            print(f"❌ Error saving credentials: {e}")
            return False

    def authenticate(self):
        """Handle the complete OAuth 2.0 flow"""
        print("\n=== Allervie Analytics Authentication ===")
        
        # First, ensure credentials file exists
        if not self.save_credentials_file():
            return None
        
        # Check for existing token
        print("\n1. Checking for existing token...")
        creds = None
        if self.token_path.exists():
            try:
                creds = Credentials.from_authorized_user_file(str(self.token_path), self.scopes)
                print("Found existing token")
            except Exception as e:
                print(f"Error loading existing token: {e}")
        
        # Handle token refresh or new authentication
        if creds and creds.valid:
            print("✅ Existing token is valid")
        else:
            if creds and creds.expired and creds.refresh_token:
                print("Token expired, attempting refresh...")
                try:
                    creds.refresh(Request())
                    print("✅ Token refreshed successfully")
                except Exception as e:
                    print(f"❌ Error refreshing token: {e}")
                    creds = None
            
            if not creds:
                print("\n2. Starting new authentication flow...")
                
                # Find an available port
                port = self.find_available_port()
                if not port:
                    print("❌ No available ports found from the configured list")
                    return None
                
                print(f"Using port {port} for authentication...")
                
                try:
                    # Create flow with the available port
                    flow = InstalledAppFlow.from_client_secrets_file(
                        str(self.credentials_path),
                        self.scopes,
                        redirect_uri=f'http://localhost:{port}'
                    )
                    
                    print("\nPlease authenticate using data@bluehighlightedtext.com")
                    creds = flow.run_local_server(
                        port=port,
                        prompt='consent',
                        authorization_prompt_message="Please sign in with data@bluehighlightedtext.com"
                    )
                    
                    # Save the new token
                    with open(self.token_path, 'w') as token:
                        token.write(creds.to_json())
                    print("✅ New token saved successfully")
                
                except Exception as e:
                    print(f"❌ Authentication error: {e}")
                    return None
        
        return creds

    def test_ga4_connection(self, creds):
        """Test the GA4 API connection"""
        print("\n3. Testing GA4 connection...")
        try:
            service = build('analyticsdata', 'v1beta', credentials=creds)
            
            # Make a simple request
            response = service.properties().runReport(
                property=f"properties/{self.property_id}",
                body={
                    "dateRanges": [{"startDate": "yesterday", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            
            users = response['rows'][0]['metricValues'][0]['value']
            print(f"✅ Connection successful! Active users: {users}")
            return True
            
        except Exception as e:
            print(f"❌ Connection error: {e}")
            if hasattr(e, 'response'):
                print(f"Response status: {e.response.status_code}")
                print(f"Response text: {e.response.text}")
            return False

def main():
    """Main execution flow"""
    auth = AllervieAuth()
    
    # Step 1: Authenticate
    creds = auth.authenticate()
    if not creds:
        print("\n❌ Authentication failed")
        return
    
    # Step 2: Test connection
    if auth.test_ga4_connection(creds):
        print("\n✅ Authentication and connection test completed successfully!")
    else:
        print("\n❌ Connection test failed. Please check the errors above.")

if __name__ == "__main__":
    main()