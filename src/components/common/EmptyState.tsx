'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center" maxW="400px" px={6}>
        <Text fontSize="lg" color="gray.600" fontWeight="600" mb={2}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {description}
        </Text>
      </Box>
    </Box>
  );
}