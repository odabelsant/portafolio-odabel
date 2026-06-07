import React, { createContext, useContext, useEffect, useState } from "react";

import themeConfig from "../data/theme_config.json";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "dark"; // Default: premium dark theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const activeColors = theme === "dark" ? themeConfig.dark : themeConfig.light;

    if (theme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    if (activeColors) {
      if (theme === "dark") {
        root.style.setProperty("--color-background-dark", activeColors.bgPrimary);
        root.style.setProperty("--color-card-dark", activeColors.bgSurface);
        root.style.setProperty("--color-text-main", activeColors.textPrimary);
        root.style.setProperty("--color-primary", activeColors.accentColor);
        root.style.setProperty("--color-accent", activeColors.accentColor);
      } else {
        root.style.setProperty("--color-background-light", activeColors.bgPrimary);
        root.style.setProperty("--color-card-light", activeColors.bgSurface);
        root.style.setProperty("--color-text-light", activeColors.textPrimary);
        root.style.setProperty("--color-primary", activeColors.accentColor);
        root.style.setProperty("--color-accent", activeColors.accentColor);
      }
      root.style.backgroundColor = activeColors.bgPrimary;
    } else {
      root.style.backgroundColor = theme === "dark" ? "#050816" : "#ffffff";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
