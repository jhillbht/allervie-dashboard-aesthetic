"""
Test GA4 metrics connection and data display
"""

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest
from google.oauth2.credentials import Credentials
import os
import json

CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')
PROPERTY_ID = '399455767'

def test_metrics_connection():
    print("🚀 Testing GA4 Metrics Connection")
    print("=" * 50)
    
    try:
        # Load credentials
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, [
            'https://www.googleapis.com/auth/analytics.readonly'
        ])
        
        # Initialize client
        client = BetaAnalyticsDataClient(credentials=creds)
        
        # Test all dashboard metrics
        request = RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            date_ranges=[
                {"start_date": "yesterday", "end_date": "yesterday"},
                {"start_date": "2daysAgo", "end_date": "2daysAgo"}
            ],
            metrics=[
                # Top Row Metrics
                {"name": "conversions"},
                {"name": "totalRevenue"},
                {"name": "sessions"},
                {"name": "engagementRate"},
                
                # Bottom Row Metrics
                {"name": "bounceRate"},
                {"name": "averageSessionDuration"}
            ]
        )
        
        response = client.run_report(request)
        
        print("\n✅ Data Retrieved Successfully!")
        
        # Today's metrics
        today = response.rows[0]
        yesterday = response.rows[1]
        
        print("\n📊 Current Metrics:")
        print("-" * 40)
        
        metrics = {
            'Conversion Rate': f"{(float(today.metric_values[0].value) / float(today.metric_values[2].value)) * 100:.2f}%",
            'Revenue': f"${float(today.metric_values[1].value):,.2f}",
            'Sessions': f"{int(today.metric_values[2].value):,}",
            'Engagement Rate': f"{float(today.metric_values[3].value) * 100:.1f}%",
            'Bounce Rate': f"{float(today.metric_values[4].value) * 100:.1f}%",
            'Avg Session Duration': f"{float(today.metric_values[5].value):.0f} seconds"
        }
        
        for metric, value in metrics.items():
            print(f"{metric}: {value}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_metrics_connection() 