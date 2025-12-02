'use client'

import { useState, useRef } from 'react'
import { Database } from '@/lib/database.types'
import CommentList from './CommentList'
import NewCommentForm from './NewCommentForm'

type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    author: { display_name: string; avatar_url: string | null } | null
    user_vote?: number
}

interface DiscussionProps {
    conversationId: string
    userId: string
    comments: CommentWithAuthor[]
    isClosed: boolean
}

export default function Discussion({ conversationId, userId, comments, isClosed }: DiscussionProps) {
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleReply = (authorName: string) => {
        setReplyTo(authorName)
        // Scroll to form and focus
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            const textarea = formRef.current.querySelector('textarea')
            if (textarea) {
                textarea.focus()
            }
        }
    }

    return (
        <div className="border-t border-[var(--border-subtle)] pt-12">
            <h3 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-8">
                Discussion
            </h3>

            {!isClosed && (
                <div className="mb-12" ref={formRef as any}>
                    <NewCommentForm
                        conversationId={conversationId}
                        userId={userId}
                        initialValue={replyTo ? `@${replyTo} ` : ''}
                        onClear={() => setReplyTo(null)}
                    />
                </div>
            )}

            {isClosed && (
                <div className="p-4 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs uppercase tracking-widest text-center mb-8">
                    This discussion has been archived.
                </div>
            )}

            <CommentList comments={comments} onReply={handleReply} />
        </div>
    )
}
