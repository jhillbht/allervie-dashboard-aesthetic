import requests
from requests.auth import HTTPBasicAuth

# Replace these values with your OAuth2.0 credentials
client_id = 'your_client_id'
client_secret = 'your_client_secret'
token_url = 'https://example.com/oauth/token'
api_url = 'https://example.com/api/resource'

# Step 1: Get the access token
response = requests.post(
    token_url,
    data={'grant_type': 'client_credentials'},
    auth=HTTPBasicAuth(client_id, client_secret)
)

if response.status_code == 200:
    access_token = response.json().get('access_token')
    print(f"Access Token: {access_token}")

    # Step 2: Use the access token to access the protected resource
    headers = {'Authorization': f'Bearer {access_token}'}
    api_response = requests.get(api_url, headers=headers)

    if api_response.status_code == 200:
        print("API Response:", api_response.json())
    else:
        print("Failed to access the API:", api_response.status_code, api_response.text)
else:
    print("Failed to obtain access token:", response.status_code, response.text)