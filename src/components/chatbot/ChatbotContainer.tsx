"use client";

import { useEffect } from "react";
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatbotContainer() {
  useEffect(() => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (webhookUrl) {
      createChat({
        webhookUrl: webhookUrl,
        initialMessages: [
          "Hello! I'm your CelloChat assistant. How can I help you with your cello journey today?"
        ],
        i18n: {
          en: {
            title: 'CelloChat Assistant',
            inputPlaceholder: 'Ask about lessons, practice...',
          },
	      },
        // Default chatInputKey: 'chatInput'
        // Default chatSessionKey: 'sessionId'
        // Ensure your n8n workflow is configured to use these keys.
      });
    } else {
      console.error("N8N Webhook URL (NEXT_PUBLIC_N8N_WEBHOOK_URL) is not configured. Chatbot will not initialize.");
    }
    // The createChat function from @n8n/chat typically manages its own DOM elements
    // and doesn't return a cleanup function. We assume it's designed to be mounted once.
  }, []);

  // The ChatbotContainer no longer renders direct UI itself.
  // createChat injects the widget into the DOM.
  return null;
}
