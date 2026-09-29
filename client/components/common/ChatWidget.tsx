'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Hello! How can I assist with your Amazon Clone orders today?' },
  ]);
  const [input, setInput] = useState('');
  const user = useAppSelector((state) => state.auth.user);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Instant bot response simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Our team is reviewing your query regarding Cash on Delivery and orders.',
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#131921] hover:bg-[#232f3e] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-gray-700 transition transform hover:scale-105"
        >
          <span className="text-lg">💬</span>
          <span className="text-xs font-bold hidden sm:inline">Amazon Assistant</span>
        </button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[420px] overflow-hidden">
          {/* Header */}
          <div className="bg-[#232f3e] text-white p-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="font-bold text-xs">Amazon Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 font-bold">
              ✕
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f0f2f2]/40 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2.5 rounded-lg max-w-[80%] ${
                    m.sender === 'user'
                      ? 'bg-[#ffd814] text-black rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-2 border-t border-gray-200 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-bold px-3 py-1.5 rounded text-xs shadow-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
