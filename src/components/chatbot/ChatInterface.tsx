
"use client";

import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface ChatInterfaceProps {
  onClose: () => void;
}

// IMPORTANT: Replace this with your actual n8n webhook URL
const HARDCODED_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-bot-message',
      text: "Hello! I'm your CelloChat assistant. How can I help you with your cello journey today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    const webhookUrl = HARDCODED_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl === "YOUR_N8N_WEBHOOK_URL_HERE") {
      addMessage({
        id: Date.now().toString() + '-error',
        text: 'Chatbot is not configured. Webhook URL is missing or is a placeholder.',
        sender: 'bot',
        timestamp: new Date(),
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatInput: trimmedInput, sessionId: 'cellochat-user-session' }),
      });

      if (response.status === 204) {
        addMessage({
          id: Date.now().toString() + '-no-content',
          text: "The bot didn't provide a specific response this time. Feel free to ask something else!",
          sender: 'bot',
          timestamp: new Date(),
        });
        setIsLoading(false);
        return;
      }

      const responseBodyText = await response.text(); // Read body as text first

      if (!response.ok) {
        let errorText = `Error communicating with the bot. Status: ${response.status}`;
        if (responseBodyText) {
          try {
            const errorData = JSON.parse(responseBodyText);
            if (errorData && typeof errorData === 'object' && errorData.message) {
              errorText = `Bot service error: ${errorData.message}`;
            } else if (errorData) {
              errorText = `Bot service error: ${JSON.stringify(errorData).substring(0, 150)}`;
            } else {
              errorText = `Bot service error ${response.status}: ${responseBodyText.substring(0, 150) || response.statusText}`;
            }
          } catch (jsonParseError) {
            errorText = `Bot service error ${response.status}: ${responseBodyText.substring(0, 150) || response.statusText}`;
          }
        } else {
          errorText = `Bot service error ${response.status}: ${response.statusText}.`;
        }
        
        addMessage({ id: Date.now().toString() + '-error', text: errorText, sender: 'bot', timestamp: new Date() });
        setIsLoading(false);
        return;
      }
      
      // At this point, response.ok is true
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = JSON.parse(responseBodyText); // Parse the text we already read
          const botReplies = Array.isArray(data) ? data : (data.text ? [{text: data.text}] : (data.response ? [{text: data.response}] : []));
          
          if (botReplies.length > 0) {
            botReplies.forEach((reply: any, index: number) => {
              if (reply.text && typeof reply.text === 'string') {
                addMessage({
                  id: Date.now().toString() + `-bot-${index}`,
                  text: reply.text,
                  sender: 'bot',
                  timestamp: new Date(),
                });
              } else if (typeof reply === 'string') {
                 addMessage({
                  id: Date.now().toString() + `-bot-${index}`,
                  text: reply,
                  sender: 'bot',
                  timestamp: new Date(),
                });
              }
            });
          } else if (Object.keys(data).length > 0) {
             addMessage({ id: Date.now().toString() + '-raw', text: `Received: ${JSON.stringify(data).substring(0,200)}`, sender: 'bot', timestamp: new Date() });
          } else {
            addMessage({ id: Date.now().toString() + '-empty', text: "Bot gave an empty response.", sender: 'bot', timestamp: new Date() });
          }
        } catch (jsonError: any) {
          addMessage({ id: Date.now().toString() + '-json-error', text: `Failed to parse bot's JSON response: ${jsonError.message.substring(0,100)}. Response text: ${responseBodyText.substring(0,100)}`, sender: 'bot', timestamp: new Date() });
        }
      } else if (responseBodyText) { // Handle non-JSON but non-empty text response
        addMessage({ id: Date.now().toString() + '-text-data', text: responseBodyText, sender: 'bot', timestamp: new Date() });
      } else { // Handle empty non-JSON response (though 204 should catch most of these)
        addMessage({ id: Date.now().toString() + '-empty-text', text: 'Received an empty, non-JSON response from the bot.', sender: 'bot', timestamp: new Date() });
      }
    } catch (error: any) {
      addMessage({
        id: Date.now().toString() + '-network-error',
        text: `Network error or bot unavailable: ${error.message.substring(0,100)}`,
        sender: 'bot',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Card className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] shadow-xl rounded-lg flex flex-col bg-card z-50 border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-primary/20 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <CardTitle className="text-lg font-semibold">CelloChat Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/80">
          <X className="h-5 w-5" />
          <span className="sr-only">Close chat</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow ${
                    msg.sender === 'user'
                      ? 'bg-accent text-accent-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-accent-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-secondary text-secondary-foreground">
                       <User size={18}/>
                     </AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end space-x-2 justify-start">
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary text-primary-foreground">
                     <Bot size={18} />
                   </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-lg px-3 py-2 text-sm shadow bg-muted text-muted-foreground rounded-bl-none">
                  <div className="flex space-x-1 items-center">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-75"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-primary/20">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask about lessons, practice..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-grow bg-input focus:ring-accent"
          />
          <Button type="submit" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
