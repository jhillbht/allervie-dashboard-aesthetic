"""
GA4 Account Selector
A simplified web interface for selecting Google Analytics 4 accounts and properties.
"""

from flask import Flask, render_template, jsonify
import os
import webbrowser
import threading
import time
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)

# Allow HTTP for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

class GA4Selector:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        # Using the existing credentials file
        self.CREDENTIALS_PATH = os.path.join(self.base_dir, 'gcp-oauth.keys.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'ga4_token.json')
        
        self.analytics_service = None
        self.admin_service = None
        self.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
        
        self.DASHBOARD_URL = 'https://allervie.bluehighlightedtext.com'

    def authenticate(self):
        """Handle Google Analytics authentication."""
        creds = None
        
        # Try to load existing credentials
        if os.path.exists(self.TOKEN_PATH):
            try:
                creds = Credentials.from_authorized_user_file(self.TOKEN_PATH, self.SCOPES)
                logger.info("Found existing credentials")
            except Exception as e:
                logger.warning(f"Error loading existing credentials: {e}")
                if os.path.exists(self.TOKEN_PATH):
                    os.remove(self.TOKEN_PATH)

        # Handle credential refresh or new authentication
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    logger.info("Refreshing expired credentials")
                    creds.refresh(Request())
                except Exception as e:
                    logger.error(f"Error refreshing credentials: {e}")
                    return False
            else:
                try:
                    logger.info("Starting new authentication flow")
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.CREDENTIALS_PATH,
                        self.SCOPES
                    )
                    creds = flow.run_local_server(
                        port=8080,
                        success_message='Successfully authenticated! You can return to the application.',
                        open_browser=True
                    )
                    
                    # Save credentials
                    with open(self.TOKEN_PATH, 'w') as token:
                        token.write(creds.to_json())
                    logger.info("Saved new credentials")
                except Exception as e:
                    logger.error(f"Authentication error: {e}")
                    return False

        try:
            # Initialize services
            self.analytics_service = build('analyticsdata', 'v1beta', credentials=creds)
            self.admin_service = build('analyticsadmin', 'v1beta', credentials=creds)
            return True
        except Exception as e:
            logger.error(f"Error building services: {e}")
            return False

    def get_accounts_and_properties(self):
        """Fetch all accessible accounts and properties."""
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
                        'timezone': details.get('timeZone', 'UTC'),
                        'currency': details.get('currencyCode', 'USD')
                    }
                    account_data['properties'].append(property_data)

                accounts.append(account_data)

            return accounts
        except Exception as e:
            logger.error(f"Error fetching accounts: {e}")
            return []

@app.route('/')
def index():
    """Serve the account selector page."""
    return render_template('ga4_selector.html')

@app.route('/api/accounts')
def get_accounts():
    """API endpoint to fetch accounts data."""
    selector = GA4Selector()
    if selector.authenticate():
        accounts = selector.get_accounts_and_properties()
        return jsonify(accounts)
    return jsonify([])

def create_template():
    """Create the HTML template file."""
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    template_path = os.path.join(templates_dir, 'ga4_selector.html')
    
    # Only create template if it doesn't exist
    if not os.path.exists(template_path):
        with open(template_path, 'w') as f:
            f.write("""<!DOCTYPE html>
<html>
<head>
    <title>GA4 Account Selector</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-2xl font-bold mb-6">Select Google Analytics Account</h1>
            
            <div id="loading" class="animate-pulse space-y-4">
                <div class="h-4 bg-blue-200 rounded w-3/4"></div>
                <div class="h-4 bg-blue-200 rounded w-1/2"></div>
            </div>

            <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"></div>
            
            <div id="accounts-container" class="space-y-6"></div>
        </div>
    </div>

    <script>
        // Fetch and display accounts
        fetch('/api/accounts')
            .then(response => response.json())
            .then(accounts => {
                document.getElementById('loading').style.display = 'none';
                const container = document.getElementById('accounts-container');
                
                if (accounts.length === 0) {
                    document.getElementById('error-message').textContent = 'No Google Analytics accounts found';
                    document.getElementById('error-message').classList.remove('hidden');
                    return;
                }

                accounts.forEach(account => {
                    const accountDiv = document.createElement('div');
                    accountDiv.className = 'bg-white rounded-lg shadow-sm overflow-hidden mb-6';
                    
                    accountDiv.innerHTML = `
                        <div class="bg-gray-50 px-4 py-3 border-b">
                            <h2 class="text-lg font-medium">${account.name}</h2>
                        </div>
                        
                        <div class="p-4 space-y-4">
                            ${account.properties.map(property => `
                                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 class="font-medium">${property.name}</h3>
                                            <p class="text-sm text-gray-500">Property ID: ${property.id}</p>
                                        </div>
                                        <button
                                            onclick="window.location.href='${property.id}'"
                                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                                        >
                                            Select Property
                                        </button>
                                    </div>
                                    
                                    <div class="text-sm text-gray-600 space-y-1">
                                        <div>Website: ${property.websiteUrl}</div>
                                        <div>Timezone: ${property.timezone}</div>
                                        <div>Currency: ${property.currency}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    
                    container.appendChild(accountDiv);
                });
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error-message').textContent = 'Error loading accounts. Please try again.';
                document.getElementById('error-message').classList.remove('hidden');
                console.error('Error:', error);
            });
    </script>
</body>
</html>""")

def open_browser():
    """Open the browser after a short delay."""
    time.sleep(1.5)  # Wait for Flask to start
    webbrowser.open('http://localhost:5000')

def main():
    """Run the GA4 selector application."""
    try:
        print("\nStarting GA4 Account Selector...")
        print("================================")
        
        # Create template
        create_template()
        
        # Start browser in a separate thread
        threading.Thread(target=open_browser, daemon=True).start()
        
        # Start Flask
        app.run(debug=False, port=5000)
        
    except Exception as e:
        print(f"\nError starting application: {e}")
        logger.error(f"Application error: {e}")

if __name__ == '__main__':
    main()