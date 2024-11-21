import HeroActions from '@/components/frontpage/HeroActions'
import { Stats } from '@/components/frontpage/Stats'
import { MessageSquare, Globe, Share2, Chrome } from 'lucide-react'
import { Roadmap } from '@/components/frontpage/Roadmap'

// Convert to a static page
export const revalidate = 3600 // Revalidate every hour

// Make this a Server Component
export default async function Page() {
  // Move features to server-side to avoid client bundle
  const features = [
    {
      title: "Text to Save",
      description: "Send any link to +46766866754 - we'll organize it for you. No apps needed.",
      icon: MessageSquare,
    },
    {
      title: "Chrome Extension",
      description: "Save with one click while browsing. Available now in beta.",
      icon: Chrome,
    },
    {
      title: "Universal Access",
      description: "Find your saved content instantly from any device, anywhere",
      icon: Globe,
    },
    {
      title: "Knowledge Sharing",
      description: "Create curated collections and share your discoveries with the world",
      icon: Share2,
    }
  ] as const

  return (
    <>
      <div className="relative md:pt-32 lg:h-[83.5vh]">
        {/* Hero Section - Now server rendered */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkest)]">
            Save Anything, Anytime
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[var(--color-dark)]">
            Text any link to <span className="font-mono">+46766866754</span>
          </p>

          {/* Client Interactive Components */}
          <HeroActions />
        </div>

        {/* Features Grid - Now server rendered */}
        <div className="py-8 bg-gradient-to-b from-transparent to-[var(--color-light)]/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-[var(--color-lightest)] shadow-lg hover:shadow-xl 
                  transition-all border border-[var(--color-light)]/20"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-medium)]/10 
                    flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-[var(--color-medium)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--color-darkest)]">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-dark)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Dashboard-style Stats + Roadmap Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start">
            <Stats />
          </div>
          
          {/* Roadmap Column */}
          <div className="lg:col-span-9">
            <Roadmap />
          </div>
        </div>
      </div>
    </>
  )
}