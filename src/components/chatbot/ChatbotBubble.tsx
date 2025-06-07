"use client";

import { Button } from "@/components/ui/button";
import CelloIcon from "@/components/icons/CelloIcon";
import { X } from "lucide-react";

type ChatbotBubbleProps = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

export default function ChatbotBubble({ isOpen, toggleChatbot }: ChatbotBubbleProps) {
  return (
    <Button
      onClick={toggleChatbot}
      variant="default"
      size="icon"
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground z-50 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-8 w-8" />
      ) : (
        <CelloIcon className="h-8 w-8" />
      )}
    </Button>
  );
}
