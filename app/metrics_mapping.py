"""
Mapping configuration for GA4 metrics for Allervie dashboard
"""

from google.ads.googleads.client import GoogleAdsClient

METRICS_CONFIG = {
    # First row metrics
    'total_visitors': {
        'title': 'Total Visitors',
        'metric': 'totalUsers',
        'type': 'number',
        'icon': 'users',
        'description': 'Total number of unique visitors'
    },
    'page_views': {
        'title': 'Page Views',
        'metric': 'screenPageViews',
        'type': 'number',
        'icon': 'eye',
        'description': 'Total number of pages viewed'
    },
    'avg_session_duration': {
        'title': 'Average Session Duration',
        'metric': 'averageSessionDuration',
        'type': 'duration',
        'icon': 'clock',
        'description': 'Average time spent per session'
    },
    
    # Second row metrics
    'bounce_rate': {
        'title': 'Bounce Rate',
        'metric': 'bounceRate',
        'type': 'percentage',
        'icon': 'log-out',
        'description': 'Percentage of single-page sessions'
    },
    'engagement_rate': {
        'title': 'Engagement Rate',
        'metric': 'engagementRate',
        'type': 'percentage',
        'icon': 'trending-up',
        'description': 'Percentage of engaged sessions'
    },
    'pages_per_session': {
        'title': 'Pages / Session',
        'metric': 'screenPageViewsPerSession',
        'type': 'number',
        'icon': 'file-text',
        'description': 'Average number of pages viewed per session'
    }
}

# Add dimension mappings if needed
DIMENSIONS_CONFIG = {
    'date': {
        'name': 'date',
        'type': 'date',
        'format': 'YYYY-MM-DD'
    },
    'device': {
        'name': 'device',
        'type': 'string'
    },
    'country': {
        'name': 'country',
        'type': 'string'
    }
}

GOOGLE_ADS_CONFIG = {
    'metrics': {
        'impressions': {
            'title': 'Impressions',
            'metric': 'metrics.impressions',
            'type': 'number',
            'icon': 'eye',
            'description': 'Number of times your ads were shown'
        },
        'cost': {
            'title': 'Cost',
            'metric': 'metrics.cost_micros',
            'type': 'currency',
            'icon': 'dollar-sign',
            'description': 'Total cost of advertising'
        },
        'conversions': {
            'title': 'Conversions',
            'metric': 'metrics.conversions',
            'type': 'number',
            'icon': 'check-circle',
            'description': 'Total conversion actions'
        },
        'clicks': {
            'title': 'Clicks',
            'metric': 'metrics.clicks',
            'type': 'number',
            'icon': 'mouse-pointer',
            'description': 'Number of clicks on your ads'
        },
        'conversion_rate': {
            'title': 'Conversion Rate',
            'metric': 'metrics.conversion_rate',
            'type': 'percentage',
            'icon': 'percent',
            'description': 'Percentage of clicks that resulted in conversions'
        },
        'ctr': {
            'title': 'Click-Through Rate',
            'metric': 'metrics.ctr',
            'type': 'percentage',
            'icon': 'activity',
            'description': 'Percentage of impressions that resulted in clicks'
        },
        'cost_per_conversion': {
            'title': 'Cost / Conversion',
            'metric': 'metrics.cost_per_conversion',
            'type': 'currency',
            'icon': 'trending-up',
            'description': 'Average cost per conversion'
        }
    },
    'segments': {
        'campaign': {
            'name': 'campaign.name',
            'type': 'string',
            'description': 'Campaign name'
        },
        'region': {
            'name': 'geographic_view.country_criterion_id',
            'type': 'string',
            'description': 'Geographic location'
        }
    }
} 