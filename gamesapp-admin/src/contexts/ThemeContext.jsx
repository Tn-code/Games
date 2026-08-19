import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    primary: 'from-purple-600 to-blue-600',
    secondary: 'from-purple-500 to-pink-500',
    background: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-white/50',
    text: 'text-gray-800',
    textSecondary: 'text-gray-500',
    input: 'bg-white',
    shadow: 'shadow-xl',
    navbar: 'bg-white/80 backdrop-blur-lg',
    sidebar: 'bg-white',
    badge: {
      premium: 'from-yellow-400 to-yellow-500',
      free: 'from-green-400 to-green-500',
      locked: 'from-red-500 to-red-600',
      unlocked: 'from-green-500 to-emerald-500',
    }
  },
  dark: {
    primary: 'from-purple-700 to-blue-700',
    secondary: 'from-purple-600 to-pink-600',
    background: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800',
    card: 'bg-gray-800/90 backdrop-blur-sm',
    cardBorder: 'border-gray-700/50',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    input: 'bg-gray-700',
    shadow: 'shadow-2xl shadow-purple-900/20',
    navbar: 'bg-gray-800/80 backdrop-blur-lg',
    sidebar: 'bg-gray-900',
    badge: {
      premium: 'from-yellow-500 to-yellow-600',
      free: 'from-green-500 to-green-600',
      locked: 'from-red-600 to-red-700',
      unlocked: 'from-green-600 to-emerald-600',
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
