'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  Select,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiCheck, 
  FiX, 
  FiBold, 
  FiItalic, 
  FiList, 
  FiType,
  FiMinus
} from 'react-icons/fi';
import type { TaskStatus } from '@/types/schema';
import { getStatusIcon, getStatusColorScheme } from '@/lib/taskIcons';

interface SimpleTipTapEditorProps {
  taskId: string;
  currentStatus: TaskStatus;
  onAddUpdate: (content: string, statusChange?: TaskStatus) => void;
}

export function SimpleTipTapEditor({ taskId, currentStatus, onAddUpdate }: SimpleTipTapEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(currentStatus);

  // Status options with labels using shared color scheme
  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_on_customer', label: 'Waiting on Customer' },
    { value: 'waiting_on_committee', label: 'Waiting on Committee' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[80px] p-3 bg-white rounded',
        'data-placeholder': 'Start typing your update...',
      },
    },
  });

  const handleSubmit = async () => {
    if (!editor) return;
    
    const content = editor.getText().trim();
    if (!content || content === 'Start typing your update...') return;

    setIsSubmitting(true);
    
    try {
      // Pass status change only if it's different from current status
      const statusChange = selectedStatus && selectedStatus !== currentStatus ? selectedStatus : undefined;
      onAddUpdate(content, statusChange);
      
      editor.commands.setContent('<p>Start typing your update...</p>');
      setSelectedStatus(currentStatus); // Reset to current status
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!editor) return;
    editor.commands.setContent('<p>Start typing your update...</p>');
    setSelectedStatus(currentStatus); // Reset to current status
  };

  // Check if editor has meaningful content
  const hasContent = editor && 
    editor.getText().trim().length > 0 && 
    editor.getText().trim() !== 'Start typing your update...';

  // Check if status has changed
  const hasStatusChange = selectedStatus && selectedStatus !== currentStatus;
  
  // Get current status label for display
  const currentStatusLabel = statusOptions.find(opt => opt.value === currentStatus)?.label || currentStatus;

  return (
    <Box
      p={3}
      bg="white"
    >
      <VStack spacing={2} align="stretch">
        <Text fontSize="xs" color="gray.600" mb={2}>
          Share an update about this task with your team
        </Text>

        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
          minH="80px"
          _focusWithin={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
          }}
        >
          {editor ? (
            <VStack spacing={0} align="stretch">
              {/* Toolbar */}
              <Box p={2} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                <HStack spacing={1}>
                  <IconButton
                    aria-label="Bold"
                    icon={<FiBold />}
                    size="xs"
                    variant={editor.isActive('bold') ? 'solid' : 'ghost'}
                    colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  />
                  <IconButton
                    aria-label="Italic"
                    icon={<FiItalic />}
                    size="xs"
                    variant={editor.isActive('italic') ? 'solid' : 'ghost'}
                    colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  />
                  <Divider orientation="vertical" height="4" />
                  <IconButton
                    aria-label="Bullet List"
                    icon={<FiList />}
                    size="xs"
                    variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
                    colorScheme={editor.isActive('bulletList') ? 'blue' : 'gray'}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                  />
                  <IconButton
                    aria-label="Numbered List"
                    icon={<FiType />}
                    size="xs"
                    variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
                    colorScheme={editor.isActive('orderedList') ? 'blue' : 'gray'}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  />
                </HStack>
              </Box>
              {/* Editor Content */}
              <Box minH="80px">
                <EditorContent editor={editor} />
              </Box>
            </VStack>
          ) : (
            <Box p={4}>
              <Text color="gray.500">Loading TipTap editor...</Text>
            </Box>
          )}
        </Box>

        {/* Status Section - above action buttons */}
        <HStack justify="space-between" align="end">
          <FormControl maxW="200px">
            <FormLabel fontSize="xs" color="gray.600" mb={1}>
              Task Status
            </FormLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
              size="xs"
              bg="white"
            >
              {statusOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label} {option.value === currentStatus ? '(current)' : ''}
                </option>
              ))}
            </Select>
            {hasStatusChange && (
              <Text fontSize="xs" color="blue.600" mt={1}>
                Status will change from {currentStatusLabel} to {statusOptions.find(opt => opt.value === selectedStatus)?.label}
              </Text>
            )}
          </FormControl>
          
          <IconButton
            aria-label="Clear editor"
            icon={<FiX />}
            size="xs"
            variant="ghost"
            onClick={handleCancel}
            isDisabled={!hasContent && !hasStatusChange}
          />
        </HStack>

        <HStack justify="flex-end" spacing={2}>
          <Button
            size="xs"
            colorScheme={hasStatusChange ? 'green' : 'blue'}
            leftIcon={<FiCheck />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!hasContent && !hasStatusChange}
          >
            {hasStatusChange ? 'Post & Change Status' : 'Post Update'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}