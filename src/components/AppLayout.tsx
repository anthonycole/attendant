'use client';

import React, { useState, type ReactNode } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Tooltip,
  Select,
  Badge,
} from '@chakra-ui/react';
import {
  FiPlus,
} from 'react-icons/fi';
import { PiHeadset } from 'react-icons/pi';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';

interface AppLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  headerTitle?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
}

const thinSidebarWidth = '60px';
const mainSidebarWidth = '240px';

export function AppLayout({
  children,
  leftSidebar,
  rightSidebar,
  headerTitle = 'Attendant',
  showCreateButton = false,
  onCreateClick,
  createButtonLabel = 'Create new item',
}: AppLayoutProps) {
  const { availableSchemes, currentScheme, switchScheme } = useStrataScheme();
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      setCreateDrawerOpen(true);
    }
  };

  return (
    <Flex h="100vh">
      {/* Left Thin Sidebar */}
      <Box
        w={thinSidebarWidth}
        bg="brand.500"
        borderRight="1px"
        borderColor="brand.600"
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={4}
      >
        {/* Logo */}
        <Box
          width="40px"
          height="40px"
          bg="transparent"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={6}
        >
          <Icon as={PiHeadset} boxSize={6} color="white" />
        </Box>

        <VStack spacing={2} align="stretch" w="100%">
          {/* App-specific navigation icons can be passed via leftSidebar */}
          {leftSidebar}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} h="100vh" overflow="hidden" bg="white" position="relative">
        {/* Top Header with OC Switcher */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          px={6}
          py={3}
          zIndex={5}
        >
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="600" color="gray.800">
              {headerTitle}
            </Text>
            
            <HStack spacing={3}>
              {/* OC Switcher - Always visible */}
              <HStack spacing={2}>
                <Icon as={PiHeadset} boxSize={5} color="brand.500" />
                <Select
                  value={currentScheme?.id || ''}
                  onChange={(e) => switchScheme(e.target.value)}
                  size="sm"
                  bg="white"
                  borderColor="gray.300"
                  minW="200px"
                  fontWeight="500"
                  placeholder={availableSchemes?.length === 0 ? "Loading..." : "Select OC..."}
                  isDisabled={!availableSchemes || availableSchemes.length === 0}
                >
                  {availableSchemes?.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.scheme_name}
                    </option>
                  ))}
                </Select>
              </HStack>
              
              {currentScheme && (
                <Badge colorScheme="brand" variant="subtle" px={3} py={1} borderRadius="full">
                  {currentScheme.total_lots} lots • {currentScheme.total_units || 0} units
                </Badge>
              )}
            </HStack>
          </HStack>
        </Box>
        
        {/* Content with top padding for header */}
        <Box pt="60px" h="100%" overflowY="auto" overflowX="hidden">
          {children}
        </Box>

        {/* Floating Action Button */}
        {showCreateButton && (
          <IconButton
            aria-label={createButtonLabel}
            icon={<FiPlus />}
            colorScheme="brand"
            size="lg"
            position="fixed"
            bottom={6}
            right={6}
            shadow="lg"
            onClick={handleCreateClick}
          />
        )}
      </Box>

      {/* Right Sidebar (optional) */}
      {rightSidebar && (
        <Box
          w={mainSidebarWidth}
          bg="gray.50"
          borderLeft="1px"
          borderColor="gray.200"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          {rightSidebar}
        </Box>
      )}
    </Flex>
  );
}