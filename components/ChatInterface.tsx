import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Assignment } from '../types';
import { GlassCard } from './GlassCard';
import { IconArrowLeft, IconSend, IconRobot, IconSparkles } from './Icons';

interface ChatInterfaceProps {
  assignment: Assignment;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ assignment, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi! I've loaded the details for "${assignment.summary}". How would you like to tackle this assignment today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat Session
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct system instruction with assignment context
    const context = `
      You are an expert academic tutor and study companion.
      The student is working on the following assignment:
      
      Class: ${assignment.course}
      Assignment Title: "${assignment.summary}"
      Due Date: ${assignment.startDate.toDateString()}
      Description/Details: "${assignment.description || 'No specific description provided'}"
      
      Your goal is to help the student complete this assignment. 
      - Break down complex tasks into smaller steps.
      - Explain concepts related to the assignment.
      - Help brainstorm ideas if it's a creative task.
      - Do NOT do the work for them (e.g., don't write the whole essay), but guide them.
      - Be encouraging, concise, and organized.
    `;

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: context,
      },
    });
  }, [assignment]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullResponse = "";
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
           fullResponse += c.text;
           // Update the last message with the accumulated text
           setMessages(prev => {
             const newArr = [...prev];
             newArr[newArr.length - 1] = { role: 'model', text: fullResponse };
             return newArr;
           });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formattedDate = assignment.startDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto animate-in fade-in slide-in-from-right duration-500">
      
      {/* Header */}
      <GlassCard className="flex items-center p-4 mb-4 !rounded-2xl shrink-0">
        <button 
          onClick={onBack}
          className="p-2 mr-4 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">AI Tutor Session</h2>
          <div className="flex items-center text-xs text-white/50">
            <span>Powered by Gemini</span>
          </div>
        </div>
      </GlassCard>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
          
          {/* Details Panel (Left Side) */}
          <GlassCard className="md:w-1/3 flex flex-col p-6 overflow-hidden !bg-white/5 order-2 md:order-1 h-[200px] md:h-auto">
              <div className="overflow-y-auto custom-scrollbar pr-2 h-full">
                <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-300 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">
                        {assignment.course}
                    </span>
                    <h1 className="text-2xl font-bold text-white mt-3 leading-tight">{assignment.summary}</h1>
                    <p className="text-white/50 text-sm mt-2 font-medium">{formattedDate}</p>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                     <h4 className="text-xs uppercase tracking-wider text-blue-300 mb-3 font-bold border-b border-white/10 pb-2">Assignment Details</h4>
                     <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed break-words font-light">
                        {assignment.description || "No specific description provided in the calendar event."}
                     </p>
                </div>
              </div>
          </GlassCard>

          {/* Chat Area (Right Side) */}
          <GlassCard className="flex-1 overflow-hidden flex flex-col !bg-black/20 backdrop-blur-md relative order-1 md:order-2">
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg
                        ${msg.role === 'user' 
                          ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-br-none' 
                          : 'bg-white/10 border border-white/5 text-white/90 rounded-bl-none'
                        }
                      `}
                    >
                      {msg.role === 'model' && (
                        <div className="flex items-center mb-2 text-xs text-white/40 font-bold uppercase tracking-wider">
                          <IconSparkles className="w-3 h-3 mr-1 text-blue-300" />
                          Gemini Tutor
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 rounded-bl-none flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative flex items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask for help, breakdown, or explanation..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 resize-none min-h-[50px] max-h-[150px]"
                    rows={1}
                    style={{ height: 'auto', minHeight: '52px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`
                      absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200
                      ${input.trim() && !isTyping 
                        ? 'bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/20' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }
                    `}
                  >
                    <IconSend className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p className="text-[10px] text-white/30">
                    AI can make mistakes. Review generated information.
                  </p>
                </div>
              </div>

          </GlassCard>
      </div>
    </div>
  );
};
