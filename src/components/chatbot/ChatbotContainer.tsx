"use client";

import { useState, useEffect } from 'react';
import ChatbotBubble from './ChatbotBubble';
import ChatInterface from './ChatInterface';

export default function ChatbotContainer() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  if (!isClient) {
    // Render nothing or a placeholder on the server to avoid hydration issues
    // if ChatbotBubble or ChatInterface use client-only features directly
    return null; 
  }

  return (
    <>
      {!isChatOpen && (
        <ChatbotBubble onClick={toggleChat} />
      )}
      {isChatOpen && (
        <ChatInterface onClose={closeChat} />
      )}
    </>
  );
}
