import { createClient } from '@/lib/supabase/server'
import Discussion from '@/components/Discussion'
import { notFound, redirect } from 'next/navigation'
import { Database } from '@/lib/database.types'
import ConversationVote from '@/components/ConversationVote'
import { MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Conversation = Database['public']['Tables']['conversations']['Row']
type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    author: { display_name: string; avatar_url: string | null } | null
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch conversation
    const { data: conversationData } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single()

    const conversation = conversationData as Conversation | null

    if (!conversation) {
        notFound()
    }

    // Fetch user vote for conversation
    let conversationUserVote: number | undefined
    if (user) {
        const { data: vote } = await supabase
            .from('conversation_votes')
            .select('value')
            .eq('user_id', user.id)
            .eq('conversation_id', id)
            .single()

        const voteData = vote as { value: number } | null
        if (voteData) conversationUserVote = voteData.value
    }

    // Fetch comments with author info
    const { data: commentsData } = await supabase
        .from('comments')
        .select('*, author:users!author_id(display_name, avatar_url)')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

    const comments = commentsData as CommentWithAuthor[] | null

    // Fetch user votes for comments
    let commentsWithVotes = comments || []
    if (user && comments && comments.length > 0) {
        const { data: commentVotes } = await supabase
            .from('comment_votes')
            .select('comment_id, value')
            .eq('user_id', user.id)
            .in('comment_id', comments.map((c: CommentWithAuthor) => c.id))

        const commentVotesMap: Record<string, number> = {}
        const votesData = commentVotes as { comment_id: string, value: number }[] | null
        votesData?.forEach((v) => {
            commentVotesMap[v.comment_id] = v.value
        })

        commentsWithVotes = comments.map((c: CommentWithAuthor) => ({
            ...c,
            user_vote: commentVotesMap[c.id]
        }))
    }

    return (
        <div className="w-full p-6 pb-24">
            {/* Back Link */}
            <Link href="/" className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8 transition-colors text-xs uppercase tracking-widest">
                <ArrowLeft size={14} className="mr-2" />
                Back to Feed
            </Link>

            {/* Article Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6 font-medium">
                    <span className="text-[var(--color-primary)]">
                        {conversation.topic || 'General'}
                    </span>
                    <span>•</span>
                    <span>{new Date(conversation.started_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    {conversation.location && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {conversation.location}
                            </span>
                        </>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-[var(--color-text)] leading-tight mb-6">
                    {conversation.title}
                </h1>

                <div className="flex items-center justify-between border-y border-[var(--border-subtle)] py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text)] font-bold text-xs">
                            DB
                        </div>
                        <span className="text-xs uppercase tracking-widest text-[var(--color-text)] font-medium">
                            Anonymous User
                        </span>
                    </div>

                    <ConversationVote
                        id={conversation.id}
                        initialScore={conversation.score}
                        initialUserVote={conversationUserVote}
                    />
                </div>
            </header>

            {/* Article Body */}
            <div className="prose prose-invert max-w-none mb-16">
                <p className="text-lg text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap font-light">
                    {conversation.body}
                </p>
            </div>

            {/* Discussion Section */}
            <Discussion
                conversationId={conversation.id}
                userId={user?.id || ''}
                comments={commentsWithVotes as any || []}
                isClosed={conversation.status === 'closed'}
            />
        </div>
    )
}
