import { createClient } from '@/lib/supabase/server'
import StartDiscussionForm from './StartDiscussionForm'
import Link from 'next/link'

export default async function StartPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Join the Conversation</h1>
                <p className="text-gray-400 mb-8">You need to be logged in to start a discussion.</p>
                <Link
                    href="/login" // Assuming login page exists or handled by Supabase Auth UI
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Log In
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto p-4 pb-24">
            <h1 className="text-2xl font-bold text-white mb-6">Start a Discussion</h1>
            <StartDiscussionForm userId={user.id} />
        </div>
    )
}
