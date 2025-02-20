"""
Google Analytics OAuth2.0 Setup Script
Handles the initial authentication flow and token management.
"""

import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import json
import webbrowser
import time

class GoogleAnalyticsAuth:
    def __init__(self):
        # Set up base directory and credentials paths
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.credentials_dir = os.path.join(self.base_dir, 'credentials')
        os.makedirs(self.credentials_dir, exist_ok=True)
        
        # Define file paths
        self.CREDENTIALS_PATH = os.path.join(self.credentials_dir, 'desktop_1_client.json')
        self.TOKEN_PATH = os.path.join(self.credentials_dir, 'token_user.json')
        
        # Define required scopes for GA4
        self.SCOPES = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit'
        ]

    def check_credentials_file(self):
        """Verify the OAuth client credentials file exists."""
        if not os.path.exists(self.CREDENTIALS_PATH):
            print("\n⚠️  OAuth client credentials not found!")
            print("\nTo set up OAuth2.0 credentials:")
            print("1. Go to Google Cloud Console: https://console.cloud.google.com")
            print("2. Select your project")
            print("3. Go to APIs & Services > Credentials")
            print("4. Click 'Create Credentials' > 'OAuth client ID'")
            print("5. Choose 'Desktop app' as the application type")
            print("6. Download the JSON file")
            print(f"7. Save it as 'desktop_1_client.json' in: {self.credentials_dir}")
            return False
        return True

    def authenticate(self):
        """Handle the OAuth2.0 authentication flow."""
        print("\nStarting Google Analytics OAuth2.0 Setup")
        print("======================================")
        
        if not self.check_credentials_file():
            return False

        creds = None
        
        # Check for existing token
        if os.path.exists(self.TOKEN_PATH):
            try:
                creds = Credentials.from_authorized_user_file(self.TOKEN_PATH, self.SCOPES)
                print("\nFound existing credentials, validating...")
            except Exception as e:
                print(f"\nError with existing credentials: {e}")
                if os.path.exists(self.TOKEN_PATH):
                    os.remove(self.TOKEN_PATH)

        # Handle token