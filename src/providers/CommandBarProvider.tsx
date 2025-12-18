'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface CommandBarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandBarContext = createContext<CommandBarContextType | undefined>(undefined);

export function useCommandBar() {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error('useCommandBar must be used within CommandBarProvider');
  }
  return context;
}

interface CommandBarProviderProps {
  children: ReactNode;
}

export function CommandBarProvider({ children }: CommandBarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Check for Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return (
    <CommandBarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CommandBarContext.Provider>
  );
}
