'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function StartDiscussionForm({ userId }: { userId: string }) {
    const router = useRouter()
    const supabase = createClient() as any
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
            })
            .select()
            .single()

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        router.push(`/conversations/${data.id}`)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="w-full bg-[#15151b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="What's on your mind?"
                />
            </div>

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-400 mb-1">
                    Details
                </label>
                <textarea
                    name="body"
                    id="body"
                    required
                    rows={5}
                    className="w-full bg-[#15151b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Elaborate on your thought..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                        Location (Optional)
                    </label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        className="w-full bg-[#15151b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g. Pearsons"
                    />
                </div>
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-400 mb-1">
                        Topic (Optional)
                    </label>
                    <input
                        type="text"
                        name="topic"
                        id="topic"
                        className="w-full bg-[#15151b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g. Events"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Start Discussion'}
            </button>
        </form>
    )
}
