"""
GA4 Connection Test with Alternate HTTP Client
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
from pathlib import Path
import json
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import socket

class GA4Connector:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.CREDS_FILE = 'gcp-oauth.keys.json'
        self.TOKEN_DIR = Path('token')
        self.TOKEN_PATH = self.TOKEN_DIR / 'allervie_token.json'
        self.PROPERTY_ID = '399455767'
        
        # Create token directory if it doesn't exist
        self.TOKEN_DIR.mkdir(exist_ok=True)
        
        # Create session with retry strategy
        self.session = self._create_session()

    def _create_session(self):
        """Create requests session with retry strategy"""
        session = requests.Session()
        retry = Retry(
            total=3,
            backoff_factor=0.5,
            status_forcelist=[500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('http://', adapter)
        session.mount('https://', adapter)
        return session

    def authenticate(self):
        """Complete authentication flow"""
        print("=== GA4 Authentication Process ===")
        
        # Clean up existing tokens
        if self.TOKEN_PATH.exists():
            os.remove(self.TOKEN_PATH)
            print("Cleaned up existing token")
        
        try:
            print("\n1. Starting authentication flow...")
            flow = InstalledAppFlow.from_client_secrets_file(
                self.CREDS_FILE,
                self.SCOPES,
                redirect_uri='http://localhost:8085'
            )
            
            print("\nPlease log in with data@bluehighlightedtext.com when the browser opens")
            creds = flow.run_local_server(
                port=8085,
                prompt='consent'
            )
            
            # Save the credentials
            with open(self.TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())
            print("✅ Authentication successful")
            
            return creds
            
        except Exception as e:
            print(f"❌ Authentication error: {str(e)}")
            return None

    def test_connection(self, creds):
        """Test GA4 API connection"""
        print("\n2. Testing API connection...")
        
        # First test basic connectivity
        test_hosts = [
            'www.googleapis.com',
            'analyticsdata.googleapis.com'
        ]
        
        for host in test_hosts:
            try:
                print(f"\nTesting connection to {host}...")
                sock = socket.create_connection((host, 443), timeout=5)
                sock.close()
                print(f"✅ Socket connection successful")
            except Exception as e:
                print(f"❌ Socket connection failed: {str(e)}")
                continue
        
        # Now test API access
        try:
            headers = {
                'Authorization': f'Bearer {creds.token}',
                'Content-Type': 'application/json'
            }
            
            url = f'https://analyticsdata.googleapis.com/v1beta/properties/{self.PROPERTY_ID}/runReport'
            
            data = {
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
            
            print("\n3. Making API request...")
            response = self.session.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                print("✅ API request successful!")
                result = response.json()
                if 'rows' in result:
                    users = result['rows'][0]['metricValues'][0]['value']
                    print(f"\nActive users (last 24h): {users}")
                return True
            else:
                print(f"❌ API request failed with status {response.status_code}")
                print("Response:", response.text)
                return False
                
        except Exception as e:
            print(f"❌ API test error: {str(e)}")
            return False

def main():
    connector = GA4Connector()
    
    # Step 1: Authenticate
    creds = connector.authenticate()
    if not creds:
        print("\n❌ Authentication failed")
        return
    
    # Step 2: Test connection
    if connector.test_connection(creds):
        print("\n✅ Connection test completed successfully!")
    else:
        print("\n❌ Connection test failed. Please check the errors above.")

if __name__ == "__main__":
    main()