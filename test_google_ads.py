"""
Test Google Ads API connection using existing GCP project credentials
"""

import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.oauth2.credentials import Credentials
import json

def test_google_ads_connection():
    print("🚀 Starting Google Ads API Test")
    print("=" * 50)

    try:
        # Load credentials from existing files
        CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
        CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, 'desktop_1_client.json')
        TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')

        print("\n1️⃣ Loading credentials...")
        
        # Load client configuration
        with open(CLIENT_SECRET_FILE, 'r') as f:
            client_config = json.load(f)
            print("✅ Client configuration loaded")
        
        # Load OAuth token
        with open(TOKEN_FILE, 'r') as f:
            token_info = json.load(f)
            print("✅ OAuth token loaded")

        # Create Google Ads configuration
        google_ads_config = {
            'client_id': client_config['installed']['client_id'],
            'client_secret': client_config['installed']['client_secret'],
            'refresh_token': token_info['refresh_token'],
            'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
            'login_customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID'),
            'use_proto_plus': True
        }

        print("\n2️⃣ Initializing Google Ads client...")
        client = GoogleAdsClient.load_from_dict(google_ads_config)
        print("✅ Client initialized")

        print("\n3️⃣ Testing API connection...")
        # Get the Google Ads service
        ga_service = client.get_service("GoogleAdsService")
        
        # Simple query to test connection
        query = """
            SELECT 
                customer.id,
                customer.descriptive_name
            FROM customer
            LIMIT 1"""
        
        # Execute the query
        response = ga_service.search_stream(
            customer_id=os.getenv('GOOGLE_ADS_CUSTOMER_ID'),
            query=query
        )
        
        # Process the response
        for batch in response:
            for row in batch.results:
                print(f"\n✅ Successfully connected to account: {row.customer.descriptive_name}")
                print(f"   Account ID: {row.customer.id}")

        print("\n4️⃣ Testing campaign access...")
        campaign_query = """
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status
            FROM campaign
            ORDER BY campaign.name
            LIMIT 5"""
            
        campaign_response = ga_service.search_stream(
            customer_id=os.getenv('GOOGLE_ADS_CUSTOMER_ID'),
            query=campaign_query
        )
        
        print("\nAvailable campaigns:")
        print("-" * 40)
        for batch in campaign_response:
            for row in batch.results:
                print(f"• {row.campaign.name} (ID: {row.campaign.id})")
                print(f"  Status: {row.campaign.status}")

    except GoogleAdsException as ex:
        print(f"\n❌ Google Ads API error occurred:")
        print(f"Request ID: {ex.request_id}")
        print(f"Failure: {ex.failure}")
        print(f"Error Code: {ex.error.code().name}")
        for error in ex.failure.errors:
            print(f"\nError details:")
            print(f"  Message: {error.message}")
            if error.location:
                for field_path_element in error.location.field_path_elements:
                    print(f"  Field: {field_path_element.field_name}")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    # Check for required environment variables
    required_vars = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        print("Please set the following variables:")
        for var in missing_vars:
            print(f"export {var}='your_{var.lower()}'")
        exit(1)
        
    test_google_ads_connection() 