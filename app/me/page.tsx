import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ConversationCard from '@/components/ConversationCard'
import SignOutButton from '@/components/SignOutButton'
import { Database } from '@/lib/database.types'
import { User, Settings, BookOpen } from 'lucide-react'

type Profile = Database['public']['Tables']['users']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row']
type Guide = Database['public']['Tables']['communication_guides']['Row']

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h1 className="text-4xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-6">Profile</h1>
                <p className="text-[var(--color-text-muted)] mb-8 font-light">Please log in to view your profile.</p>
                <Link
                    href="/login"
                    className="px-8 py-3 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-medium hover:bg-[var(--color-primary)] transition-colors uppercase tracking-widest text-xs"
                >
                    Log In
                </Link>
            </div>
        )
    }

    // Fetch user profile data
    const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    const profile = profileData as Profile | null

    // Fetch user's conversations
    const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .eq('author_id', user.id)
        .order('started_at', { ascending: false })

    const conversations = conversationsData as Conversation[] | null

    // Fetch communication guides
    const { data: guidesData } = await supabase
        .from('communication_guides')
        .select('*')

    const guides = guidesData as Guide[] | null

    return (
        <div className="w-full p-6 pb-24">
            {/* Profile Header */}
            <header className="mb-16 border-b border-[var(--border-subtle)] pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex-1">
                        <span className="block text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                            Member Profile
                        </span>
                        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-serif)] text-[var(--color-text)] leading-tight mb-6">
                            {profile?.display_name || 'Anonymous User'}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] font-light">
                            <span>{user.email}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]"></span>
                            <span className="capitalize">{profile?.role || 'Member'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-6">
                        <div className="w-24 h-24 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text)] text-3xl font-bold border border-[var(--border-subtle)]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                (profile?.display_name?.[0] || user.email?.[0] || '?').toUpperCase()
                            )}
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: History */}
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-2 mb-8">
                        <BookOpen size={16} className="text-[var(--color-primary)]" />
                        <h2 className="text-lg font-[family-name:var(--font-serif)] text-[var(--color-text)]">
                            Your Conversations
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {conversations?.map((conversation) => (
                            <ConversationCard key={conversation.id} conversation={conversation} currentUserId={user.id} />
                        ))}
                        {(!conversations || conversations.length === 0) && (
                            <p className="text-[var(--color-text-muted)] text-sm font-light italic">
                                You haven't started any discussions yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column: Guides & Settings */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Communication Guide */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Settings size={16} className="text-[var(--color-primary)]" />
                            <h2 className="text-lg font-[family-name:var(--font-serif)] text-[var(--color-text)]">
                                Community Standards
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {guides?.map((guide) => (
                                <div key={guide.id} className="group">
                                    <h4 className="text-sm font-medium text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                        {guide.title}
                                    </h4>
                                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-light">
                                        {guide.content}
                                    </p>
                                </div>
                            ))}
                            {(!guides || guides.length === 0) && (
                                <p className="text-[var(--color-text-muted)] text-sm font-light italic">
                                    No guides available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
