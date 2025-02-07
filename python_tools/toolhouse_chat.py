import os
from dotenv import load_dotenv
from toolhouse import Toolhouse
from anthropic import Anthropic
import json

# Load environment variables from .env.local
load_dotenv('.env.local')

def init_clients():
    """Initialize Toolhouse and Anthropic clients"""
    # Initialize Anthropic client
    anthropic_key = os.getenv("ANTHROPIC_KEY")
    if not anthropic_key:
        raise ValueError("ANTHROPIC_KEY not found in environment variables")
    
    client = Anthropic(api_key=anthropic_key)
    
    # Initialize Toolhouse
    toolhouse_key = os.getenv("TOOLHOUSE_API_KEY")
    if not toolhouse_key:
        raise ValueError("TOOLHOUSE_API_KEY not found in environment variables")
    
    th = Toolhouse(api_key=toolhouse_key, provider='anthropic')
    
    return client, th

def process_message(message_content, client, th, model="claude-3-5-sonnet-latest"):
    """Process a message using Toolhouse and Anthropic"""
    try:
        # Create initial message
        messages = [{
            "role": "user",
            "content": message_content
        }]
        
        # Get initial response
        response = client.messages.create(
            model=model,
            messages=messages,
            max_tokens=1000,
            tools=th.get_tools()
        )
        
        # Run tools and get final response
        messages += th.run_tools(response)
        final_response = client.messages.create(
            model=model,
            messages=messages,
            max_tokens=1000,
            tools=th.get_tools()
        )
        
        return {
            'status': 'success',
            'response': final_response.content[0].text,
            'messages': messages
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

def main():
    """Main function to test the Toolhouse integration"""
    try:
        client, th = init_clients()
        
        # Test message
        test_message = "Generate FizzBuzz code. Execute it to show me the results up to 10."
        result = process_message(test_message, client, th)
        
        print("Test Result:")
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()