"""
Network Configuration Check for GA4
"""

import socket
import requests
import os
import json
from pathlib import Path
import urllib3
import sys

def check_network():
    print("=== Network Configuration Check ===")
    
    # Check proxy settings
    print("\n1. Checking proxy settings...")
    proxies = {
        'http': os.environ.get('HTTP_PROXY'),
        'https': os.environ.get('HTTPS_PROXY')
    }
    print(f"System Proxies: {json.dumps(proxies, indent=2)}")
    
    # Check DNS resolution
    print("\n2. Testing DNS resolution...")
    test_domains = [
        'www.googleapis.com',
        'analyticsdata.googleapis.com',
        'oauth2.googleapis.com'
    ]
    
    for domain in test_domains:
        try:
            ip = socket.gethostbyname(domain)
            print(f"✅ {domain} resolves to {ip}")
        except socket.gaierror as e:
            print(f"❌ Failed to resolve {domain}: {e}")
    
    # Check direct connections
    print("\n3. Testing direct connections...")
    for domain in test_domains:
        try:
            print(f"\nTesting {domain}...")
            # Try HTTPS connection
            response = requests.get(f'https://{domain}', timeout=5)
            print(f"✅ HTTPS connection successful (Status: {response.status_code})")
        except requests.exceptions.SSLError as e:
            print(f"❌ SSL Error: {e}")
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection Error: {e}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Check Python environment
    print("\n4. Python Environment Info:")
    print(f"Python version: {sys.version}")
    print(f"Requests version: {requests.__version__}")
    print(f"urllib3 version: {urllib3.__version__}")
    
    # List SSL certificates
    print("\n5. Checking SSL certificates...")
    try:
        import certifi
        print(f"Certificate bundle path: {certifi.where()}")
    except ImportError:
        print("certifi package not found")

if __name__ == "__main__":
    check_network()