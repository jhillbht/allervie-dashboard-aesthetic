"""
OAuth2.0 Authentication Module for Allervie Analytics
"""

import os
from functools import wraps
from flask import session, redirect, url_for, flash
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import json

class GoogleAuth:
    def __init__(self, client_secrets_file=None):
        self.SCOPES = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/analytics.readonly',
            'openid'  # Add openid scope
        ]
        self.client_secrets_file = client_secrets_file or os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            'credentials/desktop_1_client.json'
        )
        self.ALLOWED_EMAIL = 'data@bluehighlightedtext.com'
        # Use localhost for development
        self.REDIRECT_URI = ('http://localhost:5001/oauth2callback' 
                            if os.getenv('FLASK_ENV') == 'development' 
                            else 'https://allervie.bluehighlightedtext.com/oauth2callback')

    def is_authorized(self):
        """Check if user is authorized."""
        return 'credentials' in session and 'email' in session and session['email'] == self.ALLOWED_EMAIL

    def get_credentials(self):
        """Get OAuth2.0 credentials from session."""
        if 'credentials' not in session:
            return None
            
        credentials = Credentials(**session['credentials'])
        
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                try:
                    credentials.refresh(Request())
                    session['credentials'] = credentials_to_dict(credentials)
                except:
                    return None
            else:
                return None
                
        return credentials

    def initialize_flow(self):
        """Initialize OAuth2.0 flow."""
        return InstalledAppFlow.from_client_secrets_file(
            self.client_secrets_file,
            scopes=self.SCOPES,
            redirect_uri=self.REDIRECT_URI
        )

    def credentials_to_dict(self, credentials):
        """Convert credentials to dictionary for session storage."""
        return {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }

    def get_user_info(self, credentials):
        """Get user info from Google."""
        try:
            service = build('oauth2', 'v2', credentials=credentials)
            user_info = service.userinfo().get().execute()
            return user_info
        except Exception as e:
            print(f"Error getting user info: {e}")
            return None

def login_required(f):
    """Decorator to require login for views."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('email') or session.get('email') != 'data@bluehighlightedtext.com':
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function