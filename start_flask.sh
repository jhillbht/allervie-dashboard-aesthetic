#!/bin/bash

# Kill any existing process on port 5001
echo "Killing existing processes on port 5001..."
lsof -ti :5001 | xargs kill -9

# Set environment variables
echo "Setting up environment..."
export FLASK_APP=app
export FLASK_ENV=development
export OAUTHLIB_INSECURE_TRANSPORT=1

# Start Flask
echo "Starting Flask application..."
flask run --port=5001 