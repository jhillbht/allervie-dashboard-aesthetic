#!/bin/bash

# Kill any existing process on port 5001
echo "Killing existing processes on port 5001..."
lsof -ti :5001 | xargs kill -9

# Set environment variables and run Flask
echo "Starting Flask application..."
export FLASK_APP=app
export FLASK_ENV=development
export OAUTHLIB_INSECURE_TRANSPORT=1
flask run --port=5001 