'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, ListTodo, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react'
import { roadmapData, type RoadmapItem } from '../../data/roadmap'

export function Roadmap() {
    const [selectedCategory, setSelectedCategory] = useState<'completed' | 'inProgress' | 'planned'>('inProgress')

    const handleVote = (item: RoadmapItem, isUpvote: boolean) => {
        const feedbackTitle = `${isUpvote ? '👍' : '👎'} Feedback on: ${item.title}`
        const feedbackDescription = `I wanted to ${isUpvote ? 'support' : 'provide feedback about'} the "${item.title}" feature.\n\nMy thoughts:`

        // Dispatch custom event
        const event = new CustomEvent('openFeedback', {
            detail: {
                title: feedbackTitle,
                description: feedbackDescription,
                type: 'OTHER'
            }
        })
        window.dispatchEvent(event)
    }

    const categories = {
        completed: {
            icon: CheckCircle2,
            label: 'Recently Completed',
            items: [...roadmapData.completed].sort((a, b) => parseInt(b.id) - parseInt(a.id))
        },
        inProgress: { icon: Circle, label: 'In Progress', items: roadmapData.inProgress },
        planned: { icon: ListTodo, label: 'Planned', items: roadmapData.planned }
    }

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-lightest)] rounded-2xl shadow-lg p-6"
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkest)] mb-2">
                        Product Roadmap
                    </h2>
                    <p className="text-[var(--color-dark)]">Help shape the future of Pagepin by providing feedback</p>
                </div>

                {/* Category Tabs - Styled as pills */}
                <div className="flex gap-2 mb-8 p-1 bg-[var(--color-light)]/10 rounded-full w-fit">
                    {(Object.entries(categories) as Array<[keyof typeof categories, typeof categories[keyof typeof categories]]>).map(([key, { icon: Icon, label }]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                ${selectedCategory === key
                                    ? 'bg-[var(--color-medium)] text-[var(--color-lightest)] shadow-md'
                                    : 'text-[var(--color-dark)] hover:bg-[var(--color-light)]/20'}`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Items Grid - adjusted spacing */}
                <div className="space-y-4 mt-6">
                    {categories[selectedCategory].items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[var(--color-lightest)] p-6 rounded-xl shadow-md hover:shadow-lg 
                transition-all duration-300 border border-[var(--color-light)]/20"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--color-darkest)] group-hover:text-[var(--color-dark)] 
                    transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-[var(--color-dark)] mt-2 mb-4">{item.description}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleVote(item, true)}
                                        className="p-2 hover:bg-[var(--color-light)]/20 rounded-full transition-colors"
                                        aria-label="Vote up"
                                    >
                                        <ThumbsUp size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleVote(item, false)}
                                        className="p-2 hover:bg-[var(--color-light)]/20 rounded-full transition-colors"
                                        aria-label="Vote down"
                                    >
                                        <ThumbsDown size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-light)]/20">
                                <span className="text-sm text-[var(--color-medium)] flex items-center gap-2">
                                    <ArrowRight size={14} />
                                    {new Date(item.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
} 