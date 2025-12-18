'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  CommunicationWithDetails,
  CommunicationChannel,
  CommunicationDirection,
  CommunicationFilters
} from '@/types/schema';
import { useCommunicationsWithDetails, useUpdateCommunication } from '@/hooks/useData';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';

interface CommunicationsContextType {
  // Data
  communications: CommunicationWithDetails[];
  selectedCommunication: CommunicationWithDetails | null;
  loadingCommunications: boolean;

  // Filters
  channelFilter: CommunicationChannel | 'all';
  directionFilter: CommunicationDirection | 'all';
  triagedFilter: boolean | 'all';
  showNeedsResponseOnly: boolean;
  setChannelFilter: (channel: CommunicationChannel | 'all') => void;
  setDirectionFilter: (direction: CommunicationDirection | 'all') => void;
  setTriagedFilter: (triaged: boolean | 'all') => void;
  setShowNeedsResponseOnly: (show: boolean) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;

  // Selection
  selectCommunication: (commId: string | null) => void;

  // Actions
  markAsTriaged: (commId: string) => Promise<void>;
  linkToTask: (commId: string, taskId: string) => Promise<void>;

  // Counts
  untriagedCount: number;
  needsResponseCount: number;
}

const CommunicationsContext = createContext<CommunicationsContextType | undefined>(undefined);

interface CommunicationsProviderProps {
  children: ReactNode;
  initialCommId?: string;
}

export function CommunicationsProvider({ children, initialCommId }: CommunicationsProviderProps) {
  const { currentScheme } = useStrataScheme();

  // Filters
  const [channelFilter, setChannelFilter] = useState<CommunicationChannel | 'all'>('all');
  const [directionFilter, setDirectionFilter] = useState<CommunicationDirection | 'all'>('all');
  const [triagedFilter, setTriagedFilter] = useState<boolean | 'all'>('all');
  const [showNeedsResponseOnly, setShowNeedsResponseOnly] = useState(false);

  // Selection
  const [selectedCommId, setSelectedCommId] = useState<string | null>(initialCommId || null);

  // Build filters object
  const filters: CommunicationFilters = {
    channel: channelFilter,
    direction: directionFilter,
    triaged: triagedFilter,
    needs_response: showNeedsResponseOnly,
  };

  // Fetch communications with filters
  const { data: communications = [], isLoading: loadingCommunications } = useCommunicationsWithDetails(
    currentScheme?.id || null,
    filters
  );

  // Mutations
  const updateCommunication = useUpdateCommunication(currentScheme?.id || '');

  // Selected communication
  const selectedCommunication = selectedCommId
    ? communications.find(c => c.id === selectedCommId) || null
    : null;

  // Counts
  const untriagedCount = communications.filter(c => !c.triaged).length;
  const needsResponseCount = communications.filter(c =>
    c.direction === 'inbound' && !c.triaged
  ).length;

  // Actions
  const markAsTriaged = async (commId: string) => {
    await updateCommunication.mutateAsync({
      id: commId,
      updates: {
        triaged: true,
        triaged_at: new Date().toISOString(),
        triaged_by: 'current-user', // TODO: Replace with actual user ID
      },
    });
  };

  const linkToTask = async (commId: string, taskId: string) => {
    await updateCommunication.mutateAsync({
      id: commId,
      updates: {
        task_id: taskId,
        triaged: true,
        triaged_at: new Date().toISOString(),
        triaged_by: 'current-user', // TODO: Replace with actual user ID
      },
    });
  };

  const selectCommunication = (commId: string | null) => {
    setSelectedCommId(commId);
  };

  const clearAllFilters = () => {
    setChannelFilter('all');
    setDirectionFilter('all');
    setTriagedFilter('all');
    setShowNeedsResponseOnly(false);
  };

  const hasActiveFilters =
    channelFilter !== 'all' ||
    directionFilter !== 'all' ||
    triagedFilter !== 'all' ||
    showNeedsResponseOnly;

  return (
    <CommunicationsContext.Provider
      value={{
        communications,
        selectedCommunication,
        loadingCommunications,
        channelFilter,
        directionFilter,
        triagedFilter,
        showNeedsResponseOnly,
        setChannelFilter,
        setDirectionFilter,
        setTriagedFilter,
        setShowNeedsResponseOnly,
        clearAllFilters,
        hasActiveFilters,
        selectCommunication,
        markAsTriaged,
        linkToTask,
        untriagedCount,
        needsResponseCount,
      }}
    >
      {children}
    </CommunicationsContext.Provider>
  );
}

export function useCommunications() {
  const context = useContext(CommunicationsContext);
  if (context === undefined) {
    throw new Error('useCommunications must be used within a CommunicationsProvider');
  }
  return context;
}
