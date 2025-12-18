'use client';

import { Suspense } from 'react';
import { TasksProvider } from '@/contexts/TasksContext';
import { InboxContent } from '@/components/InboxContent';
import { Spinner, Center } from '@chakra-ui/react';

function TasksContent() {
  return (
    <TasksProvider>
      <InboxContent />
    </TasksProvider>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
