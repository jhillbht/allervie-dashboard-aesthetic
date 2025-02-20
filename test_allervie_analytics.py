"""
Test script for Allervie Analytics
"""

from allervie_analytics import AllervieAnalytics
import pandas as pd # type: ignore
from pathlib import Path

def test_analytics_flow():
    print("=== Testing Allervie Analytics Flow ===\n")
    
    # 1. Initialize the analytics object
    print("1. Initializing AllervieAnalytics...")
    analytics = AllervieAnalytics()
    
    # 2. Initialize service
    print("\n2. Initializing service...")
    if not analytics.initialize_service():
        print("❌ Failed to initialize service")
        return False
    print("✅ Service initialized successfully")
    
    # 3. Test connection
    print("\n3. Testing connection...")
    try:
        if analytics.test_connection():
            print("✅ Connection test successful")
        else:
            print("❌ Connection test failed")
            return False
    except Exception as e:
        print(f"❌ Connection test failed with error: {str(e)}")
        return False
    
    # 4. Test data retrieval
    print("\n4. Testing data retrieval...")
    
    # Test active users
    print("\na. Getting active users data...")
    try:
        users_df = analytics.get_active_users(days=7)
        if isinstance(users_df, pd.DataFrame) and not users_df.empty:
            print("✅ Successfully retrieved active users data")
            print("\nSample data:")
            print(users_df.head())
        else:
            print("❌ Failed to get active users data")
            return False
    except Exception as e:
        print(f"❌ Error getting active users: {str(e)}")
        return False
    
    # Test traffic sources
    print("\nb. Getting traffic sources data...")
    try:
        traffic_df = analytics.get_traffic_sources(days=7)
        if isinstance(traffic_df, pd.DataFrame) and not traffic_df.empty:
            print("✅ Successfully retrieved traffic sources data")
            print("\nSample data:")
            print(traffic_df.head())
        else:
            print("❌ Failed to get traffic sources data")
            return False
    except Exception as e:
        print(f"❌ Error getting traffic sources: {str(e)}")
        return False
    
    # Test daily overview
    print("\nc. Getting daily overview data...")
    try:
        overview_df = analytics.get_daily_overview(days=7)
        if isinstance(overview_df, pd.DataFrame) and not overview_df.empty:
            print("✅ Successfully retrieved daily overview data")
            print("\nSample data:")
            print(overview_df.head())
        else:
            print("❌ Failed to get daily overview data")
            return False
    except Exception as e:
        print(f"❌ Error getting daily overview: {str(e)}")
        return False
    
    print("\n✅ All tests completed successfully!")
    return True

if __name__ == "__main__":
    # Optional: Clear existing token to test full authentication flow
    token_path = Path(__file__).parent / 'token' / 'allervie_token.json'
    if token_path.exists():
        print("Note: Existing token found. Delete it to test the full authentication flow.")
    
    test_analytics_flow() 