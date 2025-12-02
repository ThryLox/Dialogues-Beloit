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
    <div className="w-full p-6 pb-24">
      {/* Editorial Filter Header */}
      <div className="flex justify-end mb-12 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex space-x-6 text-xs uppercase tracking-widest font-medium">
          <Link
            href="/?sort=top"
            className={`transition-colors ${sort === 'top' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
          >
            Popular
          </Link>
          <Link
            href="/?sort=new"
            className={`transition-colors ${sort === 'new' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
          >
            Latest
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {conversations?.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            userVote={userVotesMap[conversation.id] || 0}
            currentUserId={user?.id}
          />
        ))}
      </div>
      {(!conversations || conversations.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p>No conversations yet.</p>
          <p className="text-sm mt-2">Be the first to start one!</p>
        </div>
      )}
    </div>
  )
}
