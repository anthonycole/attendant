'use client';

import React, { useState } from 'react';
import {
  Tag,
  HStack,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

interface InlineSelectTagProps {
  value: string;
  options: { value: string; label: string; icon?: React.ElementType; colorScheme?: string }[];
  onChange: (value: string) => void;
  colorScheme?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineSelectTag({
  value,
  options,
  onChange,
  colorScheme = 'gray',
  icon,
  disabled = false,
  size = 'sm'
}: InlineSelectTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const displayColorScheme = selectedOption?.colorScheme || colorScheme;
  const DisplayIcon = selectedOption?.icon || icon;

  if (disabled) {
    return (
      <Tag size={size} colorScheme={displayColorScheme} textTransform="capitalize">
        <HStack spacing={1}>
          {DisplayIcon && <Icon as={DisplayIcon} boxSize={3} />}
          <Text>{selectedOption?.label || value}</Text>
        </HStack>
      </Tag>
    );
  }

  return (
    <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}>
      <MenuButton
        as={Tag}
        size={size}
        colorScheme={displayColorScheme}
        textTransform="capitalize"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        _active={{ opacity: 0.9 }}
        transition="opacity 0.2s"
      >
        <HStack spacing={1}>
          {DisplayIcon && <Icon as={DisplayIcon} boxSize={3} />}
          <Text>{selectedOption?.label || value}</Text>
          <Icon as={FiChevronDown} boxSize={2.5} />
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList zIndex={9999} minW="unset">
          {options.map((option) => {
            const OptionIcon = option.icon;
            return (
              <MenuItem
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                bg={value === option.value ? 'blue.50' : undefined}
                _hover={{ bg: value === option.value ? 'blue.100' : 'gray.100' }}
              >
                <HStack spacing={2}>
                  {OptionIcon && (
                    <Icon 
                      as={OptionIcon} 
                      boxSize={3} 
                      color={option.colorScheme ? `${option.colorScheme}.500` : 'gray.500'} 
                    />
                  )}
                  <Text fontSize="sm">{option.label}</Text>
                </HStack>
              </MenuItem>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );
}