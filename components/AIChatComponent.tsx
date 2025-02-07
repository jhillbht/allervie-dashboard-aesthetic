import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, StopCircle } from 'lucide-react';
import { Toolhouse } from '@toolhouse/sdk';

const AIChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize Toolhouse
  const toolhouse = new Toolhouse({
    apiKey: process.env.NEXT_PUBLIC_TOOLHOUSE_API_KEY,
    metadata: {
      projectId: 'allervie-dashboard',
      environment: process.env.NODE_ENV
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    try {
      const response = await toolhouse.chat.completions.create({
        messages: [{ role: 'user', content: text }],
        model: 'claude-3-5-sonnet-latest'
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.choices[0].message.content 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, there was an error processing your message.' 
      }]);
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        // Initialize VAPI voice recording here
        setIsRecording(true);
        // Start recording logic
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      setIsRecording(false);
      // Stop recording and process audio
      // Convert to text and send message
    }
  };

  return (
    <Card className="w-full h-[600px] bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[480px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={toggleRecording}
              className={`${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white border-gray-600"
              disabled={isProcessing}
            />
            
            <Button
              onClick={() => handleSendMessage(inputText)}
              disabled={isProcessing || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatComponent;