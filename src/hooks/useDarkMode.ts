import { useState, useEffect } from "react";

export function useDarkMode(): [boolean, () => void] {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMode = window.localStorage.getItem("darkMode");
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        window.localStorage.setItem("darkMode", JSON.stringify(true));
        
        // Apply dark mode overlay styles
        document.documentElement.style.setProperty('--overlay-color', 'rgba(0, 0, 0, 0.7)');
      } else {
        document.documentElement.classList.remove("dark");
        window.localStorage.setItem("darkMode", JSON.stringify(false));
        
        // Apply light mode overlay styles (maroon)
        document.documentElement.style.setProperty('--overlay-color', 'rgba(123, 17, 18, 0.7)');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode: boolean) => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
}