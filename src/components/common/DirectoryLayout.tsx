'use client'

import { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'

interface DirectoryLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function DirectoryLayout({ sidebar, children }: DirectoryLayoutProps) {
  return (
    <Flex h="full" direction="row" overflow="hidden">
      {sidebar}
      <Box 
        flex={1} 
        overflow="auto" 
        h="full"
      >
        {children}
      </Box>
    </Flex>
  )
}