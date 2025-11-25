'use client'

import Link from 'next/link'
import { MapPin, MessageSquare, Loader2, XCircle } from 'lucide-react'
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
        <div className={`flex space-x-4 p-4 bg-[#15151b] rounded-xl border transition-colors relative group ${conversation.status === 'closed' ? 'border-red-500/20 opacity-75' : 'border-white/5 hover:border-white/10'
            }`}>
            <div className="flex-shrink-0">
                <ConversationVote
                    id={conversation.id}
                    initialScore={conversation.score}
                    initialUserVote={userVote}
                />
            </div>
            <Link href={`/conversations/${conversation.id}`} className="flex-1 min-w-0 block">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                        {conversation.status === 'live' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-500 rounded-full animate-pulse">
                                LIVE
                            </span>
                        )}
                        {conversation.status === 'closed' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">
                                CLOSED
                            </span>
                        )}
                        <span className="text-xs text-gray-500">
                            {new Date(conversation.started_at).toLocaleDateString()}
                        </span>
                        {conversation.location && (
                            <span className="flex items-center text-xs text-gray-500">
                                <MapPin size={12} className="mr-1" />
                                {conversation.location}
                            </span>
                        )}
                    </div>

                    {isAuthor && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {conversation.status !== 'closed' && (
                                <button
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                                    title="Close Discussion"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <h3 className={`text-lg font-semibold text-white mb-1 truncate transition-colors ${conversation.status === 'closed' ? 'text-gray-400 line-through' : 'group-hover:text-blue-400'
                    }`}>
                    {conversation.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {conversation.body}
                </p>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                        <MessageSquare size={14} className="mr-1" />
                        <span>Comments</span>
                    </div>
                    {conversation.topic && (
                        <span className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded-full">
                            {conversation.topic}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    )
}
