'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight } from 'lucide-react'

export default function StartDiscussionForm({ userId }: { userId: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const body = formData.get('body') as string
        const location = formData.get('location') as string
        const topic = formData.get('topic') as string

        if (!title || !body) {
            setError('Title and body are required')
            setLoading(false)
            return
        }

        const { data, error: insertError } = await supabase
            .from('conversations')
            .insert({
                title,
                body,
                location: location || null,
                topic: topic || null,
                author_id: userId,
                status: 'live',
                score: 0,
                started_at: new Date().toISOString(),
            } as any)
            .select()
            .single()

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        router.push(`/conversations/${(data as any).id}`)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
                <div className="p-4 text-xs uppercase tracking-widest text-center border border-red-500/30 text-red-500">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                <div>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-4 text-2xl md:text-3xl font-[family-name:var(--font-serif)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors"
                        placeholder="Title your discussion..."
                    />
                </div>

                <div>
                    <textarea
                        name="body"
                        id="body"
                        required
                        rows={8}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-4 text-lg font-light text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors resize-none leading-relaxed"
                        placeholder="What's on your mind? elaborate here..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="location" className="block text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                            Location (Optional)
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors font-light"
                            placeholder="e.g. Pearsons Hall"
                        />
                    </div>
                    <div>
                        <label htmlFor="topic" className="block text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                            Topic (Optional)
                        </label>
                        <input
                            type="text"
                            name="topic"
                            id="topic"
                            className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors font-light"
                            placeholder="e.g. Campus Events"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-[var(--color-text)] text-[var(--color-bg)] hover:bg-[var(--color-primary)] transition-all duration-300 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <span>Publish Dialogue</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
