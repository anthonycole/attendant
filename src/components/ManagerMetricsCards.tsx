'use client';

import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Icon, Flex } from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiAlertCircle, FiTrendingUp, FiActivity } from 'react-icons/fi';
import type { ManagerMetrics } from '@/lib/slaUtils';

interface ManagerMetricsCardsProps {
  metrics: ManagerMetrics;
}

export function ManagerMetricsCards({ metrics }: ManagerMetricsCardsProps) {
  const cards = [
    {
      label: 'Total Tasks',
      value: metrics.totalTasks,
      helpText: `${metrics.openTasks} open, ${metrics.inProgressTasks} in progress`,
      icon: FiActivity,
      colorScheme: 'blue'
    },
    {
      label: 'SLA Compliant',
      value: metrics.slaCompliant,
      helpText: `${metrics.totalTasks > 0 ? Math.round((metrics.slaCompliant / metrics.totalTasks) * 100) : 0}% of all tasks`,
      icon: FiCheckCircle,
      colorScheme: 'green'
    },
    {
      label: 'SLA At Risk',
      value: metrics.slaAtRisk,
      helpText: 'Need immediate attention',
      icon: FiAlertTriangle,
      colorScheme: 'orange'
    },
    {
      label: 'SLA Breached',
      value: metrics.slaBreached,
      helpText: 'Requires escalation',
      icon: FiAlertCircle,
      colorScheme: 'red'
    },
    {
      label: 'Avg Response Time',
      value: metrics.avgResponseTime > 0 ? `${metrics.avgResponseTime.toFixed(1)}h` : 'N/A',
      helpText: 'Time to first response',
      icon: FiClock,
      colorScheme: 'purple'
    },
    {
      label: 'Avg Resolution Time',
      value: metrics.avgResolutionTime > 0 ? `${(metrics.avgResolutionTime / 24).toFixed(1)}d` : 'N/A',
      helpText: 'Time to resolve issues',
      icon: FiTrendingUp,
      colorScheme: 'cyan'
    }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 6 }} spacing={4}>
      {cards.map((card, index) => (
        <Box
          key={index}
          p={5}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          transition="all 0.2s"
          _hover={{ shadow: 'md', borderColor: `${card.colorScheme}.300` }}
        >
          <Stat>
            <Flex justify="space-between" align="flex-start" mb={2}>
              <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
                {card.label}
              </StatLabel>
              <Icon
                as={card.icon}
                boxSize={5}
                color={`${card.colorScheme}.500`}
              />
            </Flex>
            <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">
              {card.value}
            </StatNumber>
            <StatHelpText fontSize="xs" color="gray.500" mb={0}>
              {card.helpText}
            </StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
}
