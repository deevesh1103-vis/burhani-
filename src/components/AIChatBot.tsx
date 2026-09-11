import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Maximize2, 
  Minimize2,
  Wrench,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ChatQuickPrompt, Product } from '../types';

interface AIChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateTab: (tab: 'catalog' | 'tracking' | 'inventory' | 'emails' | 'location' | 'reviews') => void;
  onSelectCategory?: (category: string) => void;
  products: Product[];
}

const QUICK_PROMPTS: ChatQuickPrompt[] = [
  {
    id: 'upvc-cpvc',
    label: 'UPVC vs CPVC Valves',
    prompt: 'What is the difference between UPVC and CPVC ball valves, and when should I use each?',
  },
  {
    id: 'frp-load',
    label: 'FRP Manhole Load Class',
    prompt: 'What load class FRP manhole cover should I buy for a residential car driveway?',
  },
  {
    id: 'tabletop-basin',
    label: 'Tabletop Basin Ideas',
    prompt: 'Recommend a modern tabletop wash basin in ₹ INR for a compact bathroom.',
  },
  {
    id: 'store-timings',
    label: 'Showroom Hours & Sunday',
    prompt: 'What are your store hours at Huzaifa Square Mill Road, and are you open on Sunday?',
  },
  {
    id: 'delivery-coimbatore',
    label: 'Delivery in Coimbatore',
    prompt: 'Do you offer same-day delivery to RS Puram or Saibaba Colony?',
  },
  {
    id: 'tracking-help',
    label: 'Track My Order',
    prompt: 'How do I track my order status and delivery timeline?',
  },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content: `👋 **Vanakkam! Welcome to Burhani Hardware Mart, Coimbatore.**

I am **Burhani AI**, your dedicated hardware, plumbing, and sanitaryware specialist. 

I can assist you with:
- **Plumbing & Valves:** UPVC/CPVC specifications, pipe sizes, Supreme & Astral valves
- **FRP Manhole Covers:** Load class selection (A15, B125, C250, D400)
- **Sanitaryware & Basins:** Parryware, Hindware, Jaquar closets & mixers
- **Orders & Deliveries:** Tracking your consignment across Coimbatore
- **Store Hours & Location:** Huzaifa Square, Mill Road, Sukrawar Pettai

How can I help with your project today? Tap a quick prompt below or type your question!`,
  timestamp: 'Just now',
  source: 'gemini-3.8-flash',
};

