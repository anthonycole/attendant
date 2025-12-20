'use client';

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import {
  FiShield,
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiEye,
  FiHeart,
  FiZap,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiMail,
  FiBarChart2,
  FiSmartphone,
  FiCpu,
  FiLink,
} from 'react-icons/fi';

interface Feature {
  title: string;
  description: string;
  icon: any;
}

interface FeatureCategory {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  features: Feature[];
}

export function FeaturesOverview() {
  const categories: FeatureCategory[] = [
    {
      title: 'Build Trust',
      subtitle: 'Keep owners informed and confident',
      icon: FiShield,
      color: 'blue.500',
      features: [
        {
          title: 'Complete Transparency',
          description: 'Owners see detailed histories and status updates for every request',
          icon: FiEye,
        },
        {
          title: 'Proactive Updates',
          description: 'Send status updates before owners need to ask',
          icon: FiMessageSquare,
        },
        {
          title: 'Never Miss Deadlines',
          description: 'Automatic SLA tracking ensures timely responses every time',
          icon: FiClock,
        },
        {
          title: 'Personal Touch',
          description: 'Maintain detailed owner profiles for personalized service',
          icon: FiHeart,
        },
      ],
    },
    {
      title: 'Save Time',
      subtitle: 'Work smarter with streamlined workflows',
      icon: FiZap,
      color: 'green.500',
      features: [
        {
          title: 'All Communications in One Place',
          description: 'Handle emails, calls, SMS, and web inquiries from a single interface',
          icon: FiMessageSquare,
        },
        {
          title: 'Instant Context',
          description: 'Access complete timelines and property details immediately',
          icon: FiCalendar,
        },
        {
          title: 'AI-Powered Chatbot',
          description: 'Automated responses to common owner queries available 24/7',
          icon: FiCpu,
        },
        {
          title: 'Quick Access to Contractors',
          description: 'Find trusted trades and owners instantly from organized directories',
          icon: FiUsers,
        },
      ],
    },
    {
      title: 'Deliver Consistency',
      subtitle: 'Ensure excellence in every interaction',
      icon: FiCheckCircle,
      color: 'purple.500',
      features: [
        {
          title: 'Professional Templates',
          description: 'Use templates to ensure clear, on-brand communication every time',
          icon: FiFileText,
        },
        {
          title: 'Standardized Processes',
          description: 'Task templates guarantee nothing is forgotten',
          icon: FiCheckCircle,
        },
        {
          title: 'Team Performance Tracking',
          description: 'Monitor response times and workload across your team',
          icon: FiBarChart2,
        },
        {
          title: 'Complete Audit Trail',
          description: 'Track every action and communication for accountability',
          icon: FiCalendar,
        },
      ],
    },
    {
      title: 'Integrations',
      subtitle: 'Connect with the tools you already use',
      icon: FiLink,
      color: 'orange.500',
      features: [
        {
          title: 'Microsoft Outlook',
          description: 'Send and receive emails, sync calendars, and use actionable messages directly from Outlook',
          icon: FiMail,
        },
        {
          title: 'Microsoft Teams',
          description: 'Get real-time notifications and collaborate on tasks without switching platforms',
          icon: FiMessageSquare,
        },
        {
          title: 'WhatsApp Business',
          description: 'Communicate with owners via WhatsApp with automatic logging and task creation',
          icon: FiSmartphone,
        },
        {
          title: 'Calendar Sync',
          description: 'Sync deadlines and meetings with Outlook, Google Calendar, and Apple Calendar',
          icon: FiCalendar,
        },
      ],
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={12} align="stretch">
        {/* Header */}
        <Box textAlign="center" maxW="3xl" mx="auto">
          <Heading size="xl" mb={3}>
            Deliver more effective strata management faster
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Streamline workflows, strengthen owner relationships, and save hours every week
          </Text>
        </Box>

        {/* Feature Categories */}
        {categories.map((category, idx) => (
          <Box key={idx}>
            <HStack spacing={3} mb={6}>
              <Icon as={category.icon} boxSize={8} color={category.color} />
              <Box>
                <Heading size="lg">{category.title}</Heading>
                <Text color="gray.600" fontSize="md">
                  {category.subtitle}
                </Text>
              </Box>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} pl={{ base: 0, md: 11 }}>
              {category.features.map((feature, featureIdx) => (
                <HStack key={featureIdx} spacing={4} align="start">
                  <Icon as={feature.icon} boxSize={5} color={category.color} mt={1} flexShrink={0} />
                  <Box>
                    <Text fontWeight="semibold" fontSize="md" mb={1}>
                      {feature.title}
                    </Text>
                    <Text color="gray.600" fontSize="sm" lineHeight="tall">
                      {feature.description}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </SimpleGrid>

            {idx < categories.length - 1 && <Divider mt={12} />}
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
