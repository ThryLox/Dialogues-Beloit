import { createClient } from '@/lib/supabase/server'
import ConversationCard from '@/components/ConversationCard'
import Link from 'next/link'
import { Database } from '@/lib/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort = 'top' } = await searchParams
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('conversations').select('*')

  if (sort === 'new') {
    query = query.order('started_at', { ascending: false })
  } else {
    // top or best (default to top for now)
    query = query.order('score', { ascending: false })
  }

  const { data: conversationsData } = await query
  const conversations = conversationsData as Conversation[] | null

  let userVotesMap: Record<string, number> = {}
  if (user && conversations && conversations.length > 0) {
    const { data: votes } = await supabase
      .from('conversation_votes')
      .select('conversation_id, value')
      .eq('user_id', user.id)
      .in('conversation_id', conversations.map((c: Conversation) => c.id))

    const votesData = votes as { conversation_id: string, value: number }[] | null
    votesData?.forEach((v) => {
      userVotesMap[v.conversation_id] = v.value
    })
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      <header className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-white">Dialogues</h1>
        <div className="flex space-x-2 bg-[#15151b] p-1 rounded-lg">
          <Link
            href="/?sort=top"
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${sort === 'top' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Top
          </Link>
          <Link
            href="/?sort=new"
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${sort === 'new' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            New
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        {conversations?.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            userVote={userVotesMap[conversation.id]}
            currentUserId={user?.id}
          />
        ))}
        {(!conversations || conversations.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <p>No conversations yet.</p>
            <p className="text-sm mt-2">Be the first to start one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
