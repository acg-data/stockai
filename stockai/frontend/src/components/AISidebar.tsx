import { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

interface AISidebarProps {
  onPromptSubmit: (prompt: string) => void;
  insights: Array<{
    text: string;
    timestamp?: Date;
  }>;
  actions: Array<{
    id: string;
    icon: string;
    label: string;
  }>;
  onActionClick: (id: string) => void;
}

export function AISidebar({
  onPromptSubmit,
  insights,
  actions,
  onActionClick,
}: AISidebarProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI stock assistant. Ask me about any stock, market trends, or investment ideas. You can also ask me to find stocks matching specific criteria.',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: 'user' as const, content: input.trim() };
      setMessages((prev) => [...prev, userMessage]);
      onPromptSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <aside className="w-full lg:w-[380px] bg-white/70 backdrop-blur-xl border-l border-slate-200 flex flex-col h-full shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Gemini Assistant</h3>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-4 border border-indigo-100 shadow-sm"
            >
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <span className="font-bold text-indigo-700 block mb-1">Market Insight:</span>
                {insight.text}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Smart Screeners</p>
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className="w-full text-left p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-between group"
            >
              {action.icon} {action.label}
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chat</p>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                {msg.role === 'user' ? (
                  <MessageCircle className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-indigo-600" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white/50">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini to filter..."
              className="ai-input w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}