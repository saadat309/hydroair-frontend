'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, X, Send, Loader2, Trash2, History, Plus, ChevronLeft, Droplets as WaterIcon, User } from 'lucide-react';
import { useChatStore } from '@/lib/stores/useChatStore';
import { useLanguageStore } from '@/lib/stores/useLanguageStore';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import QuickActions from './QuickActions';
import ReactMarkdown from 'react-markdown';
import { fetchAPI } from '@/lib/api';

export default function ChatbotWidget() {
  const { 
    isOpen, toggleChat, setIsOpen,
    sessions, currentSessionId, 
    ensureSession, createNewSession, addMessage, switchSession, deleteSession, updateInitialMessage
  } = useChatStore();
  
  const { t, locale } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('chat'); // 'chat' or 'history'
  const scrollRef = useRef(null);
  const widgetRef = useRef(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Robust session initialization
  useEffect(() => {
    if (isOpen && !currentSessionId) {
      ensureSession(t('chat.initialMessage'));
    }
  }, [isOpen, currentSessionId, ensureSession, t]);

  // Update initial message on locale change for current session
  useEffect(() => {
    if (isOpen && currentSessionId) {
      updateInitialMessage(t('chat.initialMessage'));
    }
  }, [isOpen, currentSessionId, locale, updateInitialMessage, t]);

  // Click outside to minimize
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        if (isOpen) setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages.length, isLoading, view]);

  const handleSend = async (text) => {
    const messageToSend = text === undefined ? input : text;
    if (!messageToSend?.trim() || isLoading) return;

    // Ensure session exists before sending
    const activeId = ensureSession(t('chat.initialMessage'));

    if (text === undefined) {
      addMessage({ role: 'user', text: messageToSend });
      setInput('');
    }

    setIsLoading(true);

    try {
      // Use messages from store to get latest history
      const sessionForHistory = useChatStore.getState().sessions.find(s => s.id === activeId);
      const history = sessionForHistory?.messages.map(m => ({ role: m.role, text: m.text })) || [];

      const data = await fetchAPI('/chatbot', {
        method: 'POST',
        body: JSON.stringify({
          message: messageToSend,
          history: history,
          locale: locale
        })
      });

      if (data.response) {
        addMessage({ role: 'model', text: data.response });
      } else {
        addMessage({ role: 'model', text: t('common.error') || "Error connecting to assistant." });
      }
    } catch (err) {
      addMessage({ role: 'model', text: t('common.error') || "Connection error." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionId) => {
    let text = "";
    switch(actionId) {
      case 'how-to-order': text = t('chat.queries.howToOrder'); break;
      case 'view-products': text = t('chat.queries.viewProducts'); break;
      case 'create-ticket': text = t('chat.queries.createTicket'); break;
      case 'check-ticket': text = t('chat.queries.checkStatus'); break;
      default: return;
    }
    
    // Ensure session exists first
    ensureSession(t('chat.initialMessage'));
    addMessage({ role: 'user', text });
    handleSend(text);
  };

  const startNewChat = () => {
    createNewSession(t('chat.initialMessage'));
    setView('chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end" ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-32px)] md:w-[400px] h-[600px] max-h-[calc(100vh-120px)] bg-background border rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-primary p-5 text-primary-foreground flex justify-between items-center shadow-lg z-10">
              <div className="flex items-center gap-3">
                {view === 'history' ? (
                  <button 
                    onClick={() => setView('chat')}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors mr-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <WaterIcon className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold leading-none mb-1">
                    {view === 'history' ? t('chat.history') : t('chat.assistantName')}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                      {t('chat.online')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {view === 'chat' && (
                  <button 
                    onClick={() => setView('history')}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title={t('chat.history')}
                  >
                    <History className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={startNewChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={t('chat.newChat')}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-hidden relative bg-slate-50/50">
              <AnimatePresence mode="wait">
                {view === 'chat' ? (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    {/* Messages */}
                    <div 
                      ref={scrollRef}
                      data-lenis-prevent
                      className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                      {messages.length === 0 && !isLoading && (
                        <div className="flex items-center justify-center h-full text-foreground italic text-xs">
                          {t('common.loading')}
                        </div>
                      )}
                      
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={cn(
                            "flex flex-col mb-2",
                            msg.role === 'user' ? "items-end" : "items-start"
                          )}
                        >
                          <div className="flex flex-col items-start max-w-[85%] group">
                            <div className="mb-1 ml-1 flex items-center">
                              {msg.role === 'user' ? (
                                <User className="w-3.5 h-3.5 text-primary opacity-80" />
                              ) : (
                                <WaterIcon className="w-3.5 h-3.5 text-primary opacity-80" />
                              )}
                            </div>
                            <div className={cn(
                              "p-4 rounded-2xl text-sm shadow-sm leading-relaxed w-full",
                              msg.role === 'user' 
                                ? "bg-primary text-primary-foreground rounded-tl-none" 
                                : "bg-background border text-foreground rounded-tl-none"
                            )}>
                              {msg.role === 'user' ? (
                                <p className="m-0">{msg.text}</p>
                              ) : (
                                <div className="markdown-content overflow-hidden">
                                  <ReactMarkdown
                                    components={{
                                      a: ({ node, ...props }) => (
                                        <a {...props} className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer" />
                                      ),
                                      p: ({ node, ...props }) => <p {...props} className="m-0 mb-2 last:mb-0" />,
                                      ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 my-2 space-y-1" />,
                                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 my-2 space-y-1" />,
                                      li: ({ node, ...props }) => <li {...props} className="leading-normal" />,
                                    }}
                                  >
                                    {msg.text || ""}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex flex-col items-start mb-2">
                          <div className="mb-1 ml-1 flex items-center">
                            <WaterIcon className="w-3.5 h-3.5 text-primary opacity-80" />
                          </div>
                          <div className="bg-background border p-4 rounded-2xl rounded-tl-none text-sm flex items-center gap-3 shadow-sm">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions & Input */}
                    <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                      <QuickActions onAction={handleAction} />
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder={t('chat.placeholder')}
                          className="flex-grow bg-muted/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button 
                          onClick={() => handleSend()}
                          disabled={isLoading || !input.trim()}
                          className="bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/10 shrink-0"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="history"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full flex flex-col p-4"
                  >
                    <div className="flex-grow overflow-y-auto space-y-3" data-lenis-prevent>
                      {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-foreground">
                          <History className="w-12 h-12 mb-2 opacity-20" />
                          <p className="text-sm font-medium">{t('chat.noSessions')}</p>
                        </div>
                      ) : (
                        sessions.map((session) => (
                          <div 
                            key={session.id}
                            className={cn(
                              "group flex items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-md",
                              currentSessionId === session.id 
                                ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" 
                                : "bg-background hover:border-primary/20"
                            )}
                            onClick={() => {
                              switchSession(session.id);
                              setView('chat');
                            }}
                          >
                            <div className="flex-grow overflow-hidden">
                              <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                {session.title}
                              </p>
                              <p className="text-[10px] text-foreground mt-0.5">
                                {new Date(session.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                              className="p-2 text-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                              title={t('chat.deleteSession')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <button 
                      onClick={startNewChat}
                      className="mt-4 w-full bg-primary/10 text-primary py-3 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('chat.newChat')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl shadow-primary/30 z-50 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isOpen ? <X className="w-8 h-8 relative z-10" /> : <BotMessageSquare className="w-8 h-8 relative z-10" />}
      </motion.button>
    </div>
  );
}
