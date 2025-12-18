'use client';

import React from 'react';
import {
  Box,
  Tooltip,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLayout } from './AppLayout';
import { NAVIGATION_ITEMS, getActiveNavigationItem } from '@/lib/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
}

export function MainLayout({ 
  children, 
  headerTitle,
  showCreateButton = false,
  onCreateClick,
  createButtonLabel
}: MainLayoutProps) {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(pathname);

  // Build left sidebar navigation
  const leftSidebarContent = (
    <VStack spacing={2} align="stretch" w="100%">
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem?.id === item.id;
        
        return (
          <Tooltip key={item.id} label={item.label} placement="right">
            <Box w="100%">
              <IconButton
                as={Link}
                href={item.href}
                icon={<Icon />}
                aria-label={item.label}
                variant="ghost"
                color="white"
                size="md"
                borderRadius="md"
                w="100%"
                h="48px"
                bg={isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                _hover={{ 
                  bg: isActive 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  textDecoration: 'none'
                }}
                _active={{ 
                  bg: 'rgba(255, 255, 255, 0.2)' 
                }}
                transition="background-color 0.2s ease"
              />
            </Box>
          </Tooltip>
        );
      })}
    </VStack>
  );

  // Auto-generate header title if not provided
  const displayTitle = headerTitle || activeItem?.label || 'Dashboard';

  return (
    <AppLayout
      leftSidebar={leftSidebarContent}
      headerTitle={displayTitle}
      showCreateButton={showCreateButton}
      onCreateClick={onCreateClick}
      createButtonLabel={createButtonLabel}
    >
      {children}
    </AppLayout>
  );
}