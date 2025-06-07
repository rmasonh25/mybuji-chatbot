"use client";

import type { Message } from "@/lib/types";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, X } from "lucide-react";
import CelloIcon from "@/components/icons/CelloIcon";
import { cn } from "@/lib/utils";

type ChatInterfaceProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !webhookUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text, userId: "guestUser" }), // N8N might expect userId
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`);
      }

      const data = await response.json();
      // N8N webhook might return an array of messages, or a single message object.
      // This example assumes a simple response like { response: "bot reply text" } or { text: "..." }
      // Or it might be an array like [{ text: "Hi" }, { text: "How can I help?" }]
      
      let botReplies: string[] = [];
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.text) botReplies.push(item.text);
        });
      } else if (data.response) {
        botReplies.push(data.response);
      } else if (data.text) {
        botReplies.push(data.text);
      } else {
         // Fallback if structure is unknown, but we received a 200
        botReplies.push("Received a response, but couldn't parse it.");
      }

      if (botReplies.length === 0) {
        botReplies.push("I'm not sure how to respond to that.");
      }
      
      const botMessages: Message[] = botReplies.map((replyText, index) => ({
        id: `${Date.now().toString()}-bot-${index}`,
        text: replyText,
        sender: "bot",
        timestamp: new Date(),
      }));

      setMessages((prevMessages) => [...prevMessages, ...botMessages]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: `${Date.now().toString()}-error`,
        text: "Sorry, I couldn't connect to the support bot. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([
            {
                id: 'initial-greeting',
                text: "Hello! I'm your CelloChat assistant. How can I help you with your cello journey today?",
                sender: 'bot',
                timestamp: new Date(),
            }
        ]);
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 w-[360px] h-[500px] bg-card text-card-foreground rounded-lg shadow-xl flex flex-col z-40 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <header className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CelloIcon className="h-6 w-6" />
          <h3 className="font-semibold font-headline text-lg">CelloChat Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/80">
          <X className="h-5 w-5" />
        </Button>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.sender === "user"
                  ? "ml-auto bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {message.text}
              <span className="text-xs opacity-70 self-end">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about lessons, practice..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
