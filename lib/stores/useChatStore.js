import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_MESSAGE = (t) => ({ 
  role: 'model', 
  text: t ? t('chat.initialMessage') : 'Hello! I am your HydroAir assistant. How can I help you today?', 
  id: 'initial' 
});

export const useChatStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      sessions: [], // Array of { id, title, messages, timestamp }
      currentSessionId: null,

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (isOpen) => set({ isOpen }),

      createNewSession: (initialMessageText) => {
        const id = Date.now().toString();
        const newSession = {
          id,
          title: 'New Conversation',
          messages: [{ 
            role: 'model', 
            text: initialMessageText || 'Hello! How can I help you today?', 
            id: 'initial-' + id 
          }],
          timestamp: Date.now(),
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
        }));
        return id;
      },

      ensureSession: (initialMessageText) => {
        const { currentSessionId, sessions } = get();
        const sessionExists = sessions.find(s => s.id === currentSessionId);
        
        if (!currentSessionId || !sessionExists) {
          return get().createNewSession(initialMessageText);
        }
        return currentSessionId;
      },

      addMessage: (msg) => {
        const { currentSessionId, sessions } = get();
        if (!currentSessionId) return;

        const updatedSessions = sessions.map((session) => {
          if (session.id === currentSessionId) {
            const newMessages = [...session.messages, { ...msg, id: Date.now().toString() }];
            // Update title based on first user message
            let newTitle = session.title;
            if (session.title === 'New Conversation' && msg.role === 'user') {
              newTitle = msg.text.slice(0, 30) + (msg.text.length > 30 ? '...' : '');
            }
            return { ...session, messages: newMessages, title: newTitle, timestamp: Date.now() };
          }
          return session;
        });

        set({ sessions: updatedSessions });
      },

      switchSession: (sessionId) => set({ currentSessionId: sessionId }),

      deleteSession: (sessionId) => set((state) => {
        const newSessions = state.sessions.filter(s => s.id !== sessionId);
        let nextSessionId = state.currentSessionId;
        if (state.currentSessionId === sessionId) {
          nextSessionId = newSessions.length > 0 ? newSessions[0].id : null;
        }
        return { sessions: newSessions, currentSessionId: nextSessionId };
      }),

      clearAll: () => set({ sessions: [], currentSessionId: null }),
    }),
    {
      name: 'chatbot-storage',
      partialize: (state) => ({ 
        sessions: state.sessions,
        // We don't persist currentSessionId so refresh starts "fresh" 
        // as per user requirement "on default and refresh should open new session"
      }),
    }
  )
);
