'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pl-12 border border-[#000] rounded-full bg-white text-[#000]"
      />
      <Search 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666]" 
        size={20} 
      />
    </div>
  )
} 