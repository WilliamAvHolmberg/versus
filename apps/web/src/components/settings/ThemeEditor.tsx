'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Type, Image, Sparkles, Code, Wand2 } from 'lucide-react'
import { updateTheme, shareTheme } from '../../actions/theme'
import { themePresets } from '../../lib/theme-presets'
import type { Theme } from '@prisma/client'
import { ThemeGallery } from './ThemeGallery'

interface ThemeEditorProps {
    theme: Partial<Theme>
}

type Tab = 'colors' | 'typography' | 'background' | 'effects' | 'advanced' | 'presets' | 'gallery'

export function ThemeEditor({ theme: initialTheme }: ThemeEditorProps) {
    const [activeTab, setActiveTab] = useState<Tab>('presets')
    const [showPreview, setShowPreview] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [theme, setTheme] = useState<Partial<Theme>>(initialTheme)

    const tabs = [
        { id: 'presets' as const, icon: Wand2, label: 'Presets' },
        { id: 'gallery' as const, icon: Image, label: 'Gallery' },
        { id: 'colors' as const, icon: Palette, label: 'Colors' },
        { id: 'typography' as const, icon: Type, label: 'Typography' },
        { id: 'background' as const, icon: Image, label: 'Background' },
        { id: 'effects' as const, icon: Sparkles, label: 'Effects' },
        { id: 'advanced' as const, icon: Code, label: 'Advanced' },
    ]

    const handleChange = async (updates: Partial<Theme>) => {
        const newTheme = { ...theme, ...updates }
        setTheme(newTheme)

        try {
            setIsLoading(true)
            setError(null)
            await updateTheme(newTheme)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update theme')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePresetSelect = (preset: keyof typeof themePresets) => {
        handleChange(themePresets[preset])
    }

    const handleShare = async () => {
        try {
            setIsLoading(true)
            setError(null)
            await shareTheme(theme.id!, !theme.isPublic)
            setTheme(prevTheme => ({ ...prevTheme, isPublic: !prevTheme.isPublic }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update sharing settings')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Theme Preview Button */}
            <div className="flex justify-between items-center">
                {isLoading && <span className="text-sm text-primary-500">Saving...</span>}
                {error && <span className="text-sm text-red-500">{error}</span>}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreview(false)} />
                        <motion.div
                            className="relative bg-white dark:bg-primary-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
                            style={{
                                backgroundColor: theme.backgroundColor,
                                color: theme.textColor,
                                borderRadius: theme.borderRadius === 'sharp' ? '0' :
                                    theme.borderRadius === 'pill' ? '9999px' : '0.75rem',
                                boxShadow: theme.shadows ? undefined : 'none',
                                backdropFilter: theme.glassmorphism ? 'blur(10px)' : undefined,
                                backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
                            }}
                        >
                            {/* Preview content */}
                            <div className="p-6">
                                <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.fontFamily }}>
                                    Preview Your Theme
                                </h1>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg" style={{
                                        backgroundColor: theme.primaryColor,
                                        color: '#fff',
                                    }}>
                                        Primary Color Block
                                    </div>
                                    <div className="p-4 rounded-lg" style={{
                                        backgroundColor: theme.accentColor,
                                        color: '#fff',
                                    }}>
                                        Accent Color Block
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editor Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto">
                {tabs.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap
              ${activeTab === id
                                ? 'bg-primary-100 dark:bg-primary-800 border-b-2 border-accent-500'
                                : 'hover:bg-primary-50 dark:hover:bg-primary-800/50'
                            }`}
                    >
                        <Icon size={20} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Editor Content */}
            <div className="p-4">
                {activeTab === 'presets' && (
                    <div className="grid grid-cols-2 gap-4">
                        {(Object.keys(themePresets) as Array<keyof typeof themePresets>).map((preset) => (
                            <button
                                key={preset}
                                onClick={() => handlePresetSelect(preset)}
                                className="p-4 rounded-lg border hover:border-accent-500 transition-all"
                                style={{
                                    backgroundColor: themePresets[preset].backgroundColor,
                                    color: themePresets[preset].textColor,
                                }}
                            >
                                <h3 className="text-lg font-medium mb-2 capitalize">{preset}</h3>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: themePresets[preset].primaryColor }} />
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: themePresets[preset].accentColor }} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <ThemeGallery
                        onClone={(clonedTheme) => {
                            setTheme(clonedTheme)
                            handleChange(clonedTheme)
                        }}
                    />
                )}

                {activeTab === 'colors' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Primary Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={e => handleChange({ primaryColor: e.target.value })}
                                    className="w-10 h-10 rounded"
                                />
                                <input
                                    type="text"
                                    value={theme.primaryColor}
                                    onChange={e => handleChange({ primaryColor: e.target.value })}
                                    className="flex-1 p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Accent Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={theme.accentColor}
                                    onChange={e => handleChange({ accentColor: e.target.value })}
                                    className="w-10 h-10 rounded"
                                />
                                <input
                                    type="text"
                                    value={theme.accentColor}
                                    onChange={e => handleChange({ accentColor: e.target.value })}
                                    className="flex-1 p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                                />
                            </div>
                        </div>

                        {/* Add more color inputs */}
                    </div>
                )}

                {/* Add more tab contents */}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Theme Name</label>
                <input
                    type="text"
                    value={theme.name || ''}
                    onChange={e => {
                        setTheme(prevTheme => ({ ...prevTheme, name: e.target.value }))
                        handleChange({ name: e.target.value })
                    }}
                    placeholder="My Awesome Theme"
                    className="w-full p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isPublic"
                    checked={theme.isPublic}
                    onChange={() => handleShare()}
                    className="rounded border-primary-300"
                />
                <label htmlFor="isPublic" className="text-sm">
                    Share this theme publicly
                </label>
            </div>
        </div>
    )
} 