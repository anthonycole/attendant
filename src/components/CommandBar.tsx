'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Kbd,
  Badge,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiInbox,
  FiMessageSquare,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiPlus,
  FiFilter,
  FiCalendar,
  FiTool,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import type { IconType } from 'react-icons';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: IconType;
  action: () => void;
  keywords?: string[];
  badge?: string;
  category: 'navigation' | 'action' | 'filter';
}

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandBar({ isOpen, onClose }: CommandBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-tasks',
      label: 'Go to Tasks',
      description: 'View all tasks and issues',
      icon: FiInbox,
      category: 'navigation',
      keywords: ['tasks', 'issues', 'inbox'],
      action: () => {
        router.push('/tasks');
        onClose();
      },
    },
    {
      id: 'nav-managers',
      label: 'Go to Manager Dashboard',
      description: 'View SLA tracking and metrics',
      icon: FiBarChart2,
      category: 'navigation',
      keywords: ['managers', 'dashboard', 'sla', 'metrics'],
      action: () => {
        router.push('/managers');
        onClose();
      },
    },
    {
      id: 'nav-communications',
      label: 'Go to Communications',
      description: 'View messages and emails',
      icon: FiMessageSquare,
      category: 'navigation',
      keywords: ['communications', 'messages', 'emails'],
      action: () => {
        router.push('/communications');
        onClose();
      },
    },
    {
      id: 'nav-trades',
      label: 'Go to Trades',
      description: 'View contractors directory',
      icon: FiTool,
      category: 'navigation',
      keywords: ['trades', 'contractors', 'vendors'],
      action: () => {
        router.push('/trades');
        onClose();
      },
    },
    {
      id: 'nav-owners',
      label: 'Go to Owners',
      description: 'View residents directory',
      icon: FiUsers,
      category: 'navigation',
      keywords: ['owners', 'residents', 'directory'],
      action: () => {
        router.push('/owners');
        onClose();
      },
    },
    // Actions
    {
      id: 'action-create-task',
      label: 'Create New Task',
      description: 'Create a new issue or task',
      icon: FiPlus,
      category: 'action',
      keywords: ['create', 'new', 'task', 'issue'],
      action: () => {
        router.push('/tasks');
        onClose();
      },
    },
    {
      id: 'filter-urgent',
      label: 'Show Urgent Tasks',
      description: 'Filter tasks by urgent priority',
      icon: FiFilter,
      category: 'filter',
      badge: 'Urgent',
      keywords: ['urgent', 'priority', 'filter'],
      action: () => {
        router.push('/managers?priority=urgent');
        onClose();
      },
    },
    {
      id: 'filter-breached',
      label: 'Show SLA Breached',
      description: 'View tasks that breached SLA',
      icon: FiFilter,
      category: 'filter',
      badge: 'Breached',
      keywords: ['breached', 'sla', 'overdue'],
      action: () => {
        router.push('/managers?tab=breached');
        onClose();
      },
    },
    {
      id: 'filter-today',
      label: 'Show Due Today',
      description: 'Tasks due today',
      icon: FiCalendar,
      category: 'filter',
      keywords: ['today', 'due', 'deadline'],
      action: () => {
        router.push('/tasks?due=today');
        onClose();
      },
    },
  ], [router, onClose]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const query = search.toLowerCase();
    return commands.filter(cmd => {
      const matchLabel = cmd.label.toLowerCase().includes(query);
      const matchDesc = cmd.description?.toLowerCase().includes(query);
      const matchKeywords = cmd.keywords?.some(kw => kw.includes(query));
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [search, commands]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getCategoryLabel = (category: Command['category']) => {
    switch (category) {
      case 'navigation': return 'Navigate';
      case 'action': return 'Actions';
      case 'filter': return 'Filters';
    }
  };

  const groupedCommands = useMemo(() => {
    const groups: Record<Command['category'], Command[]> = {
      navigation: [],
      action: [],
      filter: [],
    };

    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" motionPreset="slideInTop">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent mt="10vh" borderRadius="xl" overflow="hidden" shadow="2xl">
        <ModalBody p={0}>
          <VStack spacing={0} align="stretch">
            {/* Search Input */}
            <HStack px={4} py={3} borderBottom="1px" borderColor="gray.200" bg="white">
              <Icon as={FiSearch} color="gray.400" boxSize={5} />
              <Input
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                variant="unstyled"
                fontSize="md"
                autoFocus
                _placeholder={{ color: 'gray.400' }}
              />
              <Kbd fontSize="sm">esc</Kbd>
            </HStack>

            {/* Commands List */}
            <Box maxH="400px" overflowY="auto" bg="gray.50">
              {filteredCommands.length === 0 ? (
                <Box py={8} textAlign="center">
                  <Text color="gray.500" fontSize="sm">
                    No commands found
                  </Text>
                </Box>
              ) : (
                <VStack spacing={0} align="stretch" py={2}>
                  {(['navigation', 'action', 'filter'] as const).map(category => {
                    const categoryCommands = groupedCommands[category];
                    if (categoryCommands.length === 0) return null;

                    return (
                      <Box key={category}>
                        <Text
                          px={4}
                          py={2}
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.500"
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          {getCategoryLabel(category)}
                        </Text>
                        {categoryCommands.map((cmd, idx) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <HStack
                              key={cmd.id}
                              px={4}
                              py={3}
                              spacing={3}
                              bg={isSelected ? 'blue.50' : 'transparent'}
                              borderLeft="3px solid"
                              borderColor={isSelected ? 'blue.500' : 'transparent'}
                              cursor="pointer"
                              transition="all 0.15s"
                              _hover={{ bg: 'blue.50' }}
                              onClick={() => cmd.action()}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                            >
                              <Icon
                                as={cmd.icon}
                                boxSize={5}
                                color={isSelected ? 'blue.600' : 'gray.600'}
                              />
                              <VStack align="start" spacing={0} flex={1}>
                                <HStack spacing={2}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight={isSelected ? 'semibold' : 'medium'}
                                    color={isSelected ? 'blue.900' : 'gray.900'}
                                  >
                                    {cmd.label}
                                  </Text>
                                  {cmd.badge && (
                                    <Badge
                                      colorScheme="red"
                                      fontSize="xs"
                                      variant="subtle"
                                    >
                                      {cmd.badge}
                                    </Badge>
                                  )}
                                </HStack>
                                {cmd.description && (
                                  <Text fontSize="xs" color="gray.500">
                                    {cmd.description}
                                  </Text>
                                )}
                              </VStack>
                              {isSelected && (
                                <Kbd fontSize="xs" opacity={0.6}>↵</Kbd>
                              )}
                            </HStack>
                          );
                        })}
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>

            {/* Footer */}
            <HStack
              px={4}
              py={2}
              spacing={4}
              fontSize="xs"
              color="gray.500"
              bg="gray.100"
              borderTop="1px"
              borderColor="gray.200"
            >
              <HStack spacing={1}>
                <Kbd>↑↓</Kbd>
                <Text>Navigate</Text>
              </HStack>
              <HStack spacing={1}>
                <Kbd>↵</Kbd>
                <Text>Select</Text>
              </HStack>
              <HStack spacing={1}>
                <Kbd>esc</Kbd>
                <Text>Close</Text>
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
