'use client';

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import {
  FiShield,
  FiZap,
  FiCheckCircle,
  FiLink,
} from 'react-icons/fi';

interface FeatureCategory {
  title: string;
  description: string;
  icon: any;
  color: string;
  highlights: string[];
}

export function FeaturesOverview() {
  const categories: FeatureCategory[] = [
    {
      title: 'Build Trust',
      description: 'Keep owners informed and confident with transparency at every step',
      icon: FiShield,
      color: 'blue.500',
      highlights: [
        'Complete communication histories',
        'Proactive status updates',
        'Never miss SLA deadlines',
        'Personalized owner profiles',
      ],
    },
    {
      title: 'Save Time',
      description: 'Work smarter with streamlined workflows and intelligent automation',
      icon: FiZap,
      color: 'green.500',
      highlights: [
        'Unified inbox for all communications',
        'Instant access to property context',
        '24/7 AI chatbot support',
        'Quick contractor directory',
      ],
    },
    {
      title: 'Deliver Consistency',
      description: 'Ensure excellence in every interaction with standardized processes',
      icon: FiCheckCircle,
      color: 'purple.500',
      highlights: [
        'Professional communication templates',
        'Standardized task workflows',
        'Team performance tracking',
        'Complete audit trail',
      ],
    },
    {
      title: 'Integrations',
      description: 'Connect seamlessly with Microsoft Outlook, Teams, WhatsApp, and calendars',
      icon: FiLink,
      color: 'orange.500',
      highlights: [
        'Native Outlook email integration',
        'Microsoft Teams notifications',
        'WhatsApp Business messaging',
        'Multi-calendar sync',
      ],
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center" maxW="4xl" mx="auto">
          <Heading size="2xl" mb={4} lineHeight="shorter">
            Cheaper, more efficient management
          </Heading>
          <Text color="gray.600" fontSize="xl" lineHeight="tall">
            Save time, build trust, and deliver consistent service
          </Text>
        </Box>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} pt={4}>
          {categories.map((category, idx) => (
            <Box
              key={idx}
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              transition="all 0.2s"
              _hover={{
                borderColor: category.color,
                shadow: 'md',
                transform: 'translateY(-4px)',
              }}
            >
              <VStack align="start" spacing={4} h="full">
                <Icon as={category.icon} boxSize={10} color={category.color} />

                <Box>
                  <Heading size="md" mb={2}>
                    {category.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">
                    {category.description}
                  </Text>
                </Box>

                <VStack align="start" spacing={2} flex="1" w="full">
                  {category.highlights.map((highlight, hIdx) => (
                    <Text
                      key={hIdx}
                      fontSize="sm"
                      color="gray.700"
                      _before={{
                        content: '"•"',
                        marginRight: '8px',
                        color: category.color,
                        fontWeight: 'bold',
                      }}
                    >
                      {highlight}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Value Proposition */}
        <Box
          textAlign="center"
          mt={12}
          p={8}
          bg="gray.50"
          borderRadius="lg"
          maxW="3xl"
          mx="auto"
        >
          <Heading size="lg" mb={3}>
            Everything you need in one platform
          </Heading>
          <Text color="gray.600" fontSize="md" lineHeight="tall">
            Stop juggling multiple tools. Attendant brings together communication, task management,
            directories, and integrations into one seamless experience designed specifically for strata managers.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
