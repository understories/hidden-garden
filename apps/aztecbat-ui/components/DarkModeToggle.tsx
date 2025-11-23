'use client';

import * as React from 'react';

/**
 * Dark Mode Toggle Component
 * 
 * White-Hat Octalysis: Explicit, user-controlled theme toggle.
 * No hidden mechanics, no gamification - just user comfort and autonomy.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Only run on client after mount to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved preference, or system preference, or default to light
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Update DOM
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className="px-3 py-1.5 text-sm border rounded"
        aria-label="Theme toggle"
        disabled
      >
        ...
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

