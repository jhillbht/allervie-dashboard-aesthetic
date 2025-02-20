"""
Allervie Analytics Tool
Provides access to Google Analytics 4 data using service account authentication.
"""

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Union
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AllervieAnalytics:
    def __init__(self, service_account_email: Optional[str] = None):
        """
        Initialize the Allervie Analytics API handler with service account authentication.
        
        Args:
            service_account_email: Email of the service account to use.
                                If not provided, will use peakaboo service account.
        """
        # Define the project directory
        self.project_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Use the peakaboo service account by default
        self.service_account_email = service_account_email or "peakaboo@allervie-dashboard.iam.gserviceaccount.com"
        
        self.ga4_service = None
        self.ua_service = None
        self.SCOPES = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics'
        ]
        
        # Default Allervie GA4 configuration
        self.DEFAULT_GA4_PROPERTY_ID = '399455767'
        
        # Set up logging
        self.setup_logging()

    def setup_logging(self):
        """Set up logging to keep track of API requests and responses."""
        log_dir = os.path.join(self.project_dir, 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, 'analytics.log')
        print(f"Logging analytics operations to: {log_file}")

    def authenticate(self) -> bool:
        """
        Authenticate with Google Analytics APIs using service account credentials.
        
        Returns:
            bool: True if authentication was successful, False otherwise.
        """
        try:
            # Look for service account key in project directory
            key_file = os.path.join(self.project_dir, 'service-account-key.json')
            
            if not os.path.exists(key_file):
                print(f"\nError: service-account-key.json not found at: {key_file}")
                print("\nTo set up the service account key:")
                print("1. Go to https://console.cloud.google.com/apis/credentials")
                print("2. Find the 'peakaboo' service account under 'Service Accounts'")
                print("3. Click on the service account and go to the 'Keys' tab")
                print("4. Click 'Add Key' > 'Create new key' > JSON")
                print(f"5. Save the downloaded file as 'service-account-key.json' in: {self.project_dir}")
                return False
            
            # Get credentials from service account
            credentials = service_account.Credentials.from_service_account_file(
                key_file,
                scopes=self.SCOPES
            )
            
            # Initialize services
            self.ga4_service = build('analyticsdata', 'v1beta', credentials=credentials)
            self.ua_service = build('analyticsreporting', 'v4', credentials=credentials)
            
            print(f"Successfully authenticated using service account: {self.service_account_email}")
            return True
            
        except Exception as e:
            print(f"Authentication failed: {e}")
            return False

    def get_ga4_property_id(self) -> str:
        """
        Get GA4 property ID from environment variables or use default Allervie ID.
        
        Returns:
            str: GA4 property ID
        """
        return os.getenv('GA4_PROPERTY_ID', self.DEFAULT_GA4_PROPERTY_ID)

    def get_date_range(self, days: int = 30) -> tuple:
        """
        Calculate date range for reports.
        
        Args:
            days: Number of days to look back
            
        Returns:
            tuple: (start_date, end_date) in YYYY-MM-DD format
        """
        end_date = datetime.now() - timedelta(days=1)  # yesterday
        start_date = end_date - timedelta(days=days-1)
        return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

    def get_ga4_report(
        self,
        dimensions: List[str],
        metrics: List[str],
        date_range_days: int = 30,
        filters: Optional[Dict] = None
    ) -> pd.DataFrame:
        """
        Get a GA4 report with specified dimensions and metrics.
        
        Args:
            dimensions: List of dimension names
            metrics: List of metric names
            date_range_days: Number of days to look back
            filters: Optional dimension or metric filters
            
        Returns:
            pandas.DataFrame: Report data
        """
        if not self.ga4_service:
            if not self.authenticate():
                return pd.DataFrame()

        property_id = self.get_ga4_property_id()
        start_date, end_date = self.get_date_range(date_range_days)
        
        try:
            request_body = {
                "dateRanges": [{
                    "startDate": start_date,
                    "endDate": end_date
                }],
                "dimensions": [{"name": d} for d in dimensions],
                "metrics": [{"name": m} for m in metrics]
            }
            
            # Add filters if provided
            if filters:
                request_body["dimensionFilter"] = filters
            
            response = self.ga4_service.properties().runReport(
                property=f"properties/{property_id}",
                body=request_body
            ).execute()
            
            # Process response into DataFrame
            data = []
            for row in response.get('rows', []):
                record = {}
                for i, value in enumerate(row['dimensionValues']):
                    record[dimensions[i]] = value['value']
                for i, value in enumerate(row['metricValues']):
                    record[metrics[i]] = value['value']
                data.append(record)
            
            df = pd.DataFrame(data)
            
            # Convert numeric columns
            for metric in metrics:
                if metric in df.columns:
                    df[metric] = pd.to_numeric(df[metric], errors='ignore')
                    
            return df
            
        except Exception as e:
            print(f"Error getting GA4 report: {e}")
            return pd.DataFrame()

    def get_active_users(self, date_range_days: int = 30) -> pd.DataFrame:
        """
        Get active users data from GA4.
        
        Args:
            date_range_days: Number of days to look back
            
        Returns:
            pandas.DataFrame: Active users data
        """
        dimensions = ['date']
        metrics = [
            'activeUsers',
            'newUsers',
            'totalUsers',
            'userEngagementDuration',
            'engagedSessions',
            'engagementRate'
        ]
        return self.get_ga4_report(dimensions, metrics, date_range_days)

    def get_traffic_sources(self, date_range_days: int = 30) -> pd.DataFrame:
        """
        Get traffic source data from GA4.
        
        Args:
            date_range_days: Number of days to look back
            
        Returns:
            pandas.DataFrame: Traffic source data
        """
        dimensions = ['sessionSource', 'sessionMedium']
        metrics = [
            'sessions',
            'activeUsers',
            'engagementRate',
            'averageSessionDuration',
            'totalRevenue'
        ]
        return self.get_ga4_report(dimensions, metrics, date_range_days)

    def get_conversion_metrics(self, date_range_days: int = 30) -> pd.DataFrame:
        """
        Get conversion metrics from GA4.
        
        Args:
            date_range_days: Number of days to look back
            
        Returns:
            pandas.DataFrame: Conversion metrics data
        """
        dimensions = ['date']
        metrics = [
            'conversions',
            'totalRevenue',
            'transactions',
            'averageRevenuePerUser',
            'purchaserConversionRate'
        ]
        return self.get_ga4_report(dimensions, metrics, date_range_days)

    def get_page_metrics(self, date_range_days: int = 30) -> pd.DataFrame:
        """
        Get page/screen metrics from GA4.
        
        Args:
            date_range_days: Number of days to look back
            
        Returns:
            pandas.DataFrame: Page metrics data
        """
        dimensions = ['pageTitle', 'pagePath']
        metrics = [
            'screenPageViews',
            'userEngagementDuration',
            'averageSessionDuration',
            'bounceRate'
        ]
        return self.get_ga4_report(dimensions, metrics, date_range_days)

