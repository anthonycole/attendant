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
} from '@chakra-ui/react';
import { FiUser, FiCheck, FiX } from 'react-icons/fi';

interface InlineTipTapEditorProps {
  taskId: string;
  onAddUpdate: (content: string) => void;
}

export function InlineTipTapEditor({ taskId, onAddUpdate }: InlineTipTapEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing your update...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[120px] p-3',
        style: 'background: white; border-radius: 6px;',
      },
    },
  });

  const handleSubmit = async () => {
    if (!editor) return;
    
    const content = editor.getText().trim();
    if (!content || content === 'Start typing your update...') return;

    setIsSubmitting(true);
    
    try {
      onAddUpdate(content);
      editor.commands.setContent('<p>Start typing your update...</p>');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!editor) return;
    editor.commands.setContent('<p>Start typing your update...</p>');
  };

  const hasContent = editor && editor.getText().trim().length > 0 && editor.getText().trim() !== 'Start typing your update...';

  // Always render something, even if editor is not ready
  return (
    <Box
      mb={4}
      p={4}
      bg="white"
      border="2px"
      borderColor="blue.200"
      borderRadius="md"
      shadow="lg"
      position="relative"
    >
      <VStack spacing={4} align="stretch">
        <HStack align="flex-start" spacing={3}>
          <Avatar
            size="sm"
            bg="blue.100"
            color="blue.600"
            icon={<FiUser size="16px" />}
          />
          <VStack spacing={2} align="stretch" flex={1}>
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Add a private update
            </Text>
            <Text fontSize="xs" color="gray.500">
              Share an update about this task with your team
            </Text>
          </VStack>
        </HStack>

        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
          minH="120px"
          _focusWithin={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
          }}
        >
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <Box p={3}>
              <Text color="gray.500">Loading TipTap editor...</Text>
            </Box>
          )}
        </Box>

        <HStack justify="flex-end" spacing={3}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<FiX />}
            onClick={handleCancel}
            isDisabled={!hasContent}
          >
            Clear
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<FiCheck />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!hasContent}
          >
            Post Update
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}