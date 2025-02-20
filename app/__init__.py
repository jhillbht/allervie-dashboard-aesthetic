from flask import Flask, request, redirect
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev')
app.config['SERVER_PORT'] = 5001

# Only force HTTPS in production
if os.getenv('FLASK_ENV') != 'development':
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    
    @app.before_request
    def before_request():
        if not request.is_secure:
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url)

# Import routes after app creation to avoid circular imports
from app import routes