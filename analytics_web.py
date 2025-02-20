"""
Web interface for Google Analytics account selection and API exploration.
Combines Flask backend with React frontend for a smooth user experience.
"""

from flask import Flask, render_template, jsonify
from flask_cors import CORS
import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class AnalyticsWeb:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        self.CREDENTIALS_PATH = os.path.join(self.credentials_dir, 'desktop_1_client.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'token_user.json')
        
        self.analytics_service = None
        self.admin_service = None
        
        self.SCOPES = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit'
        ]

    def authenticate(self):
        """Handle Google Analytics authentication."""
        creds = None
        if os.path.exists(self.TOKEN_PATH):
            creds = Credentials.from_authorized_user_file(self.TOKEN_PATH, self.SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.CREDENTIALS_PATH,
                    self.SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            with open(self.TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())

        self.analytics_service = build('analyticsdata', 'v1beta', credentials=creds)
        self.admin_service = build('analyticsadmin', 'v1beta', credentials=creds)
        return True

    def get_accounts_and_properties(self):
        """Fetch all accessible accounts and their properties."""
        try:
            if not self.admin_service:
                self.authenticate()

            # Get accounts
            accounts_response = self.admin_service.accounts().list().execute()
            accounts = []

            for account in accounts_response.get('accounts', []):
                account_data = {
                    'id': account['name'].split('/')[-1],
                    'name': account['displayName'],
                    'properties': []
                }

                # Get properties for this account
                properties_response = self.admin_service.properties().list(
                    filter=f"parent:accounts/{account_data['id']}"
                ).execute()

                for prop in properties_response.get('properties', []):
                    property_id = prop['name'].split('/')[-1]
                    
                    # Get detailed property information
                    property_details = self.admin_service.properties().get(
                        name=f"properties/{property_id}"
                    ).execute()

                    property_data = {
                        'id': property_id,
                        'name': prop['displayName'],
                        'websiteUrl': property_details.get('websiteUrl', 'Not set'),
                        'timezone': property_details.get('timeZone', 'Not set'),
                        'currency': property_details.get('currencyCode', 'Not set')
                    }
                    account_data['properties'].append(property_data)

                accounts.append(account_data)

            return accounts

        except HttpError as error:
            print(f"HTTP error occurred: {error.resp.status} - {error.content}")
            return []
        except Exception as e:
            print(f"Error fetching accounts and properties: {str(e)}")
            return []

# Flask routes
@app.route('/')
def index():
    """Serve the main application page."""
    return render_template('index.html')

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    """API endpoint to fetch accounts and properties."""
    analytics = AnalyticsWeb()
    accounts = analytics.get_accounts_and_properties()
    return jsonify(accounts)

@app.route('/api/available-apis/<property_id>', methods=['GET'])
def get_available_apis(property_id):
    """API endpoint to fetch available APIs for a property."""
    # This would typically query the enabled APIs for the property
    # For now, we'll return a static list
    apis = [
        {
            'name': 'Google Analytics Data API (GA4)',
            'description': 'Access real-time analytics data',
            'endpoints': [
                'getActiveUsers',
                'getConversionMetrics',
                'getPageMetrics',
                'getTrafficSources'
            ]
        },
        {
            'name': 'Google Analytics Admin API',
            'description': 'Manage analytics configuration',
            'endpoints': [
                'listAccounts',
                'listProperties',
                'getPropertySettings',
                'updatePropertySettings'
            ]
        }
    ]
    return jsonify(apis)

def main():
    """Run the web application."""
    print("Starting Analytics Web Interface...")
    print("Open http://localhost:5000 in your browser")
    app.run(debug=True)

if __name__ == '__main__':
    main()