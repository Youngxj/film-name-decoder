import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className, 
  variant = 'outline', 
  size = 'icon',
  showText = false 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleClick = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-all duration-200 hover:scale-105',
        showText && 'gap-2',
        className
      )}
      aria-label={`切换到${isDark ? '浅色' : '深色'}模式`}
      title={`切换到${isDark ? '浅色' : '深色'}模式`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isDark ? '浅色' : '深色'}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;