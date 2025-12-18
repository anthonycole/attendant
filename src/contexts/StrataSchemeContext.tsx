'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { StrataScheme } from '@/types/strata';
import { useStrataSchemes } from '../hooks/useStrataData';

interface StrataSchemeContextType {
  currentScheme: StrataScheme | null;
  setCurrentScheme: (scheme: StrataScheme | null) => void;
  availableSchemes: StrataScheme[];
  isLoading: boolean;
  switchScheme: (schemeId: string) => void;
}

const StrataSchemeContext = createContext<StrataSchemeContextType | undefined>(undefined);

interface StrataSchemeProviderProps {
  children: ReactNode;
  initialSchemeId?: string;
}

export function StrataSchemeProvider({ children, initialSchemeId }: StrataSchemeProviderProps) {
  const [currentScheme, setCurrentScheme] = useState<StrataScheme | null>(null);
  
  // Fetch available strata schemes
  const { data: availableSchemes = [], isLoading } = useStrataSchemes();
  
  // Set initial scheme on load
  useEffect(() => {
    if (availableSchemes.length > 0 && !currentScheme) {
      // Try to use provided initialSchemeId, otherwise use first available
      const targetScheme = initialSchemeId 
        ? availableSchemes.find((scheme: StrataScheme) => scheme.id === initialSchemeId)
        : availableSchemes[0];
      
      if (targetScheme) {
        setCurrentScheme(targetScheme);
        // Store in localStorage for persistence
        localStorage.setItem('selectedStrataScheme', targetScheme.id);
      }
    }
  }, [availableSchemes, currentScheme, initialSchemeId]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSchemeId = localStorage.getItem('selectedStrataScheme');
    if (savedSchemeId && availableSchemes.length > 0) {
      const savedScheme = availableSchemes.find((scheme: StrataScheme) => scheme.id === savedSchemeId);
      if (savedScheme && !currentScheme) {
        setCurrentScheme(savedScheme);
      }
    }
  }, [availableSchemes, currentScheme]);

  const switchScheme = (schemeId: string) => {
    const scheme = availableSchemes.find((s: StrataScheme) => s.id === schemeId);
    if (scheme) {
      setCurrentScheme(scheme);
      localStorage.setItem('selectedStrataScheme', schemeId);
      
      // Optional: Update URL to reflect scheme change
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('scheme', schemeId);
      window.history.replaceState({}, '', currentUrl.toString());
    }
  };

  return (
    <StrataSchemeContext.Provider
      value={{
        currentScheme,
        setCurrentScheme,
        availableSchemes,
        isLoading,
        switchScheme,
      }}
    >
      {children}
    </StrataSchemeContext.Provider>
  );
}

export function useStrataScheme() {
  const context = useContext(StrataSchemeContext);
  if (context === undefined) {
    throw new Error('useStrataScheme must be used within a StrataSchemeProvider');
  }
  return context;
}