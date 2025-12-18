import type { Metadata } from "next";
import { ChakraProvider } from '@chakra-ui/react';
import { QueryProvider } from '@/providers/QueryProvider';
import { StrataSchemeProvider } from '@/contexts/StrataSchemeContext';
import { CommandBarProvider } from '@/providers/CommandBarProvider';
import theme from '@/theme';
import "./globals.css";

export const metadata: Metadata = {
  title: "Attendant - Property Management Platform",
  description: "Modern property management and resident services platform for strata schemes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          <ChakraProvider theme={theme}>
            <StrataSchemeProvider>
              <CommandBarProvider>
                {children}
              </CommandBarProvider>
            </StrataSchemeProvider>
          </ChakraProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
