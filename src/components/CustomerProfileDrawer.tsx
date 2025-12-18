'use client';

import { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  Textarea,
  Input,
  Select,
  IconButton,
  Tabs,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '@/components/ui/accordion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiMapPin,
  FiMessageSquare,
  FiPhoneCall,
  FiClock,
  FiX,
} from 'react-icons/fi';
import type { Customer } from '@/types/schema';
import type { CommunicationActivity } from '@/types';

interface CustomerProfileDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

// Mock data for building/strata information
const getMockStrataInfo = (customerId: string) => ({
  building_name: 'Attendant Estates',
  strata_plan: 'LMS1234',
  lot_number: `LOT ${Math.floor(Math.random() * 500) + 1}`,
  building_address: '123 Main Street, Vancouver, BC V6B 1A1',
  parking_stall: 'P-42',
  locker: 'L-15',
  total_units: 156,
});

export function CustomerProfileDrawer({ customer, onClose }: CustomerProfileDrawerProps) {
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  const [callLog, setCallLog] = useState({
    type: 'phone' as const,
    direction: 'outbound' as 'inbound' | 'outbound',
    duration: '',
    notes: '',
  });

  if (!customer) return null;

  const strataInfo = getMockStrataInfo(customer.id);

  const handleLogCall = () => {
    // TODO: Implement API call to log communication
    console.log('Logging call:', callLog);
    onModalClose();
    setCallLog({
      type: 'phone',
      direction: 'outbound',
      duration: '',
      notes: '',
    });
  };

  // Mock communication history for this customer
  const mockCommunications: CommunicationActivity[] = [
    {
      id: '1',
      ticket_id: 'stub-ticket-1',
      customer_id: customer.id,
      activity_type: 'phone',
      direction: 'outbound',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 420, // 7 minutes
      from: 'Office',
      to: customer.phone || 'N/A',
      notes: 'Discussed maintenance request for unit plumbing issue',
    },
    {
      id: '2',
      ticket_id: 'stub-ticket-2',
      customer_id: customer.id,
      activity_type: 'email',
      direction: 'inbound',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      from: customer.email,
      to: 'support@stewardestates.com',
      subject: 'Parking concern',
      body: 'There is a car parked in my assigned spot...',
    },
    {
      id: '3',
      ticket_id: 'stub-ticket-1',
      customer_id: customer.id,
      activity_type: 'sms',
      direction: 'inbound',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      from: customer.phone || 'N/A',
      to: '1300 STRATA',
      body: 'When will the plumber arrive?',
    },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Box h="100%" bg="white" display="flex" flexDirection="column">
      {/* Header with close button */}
      <Box 
        p={4} 
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        flexShrink={0}
      >
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="600" color="gray.900">
            Customer Profile
          </Text>
          <HStack spacing={2}>
            <Button
              onClick={onOpen}
              colorScheme="blue"
              size="sm"
              variant="outline"
            >
              Log Communication
            </Button>
            <IconButton
              aria-label="Close profile"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Scrollable content */}
      <Box flex={1} overflow="auto" bg="gray.50">
        <VStack align="stretch" spacing={0}>
          {/* Customer Header - Above the fold */}
          <Box bg="white" p={4} borderBottom="1px solid" borderColor="gray.200">
            <HStack spacing={4} align="start">
              <Avatar
                size="lg"
                bg="gray.100"
                color="gray.600"
                icon={<FiUser size="20px" />}
              />
              <VStack spacing={2} align="start" flex={1}>
                <Text fontSize="xl" fontWeight="600" color="gray.900">
                  {customer.first_name} {customer.last_name}
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Text fontSize="sm" color="gray.600">
                    Unit {customer.unit_number} • {customer.customer_type?.replace(/_/g, ' ') || 'Owner'}
                  </Text>
                </HStack>
                <VStack spacing={1} align="start">
                  <HStack spacing={2}>
                    <FiMail size={14} />
                    <Text fontSize="sm" color="gray.700">{customer.email}</Text>
                  </HStack>
                  {customer.phone && (
                    <HStack spacing={2}>
                      <FiPhone size={14} />
                      <Text fontSize="sm" color="gray.700">{customer.phone}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </HStack>
          </Box>

          {/* Key Property Info - Above the fold */}
          <Box bg="gray.50" p={4} borderBottom="1px solid" borderColor="gray.200">
            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={3}>
              Property Information
            </Text>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Building:</Text>
                <Text fontSize="sm" color="gray.900" textAlign="right" flex={1} pl={2}>
                  {strataInfo.building_name}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Lot Number:</Text>
                <Text fontSize="sm" color="gray.900">{strataInfo.lot_number}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Strata Plan:</Text>
                <Text fontSize="sm" color="gray.900">{strataInfo.strata_plan}</Text>
              </HStack>
            </VStack>
          </Box>

            {/* Additional Details */}
            <AccordionRoot defaultIndex={[]} allowMultiple>
              {/* Additional Contact Information */}
              <AccordionItem bg="white" border="none" borderBottom="1px solid" borderColor="gray.200">
                <AccordionItemTrigger
                  bg="white"
                  _hover={{ bg: "gray.50" }}
                  px={4}
                  py={3}
                  borderBottom="none"
                >
                  <HStack spacing={2}>
                    <FiMail size={16} />
                    <Text fontWeight="500" fontSize="sm">
                      Additional Contact Details
                    </Text>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={4} py={3} bg="gray.50">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    All contact information is displayed above. Additional contact methods can be added here when available.
                  </Text>
                </AccordionItemContent>
              </AccordionItem>

              {/* Additional Property Details */}
              <AccordionItem bg="white" border="none" borderBottom="1px solid" borderColor="gray.200">
                <AccordionItemTrigger
                  bg="white"
                  _hover={{ bg: "gray.50" }}
                  px={4}
                  py={3}
                  borderBottom="none"
                >
                  <HStack spacing={2}>
                    <FiHome size={16} />
                    <Text fontWeight="500" fontSize="sm">
                      Additional Property Details
                    </Text>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={4} py={3} bg="gray.50">
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Parking:</Text>
                      <Text fontSize="sm" color="gray.900">{strataInfo.parking_stall || 'Not assigned'}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Locker:</Text>
                      <Text fontSize="sm" color="gray.900">{strataInfo.locker || 'Not assigned'}</Text>
                    </HStack>
                    <Box pt={2} borderTop="1px solid" borderColor="gray.200">
                      <Text fontSize="xs" color="gray.500">
                        {strataInfo.building_address}
                      </Text>
                    </Box>
                  </VStack>
                </AccordionItemContent>
              </AccordionItem>

              {/* Communication History */}
              <AccordionItem bg="white" border="none" borderBottom="1px solid" borderColor="gray.200">
                <AccordionItemTrigger
                  bg="white"
                  _hover={{ bg: "gray.50" }}
                  px={4}
                  py={3}
                  borderBottom="none"
                >
                  <HStack spacing={2} w="full">
                    <FiMessageSquare size={16} />
                    <Text fontWeight="500" fontSize="sm">
                      Communication History
                    </Text>
                    <Text fontSize="xs" color="gray.500" ml="auto">
                      {mockCommunications.length} items
                    </Text>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={4} py={3} bg="gray.50">
                  <VStack align="stretch" spacing={3}>
                    {mockCommunications.map((comm) => (
                      <Box
                        key={comm.id}
                        p={3}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderLeft="3px solid"
                        borderLeftColor={comm.direction === 'inbound' ? 'blue.400' : 'green.400'}
                      >
                        <HStack justify="space-between" mb={2}>
                          <HStack spacing={2}>
                            {comm.activity_type === 'phone' && <FiPhoneCall size={14} />}
                            {comm.activity_type === 'sms' && <FiMessageSquare size={14} />}
                            {comm.activity_type === 'email' && <FiMail size={14} />}
                            <Text fontSize="sm" fontWeight="500" textTransform="capitalize">
                              {comm.activity_type}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {comm.direction}
                            </Text>
                          </HStack>
                          {comm.duration && (
                            <HStack spacing={1}>
                              <FiClock size={12} />
                              <Text fontSize="xs" color="gray.600">
                                {formatDuration(comm.duration)}
                              </Text>
                            </HStack>
                          )}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mb={2}>
                          {formatTimestamp(comm.timestamp)}
                        </Text>
                        {comm.subject && (
                          <Text fontSize="sm" fontWeight="500" mb={1}>
                            {comm.subject}
                          </Text>
                        )}
                        {comm.body && (
                          <Text fontSize="sm" color="gray.700" noOfLines={2}>
                            {comm.body}
                          </Text>
                        )}
                        {comm.notes && (
                          <Text fontSize="sm" color="gray.600" fontStyle="italic" mt={2}>
                            {comm.notes}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </AccordionItemContent>
              </AccordionItem>
            </AccordionRoot>
          </VStack>
        </Box>

        {/* Communication Modal */}
        <Modal isOpen={isOpen} onClose={onModalClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Log New Communication</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Select
                  value={callLog.type}
                  onChange={(e) => setCallLog({ ...callLog, type: e.target.value as 'phone' })}
                >
                  <option value="phone">Phone Call</option>
                  <option value="sms">Text Message</option>
                  <option value="email">Email</option>
                </Select>
                
                <Select
                  value={callLog.direction}
                  onChange={(e) =>
                    setCallLog({ ...callLog, direction: e.target.value as 'inbound' | 'outbound' })
                  }
                >
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </Select>
                
                {callLog.type === 'phone' && (
                  <Input
                    placeholder="Duration (seconds)"
                    type="number"
                    value={callLog.duration}
                    onChange={(e) => setCallLog({ ...callLog, duration: e.target.value })}
                  />
                )}
                
                <Textarea
                  placeholder="Notes..."
                  value={callLog.notes}
                  onChange={(e) => setCallLog({ ...callLog, notes: e.target.value })}
                  rows={4}
                  resize="vertical"
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={2}>
                <Button 
                  onClick={handleLogCall} 
                  colorScheme="blue"
                >
                  Save Communication
                </Button>
                <Button
                  onClick={onModalClose}
                  variant="outline"
                >
                  Cancel
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
  );
}
