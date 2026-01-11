import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatWindow } from '../components';
import type { ChatMessage } from '../types';
import { api } from '../services/api';

export function ChatPage() {
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI stock assistant. Ask me about any stock, market trends, or investment ideas. You can also ask me to find stocks matching specific criteria.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.chat.query(
        [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        initialSymbol
      );

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (response.sources && response.sources.length > 0) {
        const sourceMessage: ChatMessage = {
          role: 'system',
          content: `*Data sourced from: ${response.sources.join(', ')}*`,
        };
        setMessages((prev) => [...prev, sourceMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Stock Chat</h1>
          <p className="text-slate-500">
            Ask questions about stocks, get insights, and discover opportunities.
          </p>
        </div>

        <ChatWindow
          messages={messages}
          onSend={handleSend}
          loading={loading}
          stockSymbol={initialSymbol}
        />
      </div>
    </div>
  );
}