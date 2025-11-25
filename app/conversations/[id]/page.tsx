import { createClient } from '@/lib/supabase/server'
import ConversationCard from '@/components/ConversationCard'
import CommentList from '@/components/CommentList'
import NewCommentForm from '@/components/NewCommentForm'
import { notFound, redirect } from 'next/navigation'
import { Database } from '@/lib/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']
type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    author: { display_name: string; avatar_url: string | null } | null
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = (await createClient()) as any
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
        <div className="max-w-md mx-auto p-4 pb-24">
            <ConversationCard
                conversation={conversation}
                userVote={conversationUserVote}
                currentUserId={user?.id}
            />

            {user && conversation.status !== 'closed' && (
                <NewCommentForm conversationId={conversation.id} userId={user.id} />
            )}
            {conversation.status === 'closed' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-400 text-sm">
                    This discussion is closed. New comments are disabled.
                </div>
            )}

            <CommentList comments={commentsWithVotes as any || []} />
        </div>
    )
}
