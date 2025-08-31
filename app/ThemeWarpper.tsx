"use client";

import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";

export default function ThemeWarpper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Theme accentColor="cyan">{children}</Theme>
    </ThemeProvider>
  );
}
