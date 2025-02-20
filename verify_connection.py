"""
Verify GA4 connection for Allervie Analytics
"""

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from pathlib import Path
import time

class GA4Verifier:
    def __init__(self):
        self.PROPERTY_ID = '399455767'
        self.token_path = Path('token/allervie_token.json')
        self.service = None

    def verify_credentials(self):
        """Verify if we have valid credentials."""
        print("\nVerifying credentials...")
        
        if not self.token_path.exists():
            print("❌ No token file found")
            return False
            
        try:
            creds = Credentials.from_authorized_user_file(
                str(self.token_path), 
                ['https://www.googleapis.com/auth/analytics.readonly']
            )
            
            if not creds.valid:
                if creds.expired and creds.refresh_token:
                    print("Refreshing expired credentials...")
                    creds.refresh(Request())
                else:
                    print("❌ Invalid credentials")
                    return False
                    
            print("✅ Credentials verified")
            return creds
            
        except Exception as e:
            print(f"❌ Error verifying credentials: {str(e)}")
            return False

    def test_ga4_connection(self, creds):
        """Test connection to GA4 API."""
        print("\nTesting GA4 connection...")
        
        try:
            self.service = build('analyticsdata', 'v1beta', credentials=creds)
            
            # Simple test request
            response = self.service.properties().runReport(
                property=f"properties/{self.PROPERTY_ID}",
                body={
                    "dateRanges": [{"startDate": "yesterday", "endDate": "today"}],
                    "metrics": [{"name": "activeUsers"}]
                }
            ).execute()
            
            users = int(response['rows'][0]['metricValues'][0]['value'])
            print(f"✅ Successfully connected to GA4")
            print(f"Active users (last 24h): {users}")
            return True
            
        except Exception as e:
            print(f"❌ Error testing GA4 connection: {str(e)}")
            return False

    def verify_full_access(self):
        """Run full verification of GA4 access."""
        print("=== Allervie Analytics Connection Verification ===")
        
        # Step 1: Verify credentials
        creds = self.verify_credentials()
        if not creds:
            return False
            
        # Step 2: Test GA4 connection with retry
        max_retries = 3
        for attempt in range(max_retries):
            if attempt > 0:
                print(f"\nRetry attempt {attempt + 1}/{max_retries}...")
                time.sleep(2)  # Wait between retries
                
            if self.test_ga4_connection(creds):
                return True
                
        return False

def main():
    verifier = GA4Verifier()
    success = verifier.verify_full_access()
    
    if success:
        print("\n✅ Full verification completed successfully!")
    else:
        print("\n❌ Verification failed. Please check the errors above.")

if __name__ == "__main__":
    main()