export const AIChatBot: React.FC<AIChatBotProps> = ({
  isOpen,
  onToggle,
  onNavigateTab,
  onSelectCategory,
  products,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('bhm_chat_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return [INITIAL_GREETING];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save conversation
  useEffect(() => {
    localStorage.setItem('bhm_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      setShowTooltip(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || "Thank you for contacting Burhani Hardware Mart. Call us at 09843128546 for fast stock details!";

      // Detect potential actionable links
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('order') || lower.includes('track')) {
        suggestedAction = { label: 'Go to Order Tracking', actionType: 'track-order' };
      } else if (lower.includes('location') || lower.includes('address') || lower.includes('map') || lower.includes('hours')) {
        suggestedAction = { label: 'View Store Location & Map', actionType: 'open-location' };
      } else if (lower.includes('basin') || lower.includes('valve') || lower.includes('catalog') || lower.includes('buy') || lower.includes('commode')) {
        suggestedAction = { label: 'Browse Product Catalog', actionType: 'open-catalog' };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat fetch fallback:', err);
      // Client-side instant fallback if server is unreachable
      const clientFallbackReply = getClientFallbackReply(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: clientFallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge-engine',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    localStorage.removeItem('bhm_chat_messages');
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'open-catalog') {
      onNavigateTab('catalog');
      onToggle();
    } else if (action.actionType === 'open-location') {
      onNavigateTab('location');
      onToggle();
    } else if (action.actionType === 'track-order') {
      onNavigateTab('tracking');
      onToggle();
    } else if (action.actionType === 'call') {
      window.location.href = 'tel:09843128546';
    }
  };

  // Helper to format basic markdown-style text safely
  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-neutral-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-neutral-900 font-bold">•</span>
            <span className="flex-1">{formattedParts}</span>
          </div>
        );
      }

      // Empty line spacing
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Tooltip prompt on initial load */}
        {showTooltip && !isOpen && (
          <div className="mb-2 bg-black text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-2 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Sparkles className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11px] leading-snug">
              Need plumbing advice or product recommendations? <strong>Ask Burhani AI!</strong>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-neutral-400 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          id="burhani-ai-bot-trigger"
          type="button"
          onClick={onToggle}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-200 active:scale-95 border ${
            isOpen 
              ? 'bg-black text-white ring-2 ring-neutral-400 border-neutral-700' 
              : 'bg-black hover:bg-neutral-900 text-white border-neutral-800'
          }`}
          aria-label="Open Burhani AI Chat Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide flex items-center gap-1 text-white">
              BURHANI AI
              <Sparkles className="w-3 h-3 text-neutral-300 inline" />
            </div>
            <div className="text-[10px] text-neutral-400 font-medium">
              Hardware Assistant
            </div>
          </div>
        </button>
      </div>

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div 
          id="burhani-ai-chat-window"
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white shadow-2xl border border-neutral-300 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-10 rounded-2xl'
              : 'bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-black text-white px-4 py-3.5 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5 text-black" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-black border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">
                    Burhani AI Assistant
                  </h3>
                  <span className="text-[9px] font-mono uppercase bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded font-bold border border-neutral-700">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Huzaifa Square, Mill Rd, Coimbatore • 09843128546
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-400">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize size' : 'Expand window'}
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors hidden sm:block text-neutral-400"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onToggle}
                title="Close chat"
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Store Advisory Bar */}
          <div className="bg-neutral-100 border-b border-neutral-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-neutral-900">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
              <span>Today: 9:30 AM – 7:30 PM • Sunday: 10 AM – 12 PM</span>
            </div>
            <a 
              href="tel:09843128546" 
              className="font-mono font-bold flex items-center gap-1 text-neutral-950 hover:underline"
            >
              <Phone className="w-3 h-3 text-neutral-800" />
              09843128546
            </a>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/70">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      isUser
                        ? 'bg-black text-white rounded-br-xs border border-neutral-800'
                        : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-neutral-100">
                        <span className="text-[10px] font-bold text-neutral-900 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-neutral-700" />
                          Burhani Hardware Expert
                        </span>
                        <span className="text-[9px] text-neutral-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    <div className="space-y-0.5">
                      {formatMarkdown(msg.content)}
                    </div>

                    {/* Actionable Button if linked to a view or store action */}
                    {msg.suggestedAction && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => handleActionClick(msg.suggestedAction)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-[11px] shadow-xs transition-colors border border-black"
                        >
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <span className="text-[9px] text-neutral-400 mt-1 mr-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 rounded-bl-xs shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-neutral-700">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-900 animate-spin" />
                    <span>Burhani AI is checking hardware inventory & specs...</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-neutral-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider shrink-0 pl-1">
              Suggestions:
            </span>
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.id}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-black hover:text-white border border-neutral-300 hover:border-black text-[11px] text-neutral-800 font-medium transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-neutral-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about pipes, FRP covers, prices, hours..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 disabled:bg-neutral-100"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs border border-black"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] text-neutral-400">
              <span>Press Enter to send • Currency in ₹ INR</span>
              <button 
                type="button"
                onClick={() => onNavigateTab('location')}
                className="hover:text-black underline"
              >
                14/2 Mill Road, Coimbatore
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Client-side backup fallback when network is disconnected
function getClientFallbackReply(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('upvc') || lower.includes('cpvc') || lower.includes('valve')) {
    return `🔧 **UPVC vs CPVC Valves & Pipes:**\n\n- **UPVC Ball Valves:** Rated for cold water potable lines up to 60°C. Best for main overhead water lines, borewell feed, and drainage. We stock genuine **Supreme & Astral** valves starting from ₹280.\n- **CPVC Valves:** Chlorinated PVC engineered for hot water lines up to 93°C (geyser lines & solar water heaters).\n\nBoth are available at our Mill Road showroom with full leak-proof guarantees.`;
  }

  if (lower.includes('frp') || lower.includes('manhole') || lower.includes('cover') || lower.includes('chamber')) {
    return `🛡️ **FRP Inspection Chamber & Manhole Covers:**\n\n- **Class A15 (1.5 Tonne):** Pedestrian footpaths and garden inspection pits (starts at ₹1,450).\n- **Class B125 (12.5 Tonne):** Domestic car driveways and residential garages (starts at ₹2,850).\n- **Class C250 (25 Tonne):** Commercial driveways and delivery bays.\n\nAll our composite FRP covers are 100% rust-free, anti-theft, and include airtight rubber gaskets to prevent odors.`;
  }

  if (lower.includes('basin') || lower.includes('sink')) {
    return `✨ **Wash Basin Recommendations:**\n\n- **Tabletop Ceramic Basins:** Ultra-slim rim designs in glossy Alpine White or Matte Slate (starting ₹2,650).\n- **Corner Basins:** Compact wall-mount solutions for powder rooms (from ₹1,450).\n\nVisit Huzaifa Square to see live counter displays or explore the **Product Catalog** tab above!`;
  }

  if (lower.includes('hour') || lower.includes('time') || lower.includes('open') || lower.includes('sunday')) {
    return `🕒 **Burhani Hardware Mart Timings:**\n\n- **Monday – Saturday:** 9:30 AM – 7:30 PM\n- **Sunday:** 10:00 AM – 12:00 PM\n- **Location:** Huzaifa Square, 14/2 Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore.\n\nDirect phone: **09843128546**.`;
  }

  return `Hello! At **Burhani Hardware Mart**, we supply complete plumbing pipes, Astral/Supreme UPVC valves, FRP manhole covers, and designer sanitaryware in Coimbatore. \n\nCall our trade desk at **09843128546** or explore our catalog tab for immediate stock details!`;
}
