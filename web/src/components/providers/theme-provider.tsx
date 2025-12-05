"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { DARK_MODE_CLASS, LIGHT_MODE_CLASS, THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      storageKey={THEME_STORAGE_KEY}
      value={{
        light: LIGHT_MODE_CLASS,
        dark: DARK_MODE_CLASS,
      }}
      {...props}
    >
      <ThemeTransition>{children}</ThemeTransition>
    </NextThemesProvider>
  );
}

function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    const body = document.body;
    body.classList.remove(LIGHT_MODE_CLASS, DARK_MODE_CLASS);
    body.classList.add(resolvedTheme === "dark" ? DARK_MODE_CLASS : LIGHT_MODE_CLASS);
  }, [resolvedTheme]);

  return <>{children}</>;
}

