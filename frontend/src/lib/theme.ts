export type Theme = "light" | "dark";

export function getStoredTheme(): Theme {
  try {
    return (localStorage.getItem('theme') as Theme) ?? getSystemTheme();
  } catch {
    return getSystemTheme();
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);
};

