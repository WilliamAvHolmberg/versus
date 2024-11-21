'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Clock, TrendingUp, Search } from 'lucide-react'
import { getPublicThemes, rateTheme, searchThemes } from '../../actions/theme'
import type { Theme, User } from '@prisma/client'

interface ThemeGalleryProps {
    onClone: (theme: Theme) => void
}

type ThemeWithUser = Theme & {
    user: Pick<User, 'username' | 'name'>
    _count: {
        ratings: number
    }
}

type SortOption = 'recent' | 'popular'

export function ThemeGallery({ onClone }: ThemeGalleryProps) {
    const [themes, setThemes] = useState<ThemeWithUser[]>([])
    const [error, setError] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Load themes with search
    const loadThemes = async (sort: SortOption = 'recent', query = debouncedQuery) => {
        try {
            const publicThemes = query
                ? await searchThemes(query)
                : await getPublicThemes(sort)
            setThemes(publicThemes)
            setSortBy(sort)
        } catch (err) {
            console.log(err)
            setError('Failed to load themes')
        }
    }

    // Load themes when search query changes
    useEffect(() => {
        loadThemes(sortBy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery])

    const handleRate = async (themeId: string) => {
        try {
            const isLiked = await rateTheme(themeId)
            setThemes(prev => prev.map(theme => {
                if (theme.id === themeId) {
                    return {
                        ...theme,
                        likeCount: theme.likeCount + (isLiked ? 1 : -1),
                        _count: {
                            ...theme._count,
                            ratings: theme._count.ratings + (isLiked ? 1 : -1)
                        }
                    }
                }
                return theme
            }))
        } catch (err) {
            console.log(err)
            setError('Failed to rate theme')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Theme Gallery</h2>
                <div className="flex gap-4">
                    {/* Add search input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search themes..."
                            className="pl-10 pr-4 py-2 rounded-lg border bg-white/50 dark:bg-primary-800/50
                focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                    </div>

                    {/* Existing sort buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => loadThemes('recent')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors
                ${sortBy === 'recent'
                                    ? 'bg-accent-500 text-white'
                                    : 'hover:bg-primary-100 dark:hover:bg-primary-800/50'
                                }`}
                        >
                            <Clock size={16} />
                            Recent
                        </button>
                        <button
                            onClick={() => loadThemes('popular')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors
                ${sortBy === 'popular'
                                    ? 'bg-accent-500 text-white'
                                    : 'hover:bg-primary-100 dark:hover:bg-primary-800/50'
                                }`}
                        >
                            <TrendingUp size={16} />
                            Popular
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
                {themes.map(theme => (
                    <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border hover:border-accent-500 transition-all"
                        style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor,
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium">{theme.name || 'Untitled Theme'}</h3>
                                <p className="text-sm opacity-75">
                                    by {theme.user.name || theme.user.username}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRate(theme.id)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-sm 
                    hover:bg-primary-100 dark:hover:bg-primary-800/50"
                                >
                                    <Heart
                                        size={16}
                                        className={theme._count.ratings > 0 ? 'fill-red-500 text-red-500' : ''}
                                    />
                                    {theme.likeCount}
                                </button>
                                <button
                                    onClick={() => onClone(theme)}
                                    className="px-3 py-1 bg-accent-500 text-white rounded-md text-sm hover:bg-accent-600"
                                >
                                    Clone
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 