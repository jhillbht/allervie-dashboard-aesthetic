"""
Allervie Dashboard Launcher with improved error handling and direct property launching
"""

from flask import Flask, render_template, jsonify, redirect
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
import json
import webbrowser
from urllib.parse import urlencode
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

class AllervieLauncher:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        self.CREDENTIALS_PATH = os.path.join(self.credentials_dir, 'desktop_1_client.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'token_user.json')
        
        self.admin_service = None
        self.SCOPES = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit'
        ]
        
        # Allervie dashboard configuration
        self.DASHBOARD_URL = 'https://allervie.bluehighlightedtext.com'

    def launch_dashboard_with_property(self, property_id):
        """Launch the dashboard with specific property details."""
        try:
            # Get property details
            property_details = self.admin_service.properties().get(
                name=f"properties/{property_id}"
            ).execute()

            # Prepare launch parameters
            launch_params = {
                'propertyId': property_id,
                'propertyName': property_details.get('displayName', ''),
                'timezone': property_details.get('timeZone', 'UTC'),
                'currency': property_details.get('currencyCode', 'USD'),
                'websiteUrl': property_details.get('websiteUrl', '')
            }

            # Log the launch attempt
            logger.info(f"Launching dashboard with parameters: {launch_params}")

            # Construct the launch URL
            launch_url = f"{self.DASHBOARD_URL}?{urlencode(launch_params)}"
            
            # Open in default browser
            webbrowser.open(launch_url)
            
            return {'success': True, 'url': launch_url}

        except Exception as e:
            logger.error(f"Error launching dashboard: {str(e)}")
            return {'success': False, 'error': str(e)}

@app.route('/launch/<property_id>')
def launch(property_id):
    """Handle dashboard launch with better error handling."""
    try:
        launcher = AllervieLauncher()
        if launcher.authenticate():
            result = launcher.launch_dashboard_with_property(property_id)
            if result['success']:
                return jsonify({
                    'success': True,
                    'message': 'Dashboard launched successfully',
                    'url': result['url']
                })
            else:
                return jsonify({
                    'success': False,
                    'error': result.get('error', 'Unknown error occurred')
                }), 500
        else:
            return jsonify({
                'success': False,
                'error': 'Authentication failed'
            }), 401
    except Exception as e:
        logger.error(f"Launch error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def create_html_template():
    """Create the HTML template with improved error handling."""
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    template_path = os.path.join(templates_dir, 'index.html')
    with open(template_path, 'w') as f:
        f.write("""<!DOCTYPE html>
<html>
<head>
    <title>Allervie Analytics Selector</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .property-card:hover .launch-button {
            opacity: 1;
        }
        .launch-button {
            opacity: 0;
            transition: opacity 0.2s;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-2xl font-bold mb-2">Allervie Analytics</h1>
            <p class="text-gray-600 mb-8">Select a Google Analytics 4 property to launch the dashboard</p>
            
            <div id="error-container" class="hidden mb-4"></div>
            <div id="accounts-container" class="space-y-6">
                <!-- Loading state -->
                <div class="animate-pulse space-y-4">
                    <div class="h-4 bg-blue-200 rounded w-3/4"></div>
                    <div class="h-4 bg-blue-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showError(message) {
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = `
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    ${message}
                </div>
            `;
            errorContainer.classList.remove('hidden');
        }

        function launchDashboard(propertyId) {
            // Show loading state
            const button = event.target;
            const originalText = button.innerText;
            button.innerText = 'Launching...';
            button.disabled = true;

            fetch(`/launch/${propertyId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Dashboard launched successfully');
                    } else {
                        showError(data.error || 'Error launching dashboard. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Launch error:', error);
                    showError('Error launching dashboard. Please try again.');
                })
                .finally(() => {
                    // Reset button state
                    button.innerText = originalText;
                    button.disabled = false;
                });
        }

        // Rest of your existing JavaScript for fetching and displaying accounts...
        [Your existing accounts fetching code]
    </script>
</body>
</html>""")

def main():
    """Run the application with improved error handling."""
    try:
        print("\nStarting Allervie Analytics Launcher...")
        print("=======================================")
        
        create_html_template()
        
        print("\nOpening selector in your browser...")
        print("If the browser doesn't open automatically, go to: http://localhost:5000")
        
        webbrowser.open('http://localhost:5000')
        
        app.run(debug=True)
    except Exception as e:
        print(f"\nError starting application: {str(e)}")
        logger.error(f"Application start error: {str(e)}")

if __name__ == '__main__':
    main()