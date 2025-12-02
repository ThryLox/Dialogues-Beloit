'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createComment } from '@/app/actions'

interface NewCommentFormProps {
    conversationId: string
    userId: string
    initialValue?: string
    onClear?: () => void
}

export default function NewCommentForm({ conversationId, userId, initialValue = '', onClear }: NewCommentFormProps) {
    const [body, setBody] = useState(initialValue)
    const [loading, setLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const router = useRouter()

    // Update body when initialValue changes
    if (initialValue && body === '' && !isFocused) {
        setBody(initialValue)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!body.trim()) return

        setLoading(true)
        // Call server action
        const result = await createComment(conversationId, body)

        if (result?.error) {
            alert('Error posting comment: ' + result.error)
        } else {
            setBody('')
            onClear?.()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className={`transition-all duration-300 ${isFocused ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Write a response..."
                    className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--color-text)] py-4 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none transition-colors resize-none text-base font-light leading-relaxed min-h-[100px]"
                />

                <div className={`flex justify-end mt-4 transition-all duration-300 ${body.trim() ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                    <button
                        type="submit"
                        disabled={loading || !body.trim()}
                        className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span>Publishing</span>
                                <Loader2 size={12} className="animate-spin" />
                            </>
                        ) : (
                            <>
                                <span>Publish Response</span>
                                <ArrowRight size={12} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
