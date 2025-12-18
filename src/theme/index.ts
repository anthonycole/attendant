'use client';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      50: 'hsl(210, 100%, 95%)',
      100: 'hsl(210, 100%, 92%)',
      200: 'hsl(210, 100%, 80%)',
      300: 'hsl(210, 100%, 65%)',
      400: 'hsl(210, 98%, 48%)',
      500: 'hsl(210, 98%, 42%)',
      600: 'hsl(210, 98%, 55%)',
      700: 'hsl(210, 100%, 35%)',
      800: 'hsl(210, 100%, 16%)',
      900: 'hsl(210, 100%, 21%)',
    },
    gray: {
      50: 'hsl(220, 35%, 97%)',
      100: 'hsl(220, 30%, 94%)',
      200: 'hsl(220, 20%, 88%)',
      300: 'hsl(220, 20%, 80%)',
      400: 'hsl(220, 20%, 65%)',
      500: 'hsl(220, 20%, 42%)',
      600: 'hsl(220, 25%, 35%)',
      700: 'hsl(220, 25%, 25%)',
      800: 'hsl(220, 25%, 10%)',
      900: 'hsl(220, 35%, 3%)',
    },
  },
  shadows: {
    sm: 'hsla(220, 30%, 5%, 0.07) 0px 1px 2px 0px',
    md: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    lg: 'hsla(220, 30%, 5%, 0.07) 0px 10px 24px 0px, hsla(220, 25%, 10%, 0.07) 0px 12px 20px -8px',
    xl: 'hsla(220, 30%, 5%, 0.07) 0px 20px 40px 0px, hsla(220, 25%, 10%, 0.07) 0px 16px 24px -10px',
  },
  radii: {
    sm: '0px',
    md: '0px',
    lg: '0px',
    xl: '0px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 500,
        borderRadius: '0',
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: 'white',
        },
      },
    },
    Tag: {
      baseStyle: {
        borderRadius: '0',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
});

export default theme;
