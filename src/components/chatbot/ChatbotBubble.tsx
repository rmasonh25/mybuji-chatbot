"use client";

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotBubbleProps {
  onClick: () => void;
}

export default function ChatbotBubble({ onClick }: ChatbotBubbleProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Open CelloChat Assistant"
    >
      <MessageSquare size={32} />
    </Button>
  );
}
