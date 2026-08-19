import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full transition-all duration-300 shadow-lg focus:outline-none"
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(135deg, #fcd34d, #f59e0b)' 
          : 'linear-gradient(135deg, #4f46e5, #7c3aed)'
      }}
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center text-sm ${
          theme === 'light' ? 'left-1' : 'left-7'
        }`}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </div>
    </button>
  );
}
