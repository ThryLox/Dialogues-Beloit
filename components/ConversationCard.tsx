'use client'

import Link from 'next/link'
import { MessageSquare, Loader2, XCircle, ArrowUpRight } from 'lucide-react'
import ConversationVote from './ConversationVote'
import { Database } from '@/lib/database.types'
import { closeConversation } from '@/app/actions'
import { useState } from 'react'

type Conversation = Database['public']['Tables']['conversations']['Row']

interface ConversationCardProps {
    conversation: Conversation
    userVote?: number
    currentUserId?: string
}

export default function ConversationCard({ conversation, userVote, currentUserId }: ConversationCardProps) {
    const [loading, setLoading] = useState(false)
    const isAuthor = currentUserId === conversation.author_id

    const handleClose = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation
        if (!confirm('Are you sure you want to close this discussion?')) return

        setLoading(true)
        await closeConversation(conversation.id)
        setLoading(false)
    }

    return (
        <Link href={`/conversations/${conversation.id}`} className="block group mb-12">
            <div className="relative pb-12 border-b border-[var(--border-subtle)] transition-colors duration-500">
                {/* Meta Data - Editorial Style */}
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4 font-medium">
                    <span className="text-[var(--color-primary)]">
                        {conversation.topic || 'General'}
                    </span>
                    <span>•</span>
                    <span>{new Date(conversation.started_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                    {conversation.location && (
                        <>
                            <span>•</span>
                            <span>{conversation.location}</span>
                        </>
                    )}
                </div>

                {/* Title - Serif & Elegant */}
                <h3 className="text-4xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-4 leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                    {conversation.title}
                </h3>

                {/* Body - Clean Sans */}
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed line-clamp-3 mb-6 font-light max-w-2xl">
                    {conversation.body}
                </p>

                {/* Footer - Minimalist */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div onClick={(e) => e.preventDefault()} className="relative z-20">
                            <ConversationVote
                                id={conversation.id}
                                initialScore={conversation.score}
                                initialUserVote={userVote}
                            />
                        </div>
                        <div className="flex items-center text-[var(--color-text-muted)] text-xs uppercase tracking-widest group-hover:text-[var(--color-text)] transition-colors">
                            <span className="mr-2">Read Discussion</span>
                            <ArrowUpRight size={14} />
                        </div>
                    </div>

                    {isAuthor && conversation.status !== 'closed' && (
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors text-xs uppercase tracking-widest"
                        >
                            {loading ? 'Closing...' : 'Close'}
                        </button>
                    )}

                    {conversation.status === 'closed' && (
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-1">
                            Archived
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
