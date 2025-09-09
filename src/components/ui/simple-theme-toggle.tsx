import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const SimpleThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
    console.log('Theme toggled to:', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-all duration-200 hover:scale-105 ml-2"
      aria-label={`切换到${isDark ? '浅色' : '深色'}模式`}
      title={`切换到${isDark ? '浅色' : '深色'}模式`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
};

export default SimpleThemeToggle;