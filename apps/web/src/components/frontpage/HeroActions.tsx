'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HeroActions() {
    return (
        <>
            <Link href="/auth">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="fixed top-6 right-0 z-50 transform -rotate-2 hover:scale-105 
                        transition-transform cursor-pointer group"
                >
                    <div className="bg-amber-500 text-[var(--color-lightest)] px-8 py-1.5 
                        text-sm font-medium shadow-lg group-hover:shadow-xl transition-all"
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)'
                        }}
                    >
                        Early Access: Free Forever for First 100 Users
                    </div>
                </motion.div>
            </Link>

            <div className="flex flex-col items-center gap-4">
                <Link
                    href={'/auth'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-medium)] text-[var(--color-lightest)] 
                        rounded-full text-lg font-medium hover:bg-[var(--color-dark)] transform hover:scale-105 transition-all 
                        shadow-lg hover:shadow-xl"
                >
                    Start Saving with SMS
                    <ArrowRight size={20} />
                </Link>
                <span className="text-sm text-[var(--color-dark)] opacity-80">
                    No apps needed - just text links to save them
                </span>
            </div>
        </>
    )
}
