"""
Test script for Allervie Analytics
"""

from allervie_analytics import AllervieAnalytics
import os

def main():
    # Initialize analytics
    print("Initializing Allervie Analytics...")
    analytics = AllervieAnalytics()
    
    # Remove existing token to force new authentication
    token_path = os.path.join(os.path.dirname(__file__), 'token', 'allervie_token.json')
    if os.path.exists(token_path):
        os.remove(token_path)
        print("Removed existing token to force new authentication")
    
    # Initialize service
    if not analytics.initialize_service():
        print("Failed to initialize analytics service")
        return
    
    # Test connection
    if not analytics.test_connection():
        print("Failed to connect to GA4")
        return
    
    # Test different reports
    print("\n1. Getting Active Users Report (Last 7 days)...")
    users_df = analytics.get_active_users(days=7)
    if users_df is not None:
        print("\nActive Users Report:")
        print(users_df)
    
    print("\n2. Getting Traffic Sources Report (Last 7 days)...")
    traffic_df = analytics.get_traffic_sources(days=7)
    if traffic_df is not None:
        print("\nTraffic Sources Report:")
        print(traffic_df)
    
    print("\n3. Getting Daily Overview Report (Last 7 days)...")
    overview_df = analytics.get_daily_overview(days=7)
    if overview_df is not None:
        print("\nDaily Overview Report:")
        print(overview_df)

if __name__ == "__main__":
    main()