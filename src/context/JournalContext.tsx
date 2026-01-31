import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TradeJournal, Note } from '@/types/journal';
import { useAuth } from './AuthContext';

interface JournalContextType {
  journals: TradeJournal[];
  notes: Note[];
  addJournal: (journal: Omit<TradeJournal, 'id' | 'createdAt'>) => void;
  deleteJournal: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getTotalPnL: () => number;
  getWinRate: () => number;
  getTotalTrades: () => number;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [journals, setJournals] = useState<TradeJournal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user) {
      const storedJournals = localStorage.getItem(`journals_${user.id}`);
      const storedNotes = localStorage.getItem(`notes_${user.id}`);
      
      if (storedJournals) setJournals(JSON.parse(storedJournals));
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } else {
      setJournals([]);
      setNotes([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`journals_${user.id}`, JSON.stringify(journals));
    }
  }, [journals, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const addJournal = (journal: Omit<TradeJournal, 'id' | 'createdAt'>) => {
    const newJournal: TradeJournal = {
      ...journal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setJournals((prev) => [newJournal, ...prev]);
  };

  const deleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const getTotalPnL = () => {
    return journals.reduce((sum, j) => sum + j.profitLoss, 0);
  };

  const getWinRate = () => {
    if (journals.length === 0) return 0;
    const wins = journals.filter((j) => j.tradeStatus === 'win').length;
    return (wins / journals.length) * 100;
  };

  const getTotalTrades = () => journals.length;

  return (
    <JournalContext.Provider
      value={{
        journals,
        notes,
        addJournal,
        deleteJournal,
        addNote,
        updateNote,
        deleteNote,
        getTotalPnL,
        getWinRate,
        getTotalTrades,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
