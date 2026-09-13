import {  useState, useCallback } from "react";
import { applyTheme, getStoredTheme } from "@/lib/themeUtils";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState<boolean>(() => getStoredTheme() === "dark");

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      applyTheme(next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <ThemeContext value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext>
  );
};

