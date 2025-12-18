'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CommunicationsProvider } from '@/contexts/CommunicationsContext';
import { MainLayout } from '@/components/MainLayout';
import { CommunicationsDashboard } from '@/components/communications/CommunicationsDashboard';
import { Spinner, Center } from '@chakra-ui/react';

function CommunicationContent() {
  const params = useParams();
  const commId = params.commId as string;

  return (
    <CommunicationsProvider initialCommId={commId}>
      <MainLayout>
        <CommunicationsDashboard />
      </MainLayout>
    </CommunicationsProvider>
  );
}

export default function CommunicationPage() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      }
    >
      <CommunicationContent />
    </Suspense>
  );
}