def test_analytics():
    """Test function to validate the analytics setup and data retrieval."""
    # Initialize analytics
    analytics = AllervieAnalytics()
    
    print("\nTesting Allervie Analytics Integration")
    print("=====================================")
    
    # Test authentication
    if not analytics.authenticate():
        print("\n❌ Authentication failed. Please check the service account key setup.")
        return
    print("\n✅ Authentication successful")
    
    # Test active users report
    print("\nTesting Active Users Report (Last 7 Days)...")
    users_df = analytics.get_active_users(date_range_days=7)
    if not users_df.empty:
        print("\n✅ Successfully retrieved active users data:")
        print(users_df)
        
        # Calculate key metrics
        total_active_users = users_df['activeUsers'].sum()
        avg_engagement_rate = users_df['engagementRate'].mean()
        print(f"\nKey Metrics:")
        print(f"• Total Active Users: {total_active_users:,}")
        print(f"• Average Engagement Rate: {avg_engagement_rate:.2%}")
    else:
        print("❌ Failed to retrieve active users data")
    
    # Test traffic sources report
    print("\nTesting Traffic Sources Report...")
    traffic_df = analytics.get_traffic_sources(date_range_days=7)
    if not traffic_df.empty:
        print("\n✅ Successfully retrieved traffic source data:")
        print(traffic_df.sort_values('sessions', ascending=False).head())
    else:
        print("❌ Failed to retrieve traffic source data")
    
    # Test conversion metrics
    print("\nTesting Conversion Metrics Report...")
    conversions_df = analytics.get_conversion_metrics(date_range_days=7)
    if not conversions_df.empty:
        print("\n✅ Successfully retrieved conversion data:")
        print(conversions_df)
        
        # Calculate total revenue
        total_revenue = conversions_df['totalRevenue'].sum()
        print(f"\nTotal Revenue: ${total_revenue:,.2f}")
    else:
        print("❌ Failed to retrieve conversion data")
    
    # Test page metrics
    print("\nTesting Page Metrics Report...")
    pages_df = analytics.get_page_metrics(date_range_days=7)
    if not pages_df.empty:
        print("\n✅ Successfully retrieved page metrics:")
        print(pages_df.sort_values('screenPageViews', ascending=False).head())
    else:
        print("❌ Failed to retrieve page metrics")

if __name__ == "__main__":
    test_analytics()