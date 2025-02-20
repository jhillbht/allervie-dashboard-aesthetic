"""
Direct HTTP verification for GA4 connection
"""

from google.oauth2.credentials import Credentials
import requests
import json
from pathlib import Path

def verify_ga4_connection():
    print("=== GA4 Direct HTTP Connection Test ===")
    
    # Load credentials
    token_path = Path('token/allervie_token.json')
    
    if not token_path.exists():
        print("❌ No token file found")
        return False
        
    try:
        print("\n1. Loading credentials...")
        with open(token_path) as f:
            cred_data = json.load(f)
            
        # Create a session with the token
        session = requests.Session()
        session.headers.update({
            'Authorization': f'Bearer {cred_data["token"]}',
            'Content-Type': 'application/json'
        })
        
        print("✅ Credentials loaded")
        
        # Test GA4 API
        print("\n2. Testing GA4 API connection...")
        property_id = "399455767"
        url = f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}/runReport"
        
        payload = {
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
        
        response = session.post(url, json=payload)
        
        print(f"Response Status Code: {response.status_code}")
        print("\nResponse Content:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            print("\n✅ Successfully connected to GA4!")
            return True
        else:
            print(f"\n❌ Connection failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"\n❌ Error during verification: {str(e)}")
        return False

if __name__ == "__main__":
    verify_ga4_connection()