'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // You might want to add class manipulation for dark mode here
  }

  return { isDarkMode, toggleTheme }
} 