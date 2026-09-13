import { UserContextProvider } from "@/context/UserContextProvider";
import { ThemeProvider } from "@/context/ThemeContextProvider";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { useEffect } from "react";


export const AllTheProviders = ({children}: { children: React.ReactNode }) => {
    
  useEffect(() => {
        applyTheme(getStoredTheme());
    }, []);

    return (
    <ThemeProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </ThemeProvider>
  )
}