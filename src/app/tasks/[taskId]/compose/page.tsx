'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { TasksProvider } from '@/contexts/TasksContext';
import { InboxContent } from '@/components/InboxContent';
import { Spinner, Center } from '@chakra-ui/react';

function TaskComposeContent() {
  const params = useParams();
  const taskId = params.taskId as string;

  return (
    <TasksProvider initialTaskId={taskId} initialComposeOpen={true}>
      <InboxContent />
    </TasksProvider>
  );
}

export default function TaskComposePage() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      }
    >
      <TaskComposeContent />
    </Suspense>
  );
}
