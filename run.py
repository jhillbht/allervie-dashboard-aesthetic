from app import app
from app.ga_integration import setup_ga_client

if __name__ == '__main__':
    # Initialize GA client before running the app
    ga_client = setup_ga_client()
    app.config['GA_CLIENT'] = ga_client
    app.run(port=5001)