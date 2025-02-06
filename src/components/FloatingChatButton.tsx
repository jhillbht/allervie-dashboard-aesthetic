import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, ChartBar, Calendar, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { callToolHouseApi } from "@/utils/toolhouse";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickPrompt {
  icon: React.ReactNode;
  text: string;
  question: string;
}

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts: QuickPrompt[] = [
    {
      icon: <ChartBar className="h-4 w-4" />,
      text: "Performance Analysis",
      question: "What's the highest performing marketing channel based on revenue?"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      text: "Time Comparison",
      question: "How does today's conversion rate compare to yesterday?"
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      text: "Insights",
      question: "What are the key insights from the Google Ads performance data?"
    }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const newMessage: ChatMessage = { role: 'user', content: message };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      const response = await callToolHouseApi({
        endpoint: '/vapi/chat',
        method: 'POST',
        data: {
          messages: [...messages, newMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (response.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] flex flex-col p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Chat Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {messages.length === 0 && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-3 px-4"
                  onClick={() => handleQuickPrompt(prompt.question)}
                >
                  {prompt.icon}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{prompt.text}</span>
                    <span className="text-xs text-muted-foreground">{prompt.question}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}