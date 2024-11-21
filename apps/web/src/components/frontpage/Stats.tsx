'use client'

import { useEffect, useState, useRef } from 'react'
import { getStats } from '@/actions/stats'
import { motion, useInView } from 'framer-motion'
import { Users, Bookmark, Clock } from 'lucide-react'

export function Stats() {
    const [stats, setStats] = useState<{
        users: number
        totalBookmarks: number
        last24hBookmarks: number
    } | null>(null)

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStats()
            setStats(data)
        }

        fetchStats()
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    if (!stats) return <div ref={ref} className="h-20" />

    const statItems = [
        {
            icon: Users,
            value: stats.users,
            label: "Registered Users",
            delay: 0
        },
        {
            icon: Clock,
            value: stats.last24hBookmarks,
            label: "Saved Today",
            delay: 0.1
        },
        {
            icon: Bookmark,
            value: stats.totalBookmarks,
            label: "Total Bookmarks",
            delay: 0.2
        }
    ]

    return (
        <div ref={ref} className="relative">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="bg-[var(--color-lightest)] rounded-2xl shadow-lg p-6 space-y-6"
            >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent 
                    bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkest)]">
                    Platform Stats
                </h2>
                
                <div className="space-y-4">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: item.delay, duration: 0.5 }}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--color-light)]/5 
                                transition-colors duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-medium)] 
                                to-[var(--color-dark)] flex items-center justify-center shadow-md 
                                transform -rotate-3 hover:rotate-0 transition-transform"
                            >
                                <item.icon className="text-[var(--color-lightest)]" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold bg-clip-text text-transparent 
                                    bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkest)]">
                                    {item.value}
                                </div>
                                <div className="text-[var(--color-dark)] text-sm font-medium">
                                    {item.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
} 