'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { TasksProvider } from '@/contexts/TasksContext';
import { InboxContent } from '@/components/InboxContent';
import { Spinner, Center } from '@chakra-ui/react';

function TaskCommunicationsContent() {
  const params = useParams();
  const taskId = params.taskId as string;

  return (
    <TasksProvider initialTaskId={taskId} initialTab="timeline">
      <InboxContent />
    </TasksProvider>
  );
}

export default function TaskCommunicationsPage() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      }
    >
      <TaskCommunicationsContent />
    </Suspense>
  );
}
