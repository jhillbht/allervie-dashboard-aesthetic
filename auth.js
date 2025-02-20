require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = "https://allervie.bluehighlightedtext.com";

function initializeAuth() {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=profile email` +
    `&prompt=consent`;

  return authUrl;
}

function handleAuthRedirect() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  
  if (accessToken) {
    // Store the token securely
    localStorage.setItem('auth_token', accessToken);
    // Update the chat.js authorization
    updateChatAuthorization(accessToken);
    return true;
  }
  return false;
}

function updateChatAuthorization(token) {
  // Update the headers in the sendMessageToAgent function
  window.CURRENT_AUTH_TOKEN = token;
} 