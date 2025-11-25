import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ConversationCard from '@/components/ConversationCard'
import SignOutButton from '@/components/SignOutButton'
import { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['users']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row']
type Guide = Database['public']['Tables']['communication_guides']['Row']

export default async function ProfilePage() {
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
                <p className="text-gray-400 mb-8">Please log in to view your profile.</p>
                <Link
                    href="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
        <div className="max-w-md mx-auto p-4 pb-24 space-y-8">
            {/* User Profile Section */}
            <section className="bg-[#15151b] p-6 rounded-xl border border-white/5">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            (profile?.display_name?.[0] || user.email?.[0] || '?').toUpperCase()
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile?.display_name || 'User'}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-white/10 text-gray-300 rounded-full capitalize">
                            {profile?.role || 'user'}
                        </span>
                    </div>
                </div>
                {/* Sign out button */}
                <SignOutButton />
            </section>

            {/* Post History Section */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4">Your Conversations</h3>
                <div className="space-y-4">
                    {conversations?.map((conversation) => (
                        <ConversationCard key={conversation.id} conversation={conversation} currentUserId={user.id} />
                    ))}
                    {(!conversations || conversations.length === 0) && (
                        <p className="text-gray-500 text-center py-4">You haven't started any discussions yet.</p>
                    )}
                </div>
            </section>

            {/* Communication Guide Section */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4">Communication Guide</h3>
                <div className="space-y-4">
                    {guides?.map((guide) => (
                        <div key={guide.id} className="bg-[#15151b] p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-2">{guide.title}</h4>
                            <p className="text-sm text-gray-400">{guide.content}</p>
                        </div>
                    ))}
                    {(!guides || guides.length === 0) && (
                        <p className="text-gray-500 text-center py-4">No guides available.</p>
                    )}
                </div>
            </section>
        </div>
    )
}
