import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { getConsultationResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

const Consultant: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: "你好。我是你的 SoulSync 情感顾问。今天你对你们的关系有什么感觉？我随时准备倾听并提供帮助。" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Format history for API
      const apiHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const streamResponse = await getConsultationResponse(apiHistory, userMsg);
      
      let fullText = "";
      setHistory(prev => [...prev, { role: 'model', text: "" }]); // Placeholder

      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setHistory(prev => {
            const newHist = [...prev];
            newHist[newHist.length - 1].text = fullText;
            return newHist;
          });
        }
      }

    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', text: "非常抱歉，我目前无法连接到情感导航系统。请稍后再试。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">SoulSync 情感顾问</h2>
          <p className="text-xs text-slate-500">AI 情感咨询师</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot size={14} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            placeholder="告诉我你的心事..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consultant;