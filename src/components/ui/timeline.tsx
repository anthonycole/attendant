'use client';

import { Box, HStack } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface TimelineRootProps {
  children: React.ReactNode;
}

export const TimelineRoot = forwardRef<HTMLDivElement, TimelineRootProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {children}
      </Box>
    );
  }
);

TimelineRoot.displayName = 'TimelineRoot';

export interface TimelineItemProps {
  children: React.ReactNode;
}

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <HStack
        ref={ref}
        align="flex-start"
        gap={4}
        position="relative"
        pb={6}
        minH="60px" // Ensure minimum height for connector line
        _last={{
          pb: 2, // Reduce padding on last item
        }}
        {...props}
      >
        {children}
      </HStack>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineConnectorProps {
  children: React.ReactNode;
  isLast?: boolean;
}

export const TimelineConnector = forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ children, isLast = false, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexShrink={0}
        {...props}
      >
        {children}
        {/* Connector line - only show if not last */}
        {!isLast && (
          <Box
            position="absolute"
            top="36px"
            left="50%"
            transform="translateX(-50%)"
            width="2px"
            height="calc(100% + 16px)"
            bg="gray.200"
            zIndex={0}
          />
        )}
      </Box>
    );
  }
);

TimelineConnector.displayName = 'TimelineConnector';

export interface TimelineContentProps {
  children: React.ReactNode;
}

export const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} flex={1} {...props}>
        {children}
      </Box>
    );
  }
);

TimelineContent.displayName = 'TimelineContent';

export interface TimelineIndicatorProps {
  children?: React.ReactNode;
}

export const TimelineIndicator = forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        bg="brand.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w={8}
        h={8}
        color="white"
        fontWeight="600"
        fontSize="sm"
        zIndex={1}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

TimelineIndicator.displayName = 'TimelineIndicator';

export interface TimelineTitleProps {
  children: React.ReactNode;
}

export const TimelineTitle = forwardRef<HTMLDivElement, TimelineTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} fontWeight="600" fontSize="sm" color="gray.800" {...props}>
        {children}
      </Box>
    );
  }
);

TimelineTitle.displayName = 'TimelineTitle';

// Export a Timeline namespace for convenience
export const Timeline = {
  Root: TimelineRoot,
  Item: TimelineItem,
  Connector: TimelineConnector,
  Content: TimelineContent,
  Indicator: TimelineIndicator,
  Title: TimelineTitle,
};
