'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

interface Props extends ThemeProviderProps {
  children: React.ReactNode; // Definindo o tipo de children
}

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}