
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Sprout, Bot } from 'lucide-react';
import { TEXT } from '../utils/Localization';
import { createChatSession } from '../services/geminiService';
import { Chat as GeminiChat, GenerateContentResponse } from "@google/genai";

interface ChatProps {
  onBack: () => void;
  initialContext?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const Chat: React.FC<ChatProps> = ({ onBack, initialContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat Session
    chatSessionRef.current = createChatSession();
    
    // Add initial greeting
    const initialMsg: Message = {
      id: 'init-1',
      role: 'model',
      text: TEXT.chat.initialMessage
    };
    
    // If there is context passed from dashboard (e.g., previous advice), add it invisibly or as a visible reference
    if (initialContext) {
      // We send the context to the model essentially to prime it, but we might not show it as a user message to keep UI clean,
      // or we just assume the session starts fresh. 
      // For this MLP, let's just show the greeting.
    }

    setMessages([initialMsg]);
  }, [initialContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text || "Uzr, javobni ololmadim.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 absolute inset-0 z-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center gap-3 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800">{TEXT.chat.title}</h1>
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             {TEXT.chat.subtitle}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-green-500 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100 pb-safe">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={TEXT.chat.placeholder}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button 
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-green-500 disabled:bg-slate-300 text-white p-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};