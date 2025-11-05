'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface SavedItem {
  id: string;
  type: 'article' | 'match';
  title: string;
  date: string;
  url?: string;
}

interface UserContextType {
  savedItems: SavedItem[];
  saveItem: (item: SavedItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  matchReminders: Set<string>;
  toggleReminder: (matchId: string) => void;
  hasReminder: (matchId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [matchReminders, setMatchReminders] = useState<Set<string>>(new Set());

  // Load saved items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedItems');
    const reminders = localStorage.getItem('matchReminders');
    if (saved) setSavedItems(JSON.parse(saved));
    if (reminders) setMatchReminders(new Set(JSON.parse(reminders)));
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('matchReminders', JSON.stringify([...matchReminders]));
  }, [matchReminders]);

  const saveItem = (item: SavedItem) => {
    setSavedItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const hasItem = (id: string) => savedItems.some(item => item.id === id);

  const toggleReminder = (matchId: string) => {
    setMatchReminders(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) {
        next.delete(matchId);
      } else {
        next.add(matchId);
      }
      return next;
    });
  };

  const hasReminder = (matchId: string) => matchReminders.has(matchId);

  return (
    <UserContext.Provider value={{
      savedItems,
      saveItem,
      removeItem,
      hasItem,
      matchReminders,
      toggleReminder,
      hasReminder
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}