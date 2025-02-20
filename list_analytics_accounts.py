"""
List all GA4 properties accessible to the authenticated user
"""

import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest

# Path to the credentials
CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')
PROPERTY_ID = '399455767'  # Your GA4 property ID

def list_accounts():
    """List all GA4 accounts and properties."""
    try:
        # Load credentials from the token file
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, [
            'https://www.googleapis.com/auth/analytics.readonly'
        ])

        # Create the GA4 Data API client
        client = BetaAnalyticsDataClient(credentials=creds)
        
        print("\n📊 GA4 Property Information:")
        print("=" * 50)
        
        # Test connection with a simple request
        request = RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            date_ranges=[{"start_date": "yesterday", "end_date": "yesterday"}],
            metrics=[{"name": "activeUsers"}]
        )
        
        response = client.run_report(request)
        
        print(f"\n🏢 Property ID: {PROPERTY_ID}")
        print(f"   Active Users (Yesterday): {response.rows[0].metric_values[0].value}")
        
        # Try to get additional property information using discovery API
        analytics = build('analyticsdata', 'v1beta', credentials=creds)
        
        try:
            metadata = analytics.properties().getMetadata(
                name=f"properties/{PROPERTY_ID}/metadata"
            ).execute()
            
            print("\n📊 Property Metadata:")
            print("-" * 40)
            print(f"Available Metrics: {len(metadata.get('metrics', []))}")
            print(f"Available Dimensions: {len(metadata.get('dimensions', []))}")
            
        except Exception as e:
            print(f"\n⚠️ Could not fetch metadata: {str(e)}")

    except Exception as e:
        print(f"❌ Error accessing GA4: {str(e)}")
        print("\nPlease verify:")
        print("1. Your internet connection is working")
        print("2. The Property ID is correct")
        print("3. You have access to this GA4 property")
        print("4. The OAuth credentials are valid")

if __name__ == "__main__":
    print("🚀 Starting GA4 Property Check")
    print("=" * 50)
    
    # First install required package if not present
    try:
        import pkg_resources
        pkg_resources.require('google-analytics-data')
    except:
        print("Installing required package...")
        os.system('pip install google-analytics-data')
        print("Package installed. Running main program...")
    
    list_accounts()