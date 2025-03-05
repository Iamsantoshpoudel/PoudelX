import { create } from 'zustand';
import { ChatState, Message, User, Note } from './types';
import { persist } from 'zustand/middleware';
import { sendMessage, updateUserStatus, subscribeToMessages, subscribeToUsers, updateMessageReadStatus, updateMessageDeliveredStatus, subscribeToNotes, createNote, deleteNote as firebaseDeleteNote } from './firebase';

const loadUserFromStorage = (): User | null => {
  const sessionUser = sessionStorage.getItem('currentUser');
  if (sessionUser) {
    return JSON.parse(sessionUser);
  }

  const cookieUser = document.cookie
    .split('; ')
    .find(row => row.startsWith('currentUser='));
  
  if (cookieUser) {
    return JSON.parse(decodeURIComponent(cookieUser.split('=')[1]));
  }

  return null;
};

const saveUserToStorage = (user: User | null) => {
  if (user && user.id) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = `currentUser=${encodeURIComponent(JSON.stringify(user))}; expires=${date.toUTCString()}; path=/`;
  } else {
    sessionStorage.removeItem('currentUser');
    document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

const loadLastActiveChatId = (): string | null => {
  return localStorage.getItem('lastActiveChatId');
};

const saveLastActiveChatId = (chatId: string | null) => {
  if (chatId) {
    localStorage.setItem('lastActiveChatId', chatId);
  } else {
    localStorage.removeItem('lastActiveChatId');
  }
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentUser: loadUserFromStorage(),
      selectedUser: null,
      messages: [],
      onlineUsers: [],
      notes: [],
      lastActiveChatId: loadLastActiveChatId(),
      
      setCurrentUser: async (user: User) => {
        try {
          if (user && user.id) {
            saveUserToStorage(user);
            const cleanup = await updateUserStatus(user);
            set({ currentUser: user });
            
            window.addEventListener('beforeunload', cleanup);
            return () => {
              cleanup();
              window.removeEventListener('beforeunload', cleanup);
            };
          } else {
            saveUserToStorage(null);
            set({ currentUser: null });
          }
        } catch (error) {
          console.error('Error updating user status:', error);
          set({ currentUser: user });
        }
      },
      setSelectedUser: (user: User | null) => {
        set((state) => {
          if (user && user.id !== state.currentUser?.id) {
            saveLastActiveChatId(user.id);
            
            const updatedMessages = state.messages.map(msg => {
              if (msg.senderId === user.id && 
                  msg.receiverId === state.currentUser?.id && 
                  !msg.isRead) {
                updateMessageReadStatus(msg.id, true)
                  .catch(console.error);
                return { ...msg, isRead: true };
              }
              return msg;
            });
            
            return { 
              selectedUser: user, 
              messages: updatedMessages,
              lastActiveChatId: user.id
            };
          }
          
          saveLastActiveChatId(null);
          return { 
            selectedUser: user,
            lastActiveChatId: null
          };
        });
      },
      addMessage: async (message: Message) => {
        set((state) => {
          const messageExists = state.messages.some(msg => 
            msg.id === message.id || 
            (msg.senderId === message.senderId && 
             msg.receiverId === message.receiverId && 
             msg.content === message.content && 
             Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
          );
          
          if (!messageExists) {
            const updatedMessage = { 
              ...message, 
              isDelivered: message.senderId === state.currentUser?.id ? true : false 
            };
            return { messages: [...state.messages, updatedMessage] };
          }
          return state;
        });
        
        try {
          await sendMessage(message);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      },
      updateOnlineUsers: (users: User[]) => set({ onlineUsers: users }),
      setMessageDelivered: (messageId: string) => {
        set(state => {
          const updatedMessages = state.messages.map(msg => {
            if (msg.id === messageId) {
              updateMessageDeliveredStatus(messageId, true)
                .catch(console.error);
              return { ...msg, isDelivered: true };
            }
            return msg;
          });
          return { messages: updatedMessages };
        });
      },
      setMessageRead: (messageId: string) => {
        set(state => {
          const updatedMessages = state.messages.map(msg => {
            if (msg.id === messageId) {
              updateMessageReadStatus(messageId, true)
                .catch(console.error);
              return { ...msg, isRead: true };
            }
            return msg;
          });
          return { messages: updatedMessages };
        });
      },
      addNote: async (note: Note) => {
        set(state => ({ notes: [...state.notes, note] }));
        try {
          await createNote(note);
        } catch (error) {
          console.error('Error creating note:', error);
        }
      },
      deleteNote: async (noteId: string) => {
        set(state => ({ 
          notes: state.notes.filter(note => note.id !== noteId)
        }));
        
        try {
          await firebaseDeleteNote(noteId);
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        messages: state.messages,
        notes: state.notes
      }),
    }
  )
);

if (typeof window !== 'undefined') {
  subscribeToMessages((messages) => {
    useChatStore.setState({ messages });
  });

  subscribeToUsers((users) => {
    useChatStore.setState({ onlineUsers: users });
  });
  
  subscribeToNotes((notes) => {
    useChatStore.setState({ notes });
  });
}
