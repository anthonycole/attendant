'use client';

import React from 'react';
import {
  Box,
  Skeleton,
  HStack,
  VStack,
} from '@chakra-ui/react';

export function ThreadViewSkeleton() {
  return (
    <Box
      h="100vh"
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      {/* Header Skeleton */}
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Skeleton height="36px" width="60%" mb={4} />
        <HStack spacing={2} mb={4}>
          <Skeleton height="32px" width="100px" />
          <Skeleton height="32px" width="120px" />
          <Skeleton height="32px" width="110px" />
        </HStack>
        <Box bg="gray.50" p={4}>
          <HStack spacing={3} align="center">
            <Skeleton width="48px" height="48px" />
            <Box flex={1}>
              <Skeleton height="24px" width="40%" mb={2} />
              <Skeleton height="20px" width="60%" mb={1} />
              <Skeleton height="16px" width="30%" />
            </Box>
          </HStack>
        </Box>
      </Box>

      {/* Thread Messages Skeleton */}
      <Box p={6} flex={1}>
        <Skeleton height="20px" width="200px" mb={4} />
        {[1, 2, 3].map((i) => (
          <Box key={i} mb={4} p={4} border="1px" borderColor="gray.200">
            <HStack spacing={3} mb={3}>
              <Skeleton width="40px" height="40px" />
              <Box flex={1}>
                <Skeleton height="24px" width="35%" mb={1} />
                <Skeleton height="16px" width="50%" />
              </Box>
            </HStack>
            <Skeleton height="20px" width="40%" mb={3} />
            <Box bg="gray.50" p={3}>
              <Skeleton height="20px" width="95%" mb={2} />
              <Skeleton height="20px" width="88%" mb={2} />
              <Skeleton height="20px" width="75%" />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}