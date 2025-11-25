import { Database } from '@/lib/database.types'
import CommentVote from './CommentVote'

// Define a type that includes the joined author data and optional user vote
type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    author: { display_name: string; avatar_url: string | null } | null
    user_vote?: number
}

export default function CommentList({ comments }: { comments: CommentWithAuthor[] }) {
    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Comments ({comments.length})</h3>
            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                            {comment.author?.avatar_url ? (
                                <img src={comment.author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                (comment.author?.display_name?.[0] || '?').toUpperCase()
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-[#15151b] p-3 rounded-lg border border-white/5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-bold text-white">{comment.author?.display_name || 'User'}</span>
                                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap mb-2">{comment.body}</p>
                            <div className="flex items-center">
                                <CommentVote
                                    id={comment.id}
                                    initialScore={comment.score}
                                    initialUserVote={comment.user_vote}
                                    orientation="horizontal"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
