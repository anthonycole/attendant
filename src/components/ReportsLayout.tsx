'use client';

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { 
  FiBarChart, 
  FiPieChart, 
  FiTrendingUp, 
  FiCalendar,
  FiDownload,
  FiFileText,
} from 'react-icons/fi';
import { AppLayout } from './AppLayout';

// Another example showing a Reports layout using the abstracted AppLayout
export function ReportsLayout() {
  const [selectedReportType, setSelectedReportType] = useState<'financial' | 'maintenance' | 'compliance'>('financial');

  // Left navigation icons specific to reports
  const leftSidebarContent = (
    <VStack spacing={2} align="stretch" w="100%">
      <Tooltip label="Dashboard" placement="right">
        <IconButton
          icon={<FiBarChart />}
          aria-label="Dashboard"
          variant="ghost"
          color="white"
          size="md"
          borderRadius="md"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Tooltip>
      
      <Tooltip label="Analytics" placement="right">
        <IconButton
          icon={<FiTrendingUp />}
          aria-label="Analytics"
          variant="ghost"
          color="white"
          size="md"
          borderRadius="md"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Tooltip>
      
      <Tooltip label="Charts" placement="right">
        <IconButton
          icon={<FiPieChart />}
          aria-label="Charts"
          variant="ghost"
          color="white"
          size="md"
          borderRadius="md"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Tooltip>
      
      <Tooltip label="Schedule" placement="right">
        <IconButton
          icon={<FiCalendar />}
          aria-label="Schedule"
          variant="ghost"
          color="white"
          size="md"
          borderRadius="md"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Tooltip>
    </VStack>
  );

  // Reports-specific content
  const mainContent = (
    <Box h="100%" display="flex" overflow="hidden">
      {/* Report Categories */}
      <Box w="280px" borderRight="1px" borderColor="gray.200" bg="gray.50">
        <VStack spacing={2} p={4}>
          <Text fontWeight="600" fontSize="lg">Report Categories</Text>
          
          <VStack spacing={1} align="stretch" w="100%">
            {[
              { 
                id: 'financial', 
                label: 'Financial Reports', 
                icon: FiBarChart,
                reports: ['Levy Collection', 'Budget Analysis', 'Expense Tracking', 'Cash Flow']
              },
              { 
                id: 'maintenance', 
                label: 'Maintenance Reports', 
                icon: FiTrendingUp,
                reports: ['Work Orders', 'Asset Condition', 'Vendor Performance', 'Cost Analysis']
              },
              { 
                id: 'compliance', 
                label: 'Compliance Reports', 
                icon: FiFileText,
                reports: ['Safety Inspections', 'Insurance Status', 'By-law Violations', 'Meeting Minutes']
              },
            ].map((category) => (
              <Box key={category.id}>
                <Box
                  as="button"
                  onClick={() => setSelectedReportType(category.id as any)}
                  p={3}
                  borderRadius="md"
                  bg={selectedReportType === category.id ? 'brand.50' : 'transparent'}
                  border="1px solid"
                  borderColor={selectedReportType === category.id ? 'brand.200' : 'transparent'}
                  _hover={{ bg: selectedReportType === category.id ? 'brand.50' : 'gray.100' }}
                  transition="all 0.2s"
                  w="100%"
                >
                  <HStack spacing={3}>
                    <Icon 
                      as={category.icon} 
                      boxSize={5} 
                      color={selectedReportType === category.id ? 'brand.500' : 'gray.500'} 
                    />
                    <Text
                      fontSize="sm"
                      fontWeight={selectedReportType === category.id ? 600 : 400}
                      color={selectedReportType === category.id ? 'brand.700' : 'gray.700'}
                    >
                      {category.label}
                    </Text>
                  </HStack>
                </Box>
                
                {/* Sub-reports */}
                {selectedReportType === category.id && (
                  <VStack spacing={1} align="stretch" mt={2} ml={4}>
                    {category.reports.map((report) => (
                      <Box
                        key={report}
                        as="button"
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                        transition="all 0.2s"
                        textAlign="left"
                      >
                        <Text fontSize="xs" color="gray.600">
                          {report}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>
      
      {/* Reports List */}
      <Box flex={1} borderRight="1px" borderColor="gray.200">
        <Box h="100%" p={4}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="600">
              {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Reports
            </Text>
            <Button leftIcon={<FiDownload />} size="sm" variant="outline">
              Export All
            </Button>
          </HStack>
          
          {/* Placeholder for reports list */}
          <VStack spacing={3} align="stretch">
            {Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                p={4}
                bg="white"
                borderRadius="lg"
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ shadow: 'md', borderColor: 'gray.200' }}
                cursor="pointer"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="600" fontSize="sm">
                      {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report #{i + 1}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Generated on {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </Text>
                    <HStack spacing={2}>
                      <Box bg="green.100" px={2} py={1} borderRadius="md" fontSize="xs" color="green.700">
                        Completed
                      </Box>
                      <Box bg="gray.100" px={2} py={1} borderRadius="md" fontSize="xs">
                        PDF
                      </Box>
                    </HStack>
                  </VStack>
                  <VStack spacing={1}>
                    <IconButton
                      icon={<FiDownload />}
                      aria-label="Download report"
                      size="sm"
                      variant="ghost"
                    />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
      
      {/* Report Preview */}
      <Box w="400px">
        <Box h="100%" p={4} bg="gray.50">
          <Text fontSize="lg" fontWeight="600" mb={4}>
            Report Preview
          </Text>
          <Box
            p={4}
            bg="white"
            borderRadius="lg"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            h="300px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack spacing={2}>
              <Icon as={FiFileText} boxSize={12} color="gray.300" />
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Select a report from the list to preview it here.
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const handleCreateReport = () => {
    console.log('Create new report');
  };

  return (
    <AppLayout
      leftSidebar={leftSidebarContent}
      headerTitle="Reports & Analytics"
      showCreateButton={true}
      onCreateClick={handleCreateReport}
      createButtonLabel="Generate new report"
    >
      {mainContent}
    </AppLayout>
  );
}