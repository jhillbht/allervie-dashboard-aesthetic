import React, { useState } from 'react';
import axios from 'axios';
import './ChatWidget.css';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);

  // Update the API configuration
  const API_ENDPOINT = "https://agent-5f716e5461ce79bc2a00-688p2.ondigitalocean.app";
  const API_KEY = "r4odSplsftll_rEUVtW303gcOWyxuwlE";

  const handleSendMessage = async (message) => {
    try {
      const response = await axios.post(
        API_ENDPOINT,
        {
          message: message,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Add user message to chat
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      
      // Add bot response to chat
      if (response.data && response.data.message) {
        setMessages(prev => [...prev, { text: response.data.message, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isUser: false 
      }]);
    }
  };

  // Update the predefined questions
  const predefinedQuestions = [
    "What are the key insights from the Google Ads performance data?",
    "How does today's conversion rate compare to yesterday?",
    "What's the highest performing marketing channel based on revenue?",
  ];

  return (
    <div className="chat-widget">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="predefined-questions">
        {predefinedQuestions.map((question, index) => (
          <button 
            key={index}
            onClick={() => handleSendMessage(question)}
            className="predefined-question-btn"
          >
            {question}
          </button>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatWidget; 