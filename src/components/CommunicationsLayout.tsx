'use client';

import React from 'react';
import {
  Tooltip,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { FiInbox, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import { AppLayout } from './AppLayout';

interface CommunicationsLayoutProps {
  children: React.ReactNode;
}

export function CommunicationsLayout({ children }: CommunicationsLayoutProps) {
  // Left navigation icons - same as inbox but with communications highlighted
  const leftSidebarContent = (
    <VStack spacing={2} align="stretch" w="100%">
      <Tooltip label="Tasks" placement="right">
        <Link href="/tasks" passHref legacyBehavior>
          <IconButton
            as="a"
            icon={<FiInbox />}
            aria-label="Tasks"
            variant="ghost"
            color="white"
            size="md"
            borderRadius="md"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Link>
      </Tooltip>

      <Tooltip label="Communications" placement="right">
        <Link href="/communications" passHref legacyBehavior>
          <IconButton
            as="a"
            icon={<FiMessageSquare />}
            aria-label="Communications"
            variant="ghost"
            color="white"
            size="md"
            borderRadius="md"
            bg="rgba(255, 255, 255, 0.15)"
            _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
          />
        </Link>
      </Tooltip>
    </VStack>
  );

  return (
    <AppLayout
      leftSidebar={leftSidebarContent}
      headerTitle="Communications"
    >
      {children}
    </AppLayout>
  );
}
