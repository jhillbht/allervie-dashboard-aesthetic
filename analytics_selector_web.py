"""
Web-based Google Analytics account and property selector.
Provides a user-friendly interface for viewing and selecting GA4 accounts and properties.
"""

from flask import Flask, render_template, jsonify
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
import json

# Create Flask app
app = Flask(__name__)

# Enable HTTPS for OAuth
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

class AnalyticsSelector:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        self.CREDENTIALS_PATH = os.path.join(self.credentials_dir, 'desktop_1_client.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'token_user.json')
        
        self.admin_service = None
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']

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
                creds = flow.run_local_server(port=8080)

            with open(self.TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())

        self.admin_service = build('analyticsadmin', 'v1beta', credentials=creds)
        return True

    def get_accounts_and_properties(self):
        """Fetch all accessible accounts and their properties."""
        try:
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
                    details = self.admin_service.properties().get(
                        name=f"properties/{property_id}"
                    ).execute()

                    property_data = {
                        'id': property_id,
                        'name': prop['displayName'],
                        'websiteUrl': details.get('websiteUrl', 'Not set'),
                        'timezone': details.get('timeZone', 'Not set'),
                        'currency': details.get('currencyCode', 'Not set')
                    }
                    account_data['properties'].append(property_data)

                accounts.append(account_data)

            return accounts

        except Exception as e:
            print(f"Error fetching accounts and properties: {str(e)}")
            return []

# Flask routes
@app.route('/')
def index():
    """Serve the main application page."""
    return render_template('index.html')

@app.route('/api/accounts')
def get_accounts():
    """API endpoint to fetch accounts data."""
    selector = AnalyticsSelector()
    if selector.authenticate():
        accounts = selector.get_accounts_and_properties()
        return jsonify(accounts)
    return jsonify([])

def main():
    """Run the web application."""
    print("\nStarting Google Analytics Selector...")
    print("Opening browser for account selection...")
    print("\nNote: If the browser doesn't open automatically, go to:")
    print("http://localhost:5000")
    
    # Create templates directory if it doesn't exist
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    # Create the HTML template
    template_path = os.path.join(templates_dir, 'index.html')
    with open(template_path, 'w') as f:
        f.write("""<!DOCTYPE html>
<html>
<head>
    <title>Google Analytics Selector</title>
    <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
</head>
<body>
    <div id="root">
        <div class="p-4 max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Google Analytics Account Selector</h1>
            <div id="accounts-container"></div>
        </div>
    </div>

    <script>
        // Fetch and display accounts
        fetch('/api/accounts')
            .then(response => response.json())
            .then(accounts => {
                const container = document.getElementById('accounts-container');
                
                accounts.forEach(account => {
                    const accountDiv = document.createElement('div');
                    accountDiv.className = 'border rounded-lg p-4 mb-4';
                    
                    // Account header
                    const accountHeader = document.createElement('div');
                    accountHeader.className = 'flex items-center cursor-pointer';
                    accountHeader.innerHTML = `
                        <svg class="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        <span class="font-medium">${account.name}</span>
                    `;
                    
                    // Properties container
                    const propertiesDiv = document.createElement('div');
                    propertiesDiv.className = 'mt-4 ml-6 space-y-3';
                    
                    account.properties.forEach(property => {
                        const propertyDiv = document.createElement('div');
                        propertyDiv.className = 'border rounded p-3 cursor-pointer hover:bg-gray-50';
                        propertyDiv.innerHTML = `
                            <div class="flex items-center">
                                <svg class="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="2" y="3" width="20" height="18" rx="2"></rect>
                                </svg>
                                <span class="font-medium">${property.name}</span>
                            </div>
                            <div class="mt-2 text-sm text-gray-600 space-y-1">
                                <div>Property ID: ${property.id}</div>
                                <div>Website: ${property.websiteUrl}</div>
                                <div>Timezone: ${property.timezone}</div>
                                <div>Currency: ${property.currency}</div>
                            </div>
                        `;
                        propertiesDiv.appendChild(propertyDiv);
                    });
                    
                    accountDiv.appendChild(accountHeader);
                    accountDiv.appendChild(propertiesDiv);
                    container.appendChild(accountDiv);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                const container = document.getElementById('accounts-container');
                container.innerHTML = `
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        Error loading accounts. Please try again.
                    </div>
                `;
            });
    </script>
</body>
</html>""")
    
    # Run the Flask app
    app.run(debug=True)

if __name__ == '__main__':
    main()