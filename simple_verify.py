"""
Simple verification for GA4 connection using environment proxy settings
"""

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from pathlib import Path
import json

def verify_connection():
    print("=== Simple GA4 Connection Test ===")
    
    # Check for token
    token_path = Path('token/allervie_token.json')
    if not token_path.exists():
        print("❌ Token file not found")
        return False
    
    try:
        # Load credentials
        print("\n1. Loading credentials...")
        creds = Credentials.from_authorized_user_file(
            str(token_path),
            ['https://www.googleapis.com/auth/analytics.readonly']
        )
        
        # Check if refresh needed
        if creds.expired and creds.refresh_token:
            print("Refreshing expired credentials...")
            creds.refresh(Request())
            # Save refreshed credentials
            with open(token_path, 'w') as f:
                f.write(creds.to_json())
        
        print("✅ Credentials loaded and valid")
        
        # Create service
        print("\n2. Creating GA4 service...")
        service = build(
            'analyticsdata', 
            'v1beta', 
            credentials=creds,
            cache_discovery=False
        )
        print("✅ Service created")
        
        # Make a simple request
        print("\n3. Testing GA4 connection...")
        response = service.properties().runReport(
            property="properties/399455767",
            body={
                "dateRanges": [
                    {
                        "startDate": "7daysAgo",
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
        
        # Process response
        print("\nConnection successful! Here's your data:")
        try:
            users = response['rows'][0]['metricValues'][0]['value']
            print(f"Active users (last 7 days): {users}")
        except (KeyError, IndexError):
            print("No user data found in the response")
            
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check your internet connection")
        print("2. Verify VPN/proxy settings if you're using any")
        print("3. Try removing the token file and re-authenticating")
        return False

if __name__ == "__main__":
    if verify_connection():
        print("\n✅ Verification completed successfully!")
    else:
        print("\n❌ Verification failed. See errors above.")