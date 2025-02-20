from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from datetime import datetime, timedelta
import os
import json
from google.oauth2.credentials import Credentials

class GoogleAdsHandler:
    def __init__(self):
        CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
        CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, 'desktop_1_client.json')
        TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')
        
        # Load existing OAuth2 credentials
        with open(CLIENT_SECRET_FILE, 'r') as f:
            client_config = json.load(f)
            
        with open(TOKEN_FILE, 'r') as f:
            token_info = json.load(f)
        
        # Create Google Ads configuration
        self.google_ads_config = {
            'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
            'login_customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID'),
            'client_id': client_config['installed']['client_id'],
            'client_secret': client_config['installed']['client_secret'],
            'refresh_token': token_info['refresh_token'],
            'use_proto_plus': True  # Recommended for better performance
        }
        
        self.client = GoogleAdsClient.load_from_dict(self.google_ads_config)
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')

    def get_campaigns(self):
        """Get list of all campaigns"""
        ga_service = self.client.get_service("GoogleAdsService")
        query = """
            SELECT 
                campaign.id,
                campaign.name
            FROM campaign
            ORDER BY campaign.name"""
        
        stream = ga_service.search_stream(customer_id=self.customer_id, query=query)
        return [row.campaign for batch in stream for row in batch.results]

    def get_performance_metrics(self, days=7, campaign_ids=None, region_ids=None):
        """Get performance metrics for specified filters"""
        ga_service = self.client.get_service("GoogleAdsService")
        
        # Build date range
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Build campaign filter if specified
        campaign_filter = ""
        if campaign_ids:
            campaign_filter = f"AND campaign.id IN ({','.join(campaign_ids)})"
            
        # Build region filter if specified
        region_filter = ""
        if region_ids:
            region_filter = f"AND geographic_view.country_criterion_id IN ({','.join(region_ids)})"
        
        query = f"""
            SELECT
                metrics.impressions,
                metrics.cost_micros,
                metrics.conversions,
                metrics.clicks,
                metrics.conversion_rate,
                metrics.ctr,
                metrics.cost_per_conversion,
                segments.date
            FROM geographic_view
            WHERE segments.date >= '{start_date}' 
                AND segments.date <= '{end_date}'
                {campaign_filter}
                {region_filter}
            ORDER BY segments.date"""
        
        try:
            stream = ga_service.search_stream(customer_id=self.customer_id, query=query)
            
            metrics = []
            for batch in stream:
                for row in batch.results:
                    metrics.append({
                        'date': row.segments.date,
                        'impressions': row.metrics.impressions,
                        'cost': row.metrics.cost_micros / 1_000_000,  # Convert micros to actual currency
                        'conversions': row.metrics.conversions,
                        'clicks': row.metrics.clicks,
                        'conversion_rate': row.metrics.conversion_rate,
                        'ctr': row.metrics.ctr,
                        'cost_per_conversion': row.metrics.cost_per_conversion
                    })
            return metrics
            
        except GoogleAdsException as ex:
            print(f"Request with ID '{ex.request_id}' failed with status "
                  f"'{ex.error.code().name}' and includes the following errors:")
            for error in ex.failure.errors:
                print(f"\tError with message '{error.message}'.")
                if error.location:
                    for field_path_element in error.location.field_path_elements:
                        print(f"\t\tOn field: {field_path_element.field_name}")
            return None 