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

interface TipTapUpdateEditorProps {
  taskId: string;
  onAddUpdate: (content: string) => void;
}

export function TipTapUpdateEditor({ taskId, onAddUpdate }: TipTapUpdateEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[80px] p-3',
      },
    },
  });

  const handleSubmit = async () => {
    if (!editor) return;
    
    const content = editor.getText().trim();
    if (!content) return;

    setIsSubmitting(true);
    
    try {
      onAddUpdate(content);
      editor.commands.clearContent();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!editor) return;
    editor.commands.clearContent();
  };

  if (!editor) {
    return null;
  }

  const hasContent = editor.getText().trim().length > 0;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      backdropFilter="blur(4px)"
    >
      <Box
        bg="white"
        borderRadius="lg"
        shadow="2xl"
        p={6}
        maxW="600px"
        w="100%"
        maxH="80vh"
        overflow="auto"
        border="2px"
        borderColor="blue.200"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.5)"
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
            <EditorContent editor={editor} />
          </Box>

          <HStack justify="flex-end" spacing={3}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FiX />}
              onClick={handleCancel}
            >
              Cancel
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
    </Box>
  );
}