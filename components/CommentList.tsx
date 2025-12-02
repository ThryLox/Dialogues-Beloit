import { Database } from '@/lib/database.types'
import CommentVote from './CommentVote'

// Define a type that includes the joined author data and optional user vote
type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    author: { display_name: string; avatar_url: string | null } | null
    user_vote?: number
}

export default function CommentList({ comments, onReply }: { comments: CommentWithAuthor[], onReply?: (authorName: string) => void }) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--color-text-muted)] text-sm italic font-serif">
                No responses yet. Be the first to write.
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {comments.map((comment) => (
                <div key={comment.id} className="group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text-muted)] text-[10px] font-bold">
                                {(comment.author?.display_name?.[0] || '?').toUpperCase()}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                <span className="text-[var(--color-text)] font-medium">
                                    {comment.author?.display_name || 'User'}
                                </span>
                                <span className="text-[var(--color-text-muted)]">•</span>
                                <span className="text-[var(--color-text-muted)]">
                                    {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pl-9">
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed whitespace-pre-wrap mb-4 font-light">
                            {comment.body}
                        </p>

                        <div className="flex items-center justify-between pb-8 border-b border-[var(--border-subtle)] group-last:border-0">
                            <CommentVote
                                id={comment.id}
                                initialScore={comment.score}
                                initialUserVote={comment.user_vote}
                                orientation="horizontal"
                            />

                            <button
                                onClick={() => onReply?.(comment.author?.display_name || 'User')}
                                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-[10px] uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
