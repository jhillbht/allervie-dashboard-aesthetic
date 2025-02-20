from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
import yaml
import os
import json
from google.oauth2.credentials import Credentials

def setup_ga_client():
    # Load OAuth credentials
    try:
        with open('credentials/token_user.json') as f:
            token_info = json.load(f)
        
        credentials = Credentials(
            token=token_info.get('token'),
            refresh_token=token_info.get('refresh_token'),
            token_uri="https://oauth2.googleapis.com/token",
            client_id=token_info.get('client_id'),
            client_secret=token_info.get('client_secret')
        )
        
        client = BetaAnalyticsDataClient(credentials=credentials)
        return client
    except Exception as e:
        print(f"Error setting up GA client: {str(e)}")
        raise

def get_ga_data(client, property_id, start_date, end_date, metrics=None, dimensions=None):
    if metrics is None:
        metrics = [Metric(name="activeUsers")]
    else:
        metrics = [Metric(name=metric) for metric in metrics]
    
    if dimensions is None:
        dimensions = [Dimension(name="date")]
    else:
        dimensions = [Dimension(name=dim) for dim in dimensions]
    
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=dimensions,
        metrics=metrics,
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
    )
    response = client.run_report(request)
    return response 