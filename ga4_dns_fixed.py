"""
GA4 Connection with Direct DNS Resolution
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
from pathlib import Path
import json
import requests
import dns.resolver
import socket

class GA4DirectConnector:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        self.CREDS_FILE = 'client_secret_22083613754-d1omeg2958vrsndpqg2v1jp0ncm7sr23.apps.googleusercontent.com.json'
        self.TOKEN_DIR = Path('token')
        self.TOKEN_PATH = self.TOKEN_DIR / 'allervie_token.json'
        self.PROPERTY_ID = '399455767'
        
        # Create token directory if it doesn't exist
        self.TOKEN_DIR.mkdir(exist_ok=True)
        
        # Configure DNS resolver to use Google's DNS
        self.resolver = dns.resolver.Resolver()
        self.resolver.nameservers = ['8.8.8.8', '8.8.4.4']  # Google's DNS servers

    def resolve_api_domain(self):
        """Resolve API domain using Google DNS"""
        print("\nResolving API domain using Google DNS...")
        try:
            answers = self.resolver.resolve('analyticsdata.googleapis.com', 'A')
            return str(answers[0])
        except Exception as e:
            print(f"DNS resolution error: {e}")
            return None

    def authenticate(self):
        """Complete authentication flow"""
        print("=== GA4 Authentication Process ===")
        
        # Clean up existing tokens
        if self.TOKEN_PATH.exists():
            os.remove(self.TOKEN_PATH)
            print("Cleaned up existing token")
        
        try:
            print("\n1. Starting authentication flow...")
            print(f"Using credentials file: {self.CREDS_FILE}")
            
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
            print(f"Current directory: {os.getcwd()}")
            print(f"Files in directory: {os.listdir('.')}")
            return None

    def test_connection(self, creds):
        """Test GA4 API connection with direct IP"""
        print("\n2. Testing API connection...")
        
        # Resolve API domain
        api_ip = self.resolve_api_domain()
        if not api_ip:
            print("❌ Failed to resolve API domain")
            return False
            
        print(f"✅ Resolved API IP: {api_ip}")
        
        # Test API access
        try:
            headers = {
                'Authorization': f'Bearer {creds.token}',
                'Content-Type': 'application/json',
                'Host': 'analyticsdata.googleapis.com'  # Important: set correct host header
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
            # Use requests with session to maintain connection
            session = requests.Session()
            response = session.post(
                url, 
                headers=headers, 
                json=data,
                verify=True  # Ensure SSL verification is enabled
            )
            
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
            if hasattr(e, 'response'):
                print(f"Response status: {e.response.status_code}")
                print(f"Response text: {e.response.text}")
            return False

def main():
    # First, install required package
    try:
        import dns.resolver
    except ImportError:
        print("Installing required package...")
        os.system('pip install dnspython')
        import dns.resolver
    
    connector = GA4DirectConnector()
    
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