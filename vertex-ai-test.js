const axios = require('axios');
const { google } = require('googleapis');
const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();

async function getAccessToken() {
  const keyPath = path.join(__dirname, 'service-account-key.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  return await auth.getAccessToken();
}

async function testVertexAIChat() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Step 1: Verify service account
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    // Step 2: Test website accessibility
    await page.goto('https://allervie.bluehighlightedtext.com/');
    const pageTitle = await page.title();
    if (!pageTitle.includes('Allervie')) {
      throw new Error('Website accessibility check failed');
    }

    // Step 3: Test Vertex AI integration
    const vertexResponse = await axios.post(
      process.env.VERTEX_AI_ENDPOINT,
      {
        instances: [{
          context: "You are a helpful assistant",
          messages: [{
            author: "user",
            content: "Hello, can you tell me about Allervie?"
          }]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!vertexResponse.data?.predictions?.[0]?.candidates?.[0]?.content) {
      throw new Error('Vertex AI chat response failed');
    }

    // Step 4: Verify GA4 tracking
    const ga4Check = await axios.get(
      `https://analytics.googleapis.com/v3/properties/${process.env.GA4_PROPERTY_ID}:getConfig`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!ga4Check.data?.config?.trackingCode) {
      throw new Error('GA4 tracking verification failed');
    }

    console.log('Starting Vertex AI test...');
    console.log('Access token obtained:', token);
    console.log('Page title:', pageTitle);
    console.log('Vertex AI response:', vertexResponse.data);
    console.log('GA4 tracking code:', ga4Check.data?.config?.trackingCode);
    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await browser.close();
  }
}

testVertexAIChat(); 