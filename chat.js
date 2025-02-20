require('dotenv').config();

const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
const AGENT_KEY = process.env.AGENT_KEY;

async function sendMessageToAgent(message) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AGENT_KEY}`
    };

    // Add auth token if available
    if (window.CURRENT_AUTH_TOKEN) {
      headers['User-Authorization'] = `Bearer ${window.CURRENT_AUTH_TOKEN}`;
    }

    const response = await fetch(AGENT_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from agent');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error communicating with agent:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
}

async function handleChat(userMessage) {
  // Show user message in chat
  displayMessage(userMessage, 'user');
  
  // Show typing indicator
  showTypingIndicator();
  
  // Get response from agent
  const agentResponse = await sendMessageToAgent(userMessage);
  
  // Hide typing indicator
  hideTypingIndicator();
  
  // Display agent response
  displayMessage(agentResponse, 'agent');
}

// Helper functions
function showTypingIndicator() {
  // Add typing indicator to chat
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  document.querySelector('.chat-messages').appendChild(typingDiv);
}

function hideTypingIndicator() {
  // Remove typing indicator
  const indicator = document.querySelector('.typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function displayMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  messageDiv.textContent = message;
  document.querySelector('.chat-messages').appendChild(messageDiv);
  
  // Scroll to bottom
  messageDiv.scrollIntoView({ behavior: 'smooth' });
} 