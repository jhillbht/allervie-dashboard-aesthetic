# Allervie Analytics OAuth Test

This project helps test the OAuth2.0 connection for Allervie Analytics.

## Prerequisites

1. Python 3.7+
2. Required packages:
```bash
pip install google-auth google-auth-oauthlib google-api-python-client pandas
```

3. Google Analytics 4 Property ID (default: 399455767)
4. OAuth2.0 client secret JSON file from Google Cloud Console

## Setup

1. Place your `client_secret.json` file in this directory
   - If it's elsewhere, you'll be prompted for its location

2. Run the test script:
```bash
python test_oauth.py
```

3. Follow the OAuth flow in your browser when prompted

## What the Test Does

1. Initializes OAuth2.0 authentication
2. Tests connection to GA4
3. Fetches some test data (last 7 days of active users)

## Files

- `test_oauth.py`: Main test script
- `client_secret.json`: Your OAuth credentials (you need to add this)
- `token.json`: Generated after successful authentication

## Troubleshooting

If you encounter errors:

1. Make sure your `client_secret.json` is in the correct format
2. Verify your Google Cloud Project has the Analytics API enabled
3. Check that your OAuth2.0 credentials have the correct redirect URI
4. Delete `token.json` and try again if you're having authentication issues