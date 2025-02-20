"""
Routes for Allervie Analytics Dashboard
"""

from flask import render_template, jsonify, request, redirect, url_for, session, flash, current_app
from app import app
from app.analytics import AllervieAnalytics
from app.auth import GoogleAuth, login_required
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
from datetime import datetime, timedelta
from app.metrics_mapping import METRICS_CONFIG, DIMENSIONS_CONFIG
import json
from .ga_integration import get_ga_data

# Initialize services
analytics = AllervieAnalytics()
auth = GoogleAuth()

SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
CREDENTIALS_DIR = "/Users/supabowl/Downloads/Cursor/Allervie Analytics Test/credentials"
CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, 'desktop_1_client.json')
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token_user.json')
GCP_OAUTH_KEYS = os.path.join(CREDENTIALS_DIR, 'gcp-oauth.keys.json')
CLIENT_SECRET_ORIGINAL = os.path.join(CREDENTIALS_DIR, 'client_secret.json')
GA4_CREDENTIALS = os.path.join(CREDENTIALS_DIR, 'ga4-credentials.yaml')
PROPERTY_ID = '399455767'

@app.route('/login')
def login():
    """Login page."""
    if auth.is_authorized():
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/authorize')
def authorize():
    """Start OAuth2.0 flow."""
    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES
    )
    flow.redirect_uri = auth.REDIRECT_URI
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    """Handle OAuth2.0 callback."""
    try:
        flow = auth.initialize_flow()
        flow.redirect_uri = auth.REDIRECT_URI
        
        authorization_response = request.url
        flow.fetch_token(authorization_response=authorization_response)
        
        credentials = flow.credentials
        session['credentials'] = auth.credentials_to_dict(credentials)
        
        # Get user info
        user_info = auth.get_user_info(credentials)
        if user_info and user_info.get('email') == auth.ALLOWED_EMAIL:
            session['email'] = user_info['email']
            # Redirect to production URL after successful authentication
            if os.getenv('FLASK_ENV') == 'development':
                return redirect('https://allervie.bluehighlightedtext.com')
            return redirect(url_for('dashboard'))
        else:
            flash('Unauthorized email address')
            return redirect(url_for('login'))
            
    except Exception as e:
        print(f"OAuth callback error: {str(e)}")
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    """Logout user."""
    session.clear()
    return redirect(url_for('login'))

@app.route('/')
@login_required
def dashboard():
    # Get GA client from app config
    ga_client = current_app.config['GA_CLIENT']
    
    # Get data for last 7 days
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    # Fetch all metrics data
    metrics_data = {}
    for metric in METRICS_CONFIG:
        try:
            response = get_ga_data(
                ga_client,
                PROPERTY_ID,
                start_date,
                end_date,
                metrics=[METRICS_CONFIG[metric]['metric']]
            )
            metrics_data[metric] = process_metric_response(response, metric)
        except Exception as e:
            print(f"Error fetching {metric}: {str(e)}")
            metrics_data[metric] = None
    
    return render_template('dashboard.html', metrics_data=metrics_data)

def process_metric_response(response, metric):
    config = METRICS_CONFIG[metric]
    total = 0
    values = []
    
    for row in response.rows:
        value = float(row.metric_values[0].value)
        if config['type'] == 'percentage':
            value *= 100
        values.append(value)
        total += value
    
    return {
        'current': values[-1] if values else 0,
        'trend': calculate_trend(values),
        'config': config
    }

def calculate_trend(values):
    if len(values) < 2:
        return 0
    return ((values[-1] - values[0]) / values[0]) * 100

@app.route('/api/data')
def get_analytics_data():
    try:
        days = request.args.get('days', default=7, type=int)
        metrics_requested = request.args.get('metrics', default='all')
        
        # Get credentials
        creds = None
        if os.path.exists(TOKEN_FILE):
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
            
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    CLIENT_SECRET_FILE, 
                    scopes=SCOPES,
                    redirect_uri='http://localhost:5000/oauth2callback'
                )
                creds = flow.run_local_server(port=5000)
                
                # Save credentials
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())

        # Initialize GA4 client
        client = BetaAnalyticsDataClient(credentials=creds)
        
        # Determine which metrics to fetch
        if metrics_requested == 'all':
            metrics_to_fetch = list(METRICS_CONFIG.keys())
        else:
            metrics_to_fetch = metrics_requested.split(',')
        
        # Build metrics request
        metrics = [
            Metric(name=METRICS_CONFIG[metric]['metric'])
            for metric in metrics_to_fetch
            if metric in METRICS_CONFIG
        ]
        
        # Create date ranges
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        request = RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            date_ranges=[DateRange(
                start_date=start_date.strftime('%Y-%m-%d'),
                end_date=end_date.strftime('%Y-%m-%d')
            )],
            metrics=metrics,
            dimensions=[{"name": "date"}]
        )
        
        response = client.run_report(request)
        
        # Format data with metric information
        data = []
        for row in response.rows:
            entry = {'date': row.dimension_values[0].value}
            for i, metric in enumerate(metrics_to_fetch):
                config = METRICS_CONFIG[metric]
                value = row.metric_values[i].value
                
                # Format value based on metric type
                if config['type'] == 'percentage':
                    value = float(value) * 100
                elif config['type'] == 'duration':
                    value = float(value)
                else:
                    value = int(value)
                
                entry[metric] = {
                    'value': value,
                    'title': config['title'],
                    'type': config['type'],
                    'icon': config['icon'],
                    'description': config['description']
                }
            data.append(entry)
            
        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'metrics': {
                    metric: METRICS_CONFIG[metric]
                    for metric in metrics_to_fetch
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_ga4_client():
    # Load credentials from the consolidated file
    with open(GCP_OAUTH_KEYS) as f:
        credentials = json.load(f)
    
    client = BetaAnalyticsDataClient.from_service_account_info({
        "client_id": credentials['client_id'],
        "client_secret": credentials['client_secret'],
        "refresh_token": credentials['refresh_token'],
        "type": "authorized_user"
    })
    return client

@app.route('/ga4-metrics')
def get_ga4_metrics():
    try:
        print("Initializing GA4 client...")
        client = get_ga4_client()
        property_id = os.getenv('GA4_PROPERTY_ID')
        print(f"Using property ID: {property_id}")
        
        # Get date range from query parameters
        start_date = request.args.get('start_date', '7daysAgo')
        end_date = request.args.get('end_date', 'today')
        print(f"Date range: {start_date} to {end_date}")
        
        print("Creating report request...")
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        )
        
        print("Running report...")
        response = client.run_report(request)
        print("Report completed successfully")
        
        metrics = []
        for row in response.rows:
            metrics.append({
                'date': row.dimension_values[0].value,
                'active_users': row.metric_values[0].value
            })
        
        return jsonify(metrics)
    
    except Exception as e:
        print(f"Error fetching GA4 metrics: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def test_ga4_connection():
    try:
        client = get_ga4_client()
        property_id = os.getenv('GA4_PROPERTY_ID')
        
        # Simple test request
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="2023-10-01", end_date="2023-10-02")],
        )
        
        response = client.run_report(request)
        return True
    except Exception as e:
        print(f"GA4 connection test failed: {str(e)}")
        return False

@app.route('/test-ga4')
def test_ga4():
    if test_ga4_connection():
        return "GA4 connection successful!"
    else:
        return "GA4 connection failed", 500