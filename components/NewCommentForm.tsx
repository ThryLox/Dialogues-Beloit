'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewCommentForm({ conversationId, userId }: { conversationId: string, userId: string }) {
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient() as any
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!body.trim()) return

        setLoading(true)
        const { error } = await supabase
            .from('comments')
            .insert({
                conversation_id: conversationId,
                author_id: userId,
                body: body.trim(),
                score: 0,
                created_at: new Date().toISOString(),
            })

        if (!error) {
            setBody('')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div className="relative">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="w-full bg-[#15151b] border border-white/10 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={loading || !body.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
        </form>
    )
}
