'use client';

import { forwardRef } from 'react';
import {
  Popover as ChakraPopover,
  PopoverTrigger as ChakraPopoverTrigger,
  PopoverContent as ChakraPopoverContent,
  PopoverHeader as ChakraPopoverHeader,
  PopoverBody as ChakraPopoverBody,
  PopoverArrow as ChakraPopoverArrow,
  PopoverCloseButton as ChakraPopoverCloseButton,
} from '@chakra-ui/react';

export const PopoverRoot = ChakraPopover;
export const PopoverTrigger = ChakraPopoverTrigger;
export const PopoverArrow = ChakraPopoverArrow;
export const PopoverCloseButton = ChakraPopoverCloseButton;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraPopoverContent>
>(({ className, ...props }, ref) => (
  <ChakraPopoverContent
    ref={ref}
    className={className}
    bg="white"
    border="1px"
    borderColor="gray.200"
    borderRadius="md"
    shadow="lg"
    minW="300px"
    {...props}
  />
));
PopoverContent.displayName = 'PopoverContent';

export const PopoverHeader = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraPopoverHeader>
>(({ className, ...props }, ref) => (
  <ChakraPopoverHeader
    ref={ref}
    className={className}
    pb={2}
    borderBottomWidth={1}
    borderBottomColor="gray.100"
    fontSize="sm"
    fontWeight="600"
    {...props}
  />
));
PopoverHeader.displayName = 'PopoverHeader';

export const PopoverBody = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraPopoverBody>
>(({ className, ...props }, ref) => (
  <ChakraPopoverBody
    ref={ref}
    className={className}
    p={4}
    {...props}
  />
));
PopoverBody.displayName = 'PopoverBody';