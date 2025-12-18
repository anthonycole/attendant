'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Wrap,
  WrapItem,
  Text,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { FiLink, FiMail, FiPhone, FiMessageSquare, FiGlobe, FiFileText } from 'react-icons/fi';
import type { TicketCategory } from '@/types';
import type { TaskStatus, CommunicationChannel } from '@/types/schema';
import { useInbox } from '@/contexts/TasksContext';

interface CreateIssueDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (issue: NewIssueData) => void;
  linkedCommunication?: {
    channel: CommunicationChannel;
    customerName?: string;
    subject?: string;
    timestamp: string;
  };
}

export interface NewIssueData {
  subject: string;
  category: TicketCategory;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  due_date?: string;
  tags: string[];
  customerId?: string;
}

const categories: { value: TicketCategory; label: string }[] = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'repairs', label: 'Repairs' },
  { value: 'noise_complaint', label: 'Noise Complaints' },
  { value: 'parking', label: 'Parking' },
  { value: 'pets', label: 'Pets' },
  { value: 'common_property', label: 'Common Property' },
  { value: 'levy_inquiry', label: 'Levy Inquiries' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'by_laws', label: 'By-Laws' },
  { value: 'meeting_inquiry', label: 'Meeting Inquiries' },
  { value: 'other', label: 'Other' },
];

const priorities: { value: 'low' | 'medium' | 'high' | 'urgent'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_on_customer', label: 'Waiting on Customer' },
  { value: 'waiting_on_committee', label: 'Waiting on Committee' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

function getChannelIcon(channel: CommunicationChannel) {
  switch (channel) {
    case 'email': return FiMail;
    case 'phone': return FiPhone;
    case 'sms': return FiMessageSquare;
    case 'web': return FiGlobe;
    case 'internal': return FiFileText;
    default: return FiMail;
  }
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-AU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CreateIssueDrawer({ open, onClose, onSubmit, linkedCommunication }: CreateIssueDrawerProps) {
  const [formData, setFormData] = useState<NewIssueData>({
    subject: '',
    category: 'other',
    status: 'open',
    priority: 'medium',
    description: '',
    due_date: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (field: keyof NewIssueData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      subject: '',
      category: 'other',
      status: 'open',
      priority: 'medium',
      description: '',
      due_date: '',
      tags: [],
    });
    setTagInput('');
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      subject: '',
      category: 'other',
      status: 'open',
      priority: 'medium',
      description: '',
      due_date: '',
      tags: [],
    });
    setTagInput('');
    onClose();
  };

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" py={3}>
          <Text fontSize="md" fontWeight="600">Create New Task</Text>
        </DrawerHeader>

        <DrawerBody py={4}>
          <form id="create-issue-form" onSubmit={handleSubmit}>
            <VStack spacing={3} align="stretch">
              {/* Linked Communication Context */}
              {linkedCommunication && (
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderLeft="4px"
                  borderLeftColor="blue.400"
                >
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Icon as={FiLink} boxSize={4} color="blue.600" />
                      <Text fontSize="sm" fontWeight="600" color="blue.900">
                        Creating task from communication
                      </Text>
                    </HStack>
                    <HStack spacing={2} fontSize="xs" color="blue.800">
                      <Icon as={getChannelIcon(linkedCommunication.channel)} boxSize={3} />
                      <Badge size="sm" colorScheme="blue" textTransform="capitalize">
                        {linkedCommunication.channel}
                      </Badge>
                      {linkedCommunication.customerName && (
                        <Text>• {linkedCommunication.customerName}</Text>
                      )}
                      <Text>• {formatTimestamp(linkedCommunication.timestamp)}</Text>
                    </HStack>
                    {linkedCommunication.subject && (
                      <Text fontSize="xs" color="blue.700" fontStyle="italic">
                        "{linkedCommunication.subject}"
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Subject</FormLabel>
                <Input
                  placeholder="Brief description of the task"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  size="sm"
                />
              </FormControl>

              {/* Category and Status in same row */}
              <HStack spacing={3}>
                <FormControl isRequired flex={1}>
                  <FormLabel fontSize="sm" mb={1}>Category</FormLabel>
                  <Select value={formData.category} onChange={handleChange('category')} size="sm">
                    {categories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired flex={1}>
                  <FormLabel fontSize="sm" mb={1}>Status</FormLabel>
                  <Select value={formData.status} onChange={handleChange('status')} size="sm">
                    {statuses.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              {/* Priority and Due Date in same row */}
              <HStack spacing={3}>
                <FormControl isRequired flex={1}>
                  <FormLabel fontSize="sm" mb={1}>Priority</FormLabel>
                  <Select value={formData.priority} onChange={handleChange('priority')} size="sm">
                    {priorities.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel fontSize="sm" mb={1}>Due Date</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={handleChange('due_date')}
                    size="sm"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontSize="sm" mb={1}>Tags</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <HStack spacing={2}>
                    <Input
                      placeholder="Add tags (press Enter or comma)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      size="sm"
                      fontSize="sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={addTag}
                      isDisabled={!tagInput.trim()}
                      px={3}
                    >
                      Add
                    </Button>
                  </HStack>
                  {formData.tags.length > 0 && (
                    <Box>
                      <Wrap spacing={1}>
                        {formData.tags.map((tag) => (
                          <WrapItem key={tag}>
                            <Tag size="sm" colorScheme="blue" variant="solid">
                              <TagLabel fontSize="xs">{tag}</TagLabel>
                              <TagCloseButton onClick={() => removeTag(tag)} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                </VStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Description</FormLabel>
                <Textarea
                  rows={4}
                  placeholder="Detailed description of the task..."
                  value={formData.description}
                  onChange={handleChange('description')}
                  size="sm"
                  fontSize="sm"
                />
              </FormControl>
            </VStack>
          </form>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" py={3}>
          <HStack spacing={2}>
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-issue-form"
              colorScheme="brand"
              isDisabled={!formData.subject || !formData.description}
              size="sm"
            >
              Create Task
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
