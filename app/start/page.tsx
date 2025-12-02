import { createClient } from '@/lib/supabase/server'
import StartDiscussionForm from './StartDiscussionForm'
import { redirect } from 'next/navigation'

export default async function StartPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="max-w-2xl mx-auto p-6 pb-24">
            <header className="mb-12 text-center">
                <span className="block text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-4">
                    New Dialogue
                </span>
                <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-6">
                    Start a Discussion
                </h1>
                <p className="text-[var(--color-text-muted)] font-light italic">
                    Share your thoughts with the community.
                </p>
            </header>

            <StartDiscussionForm userId={user.id} />
        </div>
    )
}
