"""
Quick OAuth test script
"""

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
import json

def test_ga4():
    try:
        with open('credentials/gcp-oauth.keys.json') as f:
            credentials = json.load(f)
        
        client = BetaAnalyticsDataClient.from_service_account_info({
            "client_id": credentials['client_id'],
            "client_secret": credentials['client_secret'],
            "refresh_token": credentials['refresh_token'],
            "type": "authorized_user"
        })
        
        request = RunReportRequest(
            property="properties/399455767",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        
        response = client.run_report(request)
        
        for row in response.rows:
            print(f"Date: {row.dimension_values[0].value}, Active Users: {row.metric_values[0].value}")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if test_ga4():
        print("GA4 test successful!")
    else:
        print("GA4 test failed")