import React, { useState } from 'react';
import {
  Headphones,
  PhoneCall,
  MessageSquare,
  Clock,
  Send,
  HelpCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';

interface CustomerServiceProps {
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const CustomerServiceModal: React.FC<CustomerServiceProps> = ({ onBack }) => {
  const { playClick, playSuccess } = useSound();
  const [activeTab, setActiveTab] = useState<'chat' | 'ticket' | 'faq'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello Engineer! BuildIt 24x7 Jobsite Support Desk here. How can we help with your dispatch, equipment rental, or GST tax invoice today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('dispatch');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playClick();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    setTimeout(() => {
      let botResponse = "Our dispatch team has noted your site update. A dispatch specialist (BLR-Hub) is monitoring your route.";
      if (query.includes('rent') || query.includes('tool') || query.includes('drill')) {
        botResponse = "For tool rentals: Return pickups can be triggered directly with 1-click in your Account portal. Deposit refunds process automatically within 2 hours of technician verification.";
      } else if (query.includes('gst') || query.includes('invoice') || query.includes('bill')) {
        botResponse = "Your GST E-Invoices with IRN verification and QR codes are generated instantly on dispatch and available in the Order History section.";
      } else if (query.includes('delay') || query.includes('late') || query.includes('where') || query.includes('status')) {
        botResponse = "Our van is moving on Outer Ring Road corridor with green corridor priority. Expected site arrival: 6-8 minutes.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playSuccess();
    }, 600);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;
    playSuccess();
    setTicketSubmitted(true);
  };

  const FAQS = [
    {
      id: 'faq-1',
      q: 'How does the 8-Minute Site Delivery guarantee work?',
      a: 'We operate micro-fulfillment warehouses (Dark Hubs) stocking over 460+ high-frequency construction materials, power tools, fasteners, and electronics located within 4.5km of major tech parks and construction corridors.'
    },
    {
      id: 'faq-2',
      q: 'How do I claim GST Input Tax Credit (ITC)?',
      a: 'Enter your business GSTIN during checkout or under Account Settings. An automated GST E-Invoice with verifiable IRN and QR code is instantly issued and uploaded to your order receipt.'
    },
    {
      id: 'faq-3',
      q: 'What happens if a delivered tool is defective on arrival?',
      a: 'We provide an instant 48-Hour Site Replacement guarantee. Our dispatch van will bring a brand-new calibrated replacement directly to your site within 20 minutes.'
    },
    {
      id: 'faq-4',
      q: 'How do security deposits for rented machinery work?',
      a: 'Refundable security deposits are held in escrow and released back to your registered bank account/wallet within 2 hours of our technician inspecting the returned tool at your site.'
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* Header Bar */}
      <div className="bg-[#062B32] text-white p-5 rounded-2xl border border-[#041E24] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                playClick();
                onBack();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Headphones size={20} className="text-[#D8F43A]" />
              <h2 className="text-lg font-black tracking-tight">24x7 Contractor & Site Support</h2>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Live Dispatch Operations Desk • Avg Response: &lt; 45 seconds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+918045678900"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <PhoneCall size={14} className="text-[#D8F43A]" />
            <span className="hidden sm:inline">Call Dispatch</span>
          </a>
          <a
            href="https://wa.me/919876543210?text=Hi%20BuildIt%20Dispatch%20Desk,%20I%20need%20urgent%20site%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black transition-all shadow-xs"
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
        <button
          onClick={() => {
            playClick();
            setActiveTab('chat');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <MessageSquare size={15} />
          <span>Live Site Assistant</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveTab('ticket');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ticket'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <AlertCircle size={15} />
          <span>Raise Priority Ticket</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveTab('faq');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'faq'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <HelpCircle size={15} />
          <span>Contractor FAQs</span>
        </button>
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm flex flex-col h-[520px]">
          {/* Chat Status Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-[#E5E7EB] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#0F172A]">AI & Hub Dispatch Engineer Online</span>
            </div>
            <span className="text-[11px] text-[#64748B]">Session ID: #DISP-9921</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 hide-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-[#062B32] text-white rounded-br-xs'
                      : 'bg-white border border-[#E5E7EB] text-[#0F172A] shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#94A3B8] mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-white border-t border-[#E5E7EB] flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => {
                setInputText('Where is my 8-min dispatch van right now?');
              }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#062B32] hover:text-[#D8F43A] whitespace-nowrap transition-colors"
            >
              Track Van GPS
            </button>
            <button
              onClick={() => {
                setInputText('I want to schedule tool return pickup for Bosch breaker');
              }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#062B32] hover:text-[#D8F43A] whitespace-nowrap transition-colors"
            >
              Tool Return Pickup
            </button>
            <button
              onClick={() => {
                setInputText('Need GST e-invoice with IRN for last order');
              }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#062B32] hover:text-[#D8F43A] whitespace-nowrap transition-colors"
            >
              GST E-Invoice Help
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about orders, delivery van GPS, tool rentals, GST invoices..."
              className="flex-1 bg-slate-100 text-xs text-[#0F172A] px-4 py-2.5 rounded-xl border border-transparent focus:border-[#062B32] focus:bg-white outline-none font-medium"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#062B32] text-[#D8F43A] hover:bg-[#093E48] transition-all"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* TICKET TAB */}
      {activeTab === 'ticket' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          {ticketSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">Priority Site Ticket Raised!</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Ticket #TKT-8419 has been assigned to Site Operations Lead (Bengaluru East Hub). Expected resolution within 15 minutes.
              </p>
              <button
                onClick={() => {
                  setTicketSubmitted(false);
                  setTicketSubject('');
                  setTicketDescription('');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#062B32] text-[#D8F43A] text-xs font-black"
              >
                Raise Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] text-[#0F172A] font-medium outline-none focus:border-[#062B32]"
                >
                  <option value="dispatch">Van Dispatch & 8-Min SLA Delay</option>
                  <option value="rental">Tool Rental Extension or Return Pickup</option>
                  <option value="defect">Damaged / Defective OEM Material Replacement</option>
                  <option value="invoice">GST Invoice & Tax Credit Revision</option>
                  <option value="blueprint">CAD Blueprint Plotting & File Print Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Subject / Order ID</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Order #BLT-9842 - Need urgent drill bit replacement"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] text-[#0F172A] font-medium outline-none focus:border-[#062B32]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Provide site details, gate access instructions, or specific replacement requirements..."
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] text-[#0F172A] font-medium outline-none focus:border-[#062B32]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] font-black text-xs transition-all shadow-sm"
              >
                Submit Priority Ticket to Hub Operations
              </button>
            </form>
          )}
        </div>
      )}

      {/* FAQ TAB */}
      {activeTab === 'faq' && (
        <div className="space-y-2.5">
          {FAQS.map((faq) => {
            const isExp = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => {
                    playClick();
                    setExpandedFaq(isExp ? null : faq.id);
                  }}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-black text-[#0F172A]">{faq.q}</span>
                  {isExp ? <ChevronUp size={16} className="text-[#062B32]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
                </button>
                {isExp && (
                  <div className="px-4 pb-4 text-xs text-[#475569] font-medium leading-relaxed border-t border-[#F1F5F9] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
