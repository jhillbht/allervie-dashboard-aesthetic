"""
Authentication test for Allervie Analytics
Using data@bluehighlightedtext.com account
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import os
from pathlib import Path
import pickle
import json

def test_auth():
    SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
    CREDS_PATH = 'gcp-oauth.keys.json'
    TOKEN_DIR = Path('token')
    TOKEN_PATH = TOKEN_DIR / 'allervie_token.json'
    
    # Create token directory if it doesn't exist
    TOKEN_DIR.mkdir(exist_ok=True)
    
    print(f"\nTesting authentication for data@bluehighlightedtext.com...")
    
    creds = None
    # Load existing credentials if they exist
    if TOKEN_PATH.exists():
        print("Found existing token, attempting to use it...")
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
        except Exception as e:
            print(f"Error loading existing token: {e}")
    
    # If no valid credentials available, let's authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired credentials...")
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Error refreshing credentials: {e}")
                creds = None
        
        if not creds:
            print("Starting new authentication flow...")
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    CREDS_PATH, 
                    SCOPES,
                    redirect_uri='http://localhost:3000'
                )
                creds = flow.run_local_server(
                    port=3000,
                    prompt='consent',
                    access_type='offline'
                )
                
                # Save the credentials
                with open(TOKEN_PATH, 'w') as token:
                    token.write(creds.to_json())
                print("New credentials saved successfully")
                
            except Exception as e:
                print(f"Error in authentication flow: {e}")
                return False
    
    try:
        print("\nInitializing GA4 service...")
        service = build('analyticsdata', 'v1beta', credentials=creds)
        
        print("Making test request to GA4...")
        request = service.properties().runReport(
            property=f"properties/399455767",
            body={
                "dateRanges": [
                    {
                        "startDate": "yesterday",
                        "endDate": "today"
                    }
                ],
                "metrics": [
                    {
                        "name": "activeUsers"
                    }
                ]
            }
        )
        
        response = request.execute()
        print("\n✅ Successfully connected to GA4!")
        
        try:
            users = response['rows'][0]['metricValues'][0]['value']
            print(f"\nActive users in last day: {users}")
        except (KeyError, IndexError):
            print("Note: No active users in the last day")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error accessing GA4: {str(e)}")
        
        print("\nCredential Status:")
        print(f"Valid: {creds.valid}")
        print(f"Expired: {creds.expired}")
        print(f"Has refresh token: {'refresh_token' in creds.to_json()}")
        
        return False

if __name__ == "__main__":
    print("=== Allervie Analytics Authentication Test ===")
    success = test_auth()
    if success:
        print("\n✅ Authentication test completed successfully!")
    else:
        print("\n❌ Authentication test failed. Please check the errors above.")