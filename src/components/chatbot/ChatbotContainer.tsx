"use client";

import { useState, useEffect } from "react";
import ChatbotBubble from "./ChatbotBubble";
import ChatInterface from "./ChatInterface";

export default function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted before rendering potentially client-only parts
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  if (!isMounted) {
    return null; // Avoid SSR issues with fixed positioning or client-side state
  }

  return (
    <>
      <ChatbotBubble isOpen={isOpen} toggleChatbot={toggleChatbot} />
      <ChatInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
