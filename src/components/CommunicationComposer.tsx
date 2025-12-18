'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  Input,
  Select,
  IconButton,
  Badge,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiX, FiSend, FiFileText, FiEdit3, FiUsers, FiUser, FiMail } from 'react-icons/fi';
import type { TaskWithDetails, CommunicationChannel } from '@/types/schema';
import cannedResponsesData from '@/data/canned-responses.json';

interface CannedResponse {
  id: string;
  category: string;
  title: string;
  description: string;
  subject: string;
  body: string;
}

interface CommunicationComposerProps {
  task: TaskWithDetails;
  onClose: () => void;
}

type RecipientType = 'customer' | 'committee' | 'custom';

export function CommunicationComposer({ task, onClose }: CommunicationComposerProps) {
  const [composerType, setComposerType] = useState<'canned' | 'custom'>('canned');
  const [selectedResponseId, setSelectedResponseId] = useState<string>('');
  const [channel, setChannel] = useState<CommunicationChannel>('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('customer');
  const [customRecipient, setCustomRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const cannedResponses = cannedResponsesData as CannedResponse[];

  // Initialize custom recipient from task customer
  useEffect(() => {
    if (task.customer?.email) {
      setCustomRecipient(task.customer.email);
    }
  }, [task]);

  // Get effective recipient based on type
  const getEffectiveRecipient = (): string => {
    switch (recipientType) {
      case 'customer':
        return task.customer?.email || '';
      case 'committee':
        return 'committee@stewardestates.com'; // TODO: Get from strata scheme
      case 'custom':
        return customRecipient;
      default:
        return '';
    }
  };

  // Apply canned response template
  useEffect(() => {
    if (selectedResponseId && composerType === 'canned') {
      const response = cannedResponses.find(r => r.id === selectedResponseId);
      if (response) {
        const processedSubject = processTemplate(response.subject);
        const processedBody = processTemplate(response.body);
        setSubject(processedSubject);
        setBody(processedBody);
      }
    }
  }, [selectedResponseId, composerType, task]);

  const processTemplate = (template: string): string => {
    return template
      .replace(/\{\{task_subject\}\}/g, task.subject || '')
      .replace(/\{\{task_category\}\}/g, task.category || '')
      .replace(/\{\{task_priority\}\}/g, task.priority || '')
      .replace(/\{\{task_status\}\}/g, task.status || '')
      .replace(/\{\{task_description\}\}/g, task.description || '')
      .replace(/\{\{task_id\}\}/g, task.id || '')
      .replace(/\{\{customer_name\}\}/g, task.customer ? `${task.customer.first_name} ${task.customer.last_name}` : '')
      .replace(/\{\{customer_unit\}\}/g, task.customer?.unit_number || '')
      .replace(/\{\{customer_email\}\}/g, task.customer?.email || '')
      .replace(/\{\{building_name\}\}/g, 'Emerald Tower') // TODO: Get from strata scheme
      .replace(/\{\{scheduled_date\}\}/g, '[Date to be confirmed]')
      .replace(/\{\{scheduled_time\}\}/g, '[Time to be confirmed]')
      .replace(/\{\{estimated_duration\}\}/g, '[Duration to be confirmed]')
      .replace(/\{\{contractor_name\}\}/g, '[Contractor to be assigned]')
      .replace(/\{\{access_instructions\}\}/g, 'Please ensure someone is home to provide access.')
      .replace(/\{\{levy_amount\}\}/g, '[Amount]')
      .replace(/\{\{levy_due_date\}\}/g, '[Due Date]')
      .replace(/\{\{payment_status\}\}/g, '[Status]')
      .replace(/\{\{bpay_reference\}\}/g, '[Reference Number]')
      .replace(/\{\{incident_datetime\}\}/g, '[Date/Time]')
      .replace(/\{\{incident_location\}\}/g, '[Location]')
      .replace(/\{\{incident_description\}\}/g, task.description || '[Description]')
      .replace(/\{\{vehicle_details\}\}/g, '[Vehicle Details]')
      .replace(/\{\{parking_location\}\}/g, '[Parking Location]')
      .replace(/\{\{violation_datetime\}\}/g, '[Date/Time]')
      .replace(/\{\{violation_type\}\}/g, '[Violation Type]')
      .replace(/\{\{short_term_letting_policy\}\}/g, 'Short-term letting requires committee approval');
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      // TODO: Implement actual send logic via API
      console.log('Sending communication:', {
        taskId: task.id,
        channel,
        recipient: getEffectiveRecipient(),
        subject,
        body,
        type: composerType,
        templateId: selectedResponseId,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close composer after successful send
      onClose();
    } catch (error) {
      console.error('Failed to send communication:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isValid = getEffectiveRecipient() && subject && body && channel;

  // Group canned responses by category
  const responsesByCategory = cannedResponses.reduce((acc, response) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {} as Record<string, CannedResponse[]>);

  const categoryLabels: Record<string, string> = {
    committee_overview: 'Committee Overview',
    move_in: 'Move-In Information',
    noise_complaint: 'Noise Complaints',
    parking: 'Parking',
    maintenance: 'Maintenance',
    levy_inquiry: 'Levy Inquiries',
    general: 'General',
    bylaws: 'By-Laws',
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bg="white">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack justify="space-between">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="lg" fontWeight="600">
              Send Communication
            </Text>
            <Text fontSize="sm" color="gray.600">
              {task.subject}
            </Text>
          </VStack>
          <IconButton
            aria-label="Close"
            icon={<FiX />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </HStack>
      </Box>

      {/* Composer Type Selector */}
      <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
        <RadioGroup value={composerType} onChange={(value) => setComposerType(value as 'canned' | 'custom')}>
          <HStack spacing={4}>
            <Radio value="canned">
              <HStack spacing={2}>
                <FiFileText />
                <Text fontSize="sm">Use Template</Text>
              </HStack>
            </Radio>
            <Radio value="custom">
              <HStack spacing={2}>
                <FiEdit3 />
                <Text fontSize="sm">Custom Message</Text>
              </HStack>
            </Radio>
          </HStack>
        </RadioGroup>
      </Box>

      {/* Content */}
      <Box flex={1} overflow="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {/* Channel Selection */}
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              Communication Channel
            </FormLabel>
            <Select
              value={channel}
              onChange={(e) => setChannel(e.target.value as CommunicationChannel)}
              size="sm"
              bg="white"
            >
              <option value="email">📧 Email</option>
              <option value="sms">📱 SMS</option>
              <option value="phone">📞 Phone Call Log</option>
              <option value="internal">📝 Internal Note</option>
            </Select>
          </FormControl>

          {/* Recipient Selection */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="600" mb={2}>
              Send To
            </FormLabel>
            <VStack spacing={3} align="stretch">
              {/* Recipient Type Selection */}
              <RadioGroup value={recipientType} onChange={(value) => setRecipientType(value as RecipientType)}>
                <VStack spacing={2} align="stretch">
                  <Radio value="customer">
                    <HStack spacing={2}>
                      <FiUser />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">Customer</Text>
                        {task.customer && (
                          <Text fontSize="xs" color="gray.600">
                            {task.customer.first_name} {task.customer.last_name} - Unit {task.customer.unit_number}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Radio>
                  <Radio value="committee">
                    <HStack spacing={2}>
                      <FiUsers />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">Owners Committee</Text>
                        <Text fontSize="xs" color="gray.600">
                          Send to committee for review and action
                        </Text>
                      </VStack>
                    </HStack>
                  </Radio>
                  <Radio value="custom">
                    <HStack spacing={2}>
                      <FiMail />
                      <Text fontSize="sm">Custom Recipient</Text>
                    </HStack>
                  </Radio>
                </VStack>
              </RadioGroup>

              {/* Custom Recipient Input */}
              {recipientType === 'custom' && (
                <Input
                  value={customRecipient}
                  onChange={(e) => setCustomRecipient(e.target.value)}
                  placeholder={
                    channel === 'email'
                      ? 'recipient@email.com'
                      : channel === 'sms'
                      ? '+61 4XX XXX XXX'
                      : 'Recipient name'
                  }
                  size="sm"
                />
              )}

              {/* Current Recipient Display */}
              <Card bg={cardBg} size="sm">
                <CardBody>
                  <HStack spacing={2}>
                    <Text fontSize="xs" fontWeight="600" color="gray.600">
                      Will send to:
                    </Text>
                    <Text fontSize="xs" fontFamily="mono">
                      {getEffectiveRecipient() || 'No recipient selected'}
                    </Text>
                  </HStack>
                </CardBody>
              </Card>
            </VStack>
          </Box>

          {/* Enhanced Template Selector */}
          {composerType === 'canned' && (
            <Box>
              <FormLabel fontSize="sm" fontWeight="600" mb={3}>
                Select Template
              </FormLabel>
              <VStack spacing={4} align="stretch">
                {/* Category-based Template Selection */}
                <Select
                  value={selectedResponseId}
                  onChange={(e) => setSelectedResponseId(e.target.value)}
                  placeholder="Choose a template..."
                  size="sm"
                  bg="white"
                >
                  {Object.entries(responsesByCategory).map(([category, responses]) => (
                    <optgroup key={category} label={categoryLabels[category] || category}>
                      {responses.map((response) => (
                        <option key={response.id} value={response.id}>
                          {response.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>

                {/* Template Preview Card */}
                {selectedResponseId && (() => {
                  const selectedTemplate = cannedResponses.find(r => r.id === selectedResponseId);
                  return selectedTemplate ? (
                    <Card bg={cardBg} size="sm">
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2}>
                            <Badge colorScheme="blue" size="sm">
                              {categoryLabels[selectedTemplate.category] || selectedTemplate.category}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" fontWeight="600">
                            {selectedTemplate.title}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {selectedTemplate.description}
                          </Text>
                          <Divider />
                          <VStack align="start" spacing={1} w="100%">
                            <Text fontSize="xs" fontWeight="600" color="gray.700">
                              Subject Preview:
                            </Text>
                            <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={2} borderRadius="md" w="100%">
                              {processTemplate(selectedTemplate.subject)}
                            </Text>
                            <Text fontSize="xs" fontWeight="600" color="gray.700" mt={2}>
                              Message Preview: (first 150 characters)
                            </Text>
                            <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={2} borderRadius="md" w="100%">
                              {processTemplate(selectedTemplate.body).substring(0, 150)}...
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : null;
                })()}
              </VStack>
            </Box>
          )}

          {/* Subject */}
          {(channel === 'email' || channel === 'internal') && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">
                Subject
              </FormLabel>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
                size="sm"
                bg="white"
              />
            </FormControl>
          )}

          {/* Message Body */}
          <FormControl flex={1}>
            <HStack justify="space-between" mb={2}>
              <FormLabel fontSize="sm" fontWeight="600" mb={0}>
                {channel === 'phone' ? 'Call Notes' : 'Message'}
              </FormLabel>
              {composerType === 'canned' && selectedResponseId && (
                <Badge size="sm" colorScheme="blue">
                  Template: Variables auto-filled
                </Badge>
              )}
            </HStack>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                channel === 'phone'
                  ? 'Enter call notes and discussion summary...'
                  : 'Type your message here...'
              }
              size="sm"
              minH="300px"
              fontFamily="mono"
              fontSize="sm"
              bg="white"
              resize="vertical"
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="xs" color="gray.600">
                {body.length} characters
              </Text>
              {recipientType === 'committee' && (
                <Badge size="xs" colorScheme="orange">
                  Committee Communication
                </Badge>
              )}
            </HStack>
          </FormControl>

          {/* Template Variables Helper */}
          {composerType === 'canned' && (
            <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderLeftColor="blue.400">
              <Text fontSize="xs" fontWeight="600" color="blue.900" mb={1}>
                Template Variables
              </Text>
              <Text fontSize="xs" color="blue.800">
                Variables like {`{{customer_name}}`}, {`{{task_subject}}`}, and {`{{customer_unit}}`} are
                automatically replaced with actual values. You can edit the message after selecting a template.
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Footer */}
      <Box p={4} borderTop="1px" borderColor="gray.200" bg="gray.50">
        <HStack spacing={2} justify="flex-end">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<FiSend />}
            onClick={handleSend}
            isDisabled={!isValid}
            isLoading={isSending}
          >
            Send {channel === 'phone' ? 'Note' : 'Message'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
