'use client';

import { MainLayout } from '@/components/MainLayout';
import { CommunicationsProvider } from '@/contexts/CommunicationsContext';
import { CommunicationsDashboard } from '@/components/communications/CommunicationsDashboard';

export default function CommunicationsPage() {
  return (
    <CommunicationsProvider>
      <MainLayout>
        <CommunicationsDashboard />
      </MainLayout>
    </CommunicationsProvider>
  );
}
