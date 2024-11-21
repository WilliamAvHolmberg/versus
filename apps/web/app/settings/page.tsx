import { redirect } from 'next/navigation'
import { getSession } from '../../src/actions/auth'
import { SettingsForm } from '../../src/components/settings/SettingsForm'
import { ThemeEditor } from '../../src/components/settings/ThemeEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/ui/Tabs'
import { prisma } from '../../src/lib/db'

export default async function SettingsPage() {
    const session = await getSession()

    if (!session) {
        redirect('/auth')
    }

    // Get user with theme
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { theme: true }
    })

    if (!user) {
        redirect('/auth')
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <Tabs defaultValue="profile">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="theme">Theme</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <div className="bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                            <SettingsForm user={user} />
                        </div>
                    </TabsContent>

                    <TabsContent value="theme">
                        <div className="bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                            <ThemeEditor theme={user.theme || {}} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
} 