import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flame, TrendingUp } from 'lucide-react'
import { Database } from '@/lib/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']

export default async function TrendingSidebar() {
    const supabase = await createClient()

    // Fetch top 5 conversations by score (proxy for "hot")
    const { data: trending } = await supabase
        .from('conversations')
        .select('id, title, score, topic')
        .order('score', { ascending: false })
        .limit(5)

    const trendingItems = trending as { id: string; title: string; score: number; topic: string | null }[] | null

    if (!trendingItems || trendingItems.length === 0) return null

    return (
        <div className="hidden lg:block w-80 shrink-0">
            <div className="glass-panel rounded-xl p-4 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                    <Flame className="text-[var(--color-accent)]" size={20} />
                    <h2 className="text-lg font-bold text-white">Trending Now</h2>
                </div>

                <div className="space-y-3">
                    {trendingItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/conversations/${item.id}`}
                            className="block group"
                        >
                            <div className="p-3 rounded-lg bg-white/5 border border-transparent group-hover:border-[var(--color-primary)] group-hover:bg-white/10 transition-all duration-300">
                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-[var(--color-primary)] line-clamp-2 mb-1">
                                    {item.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {item.score} pts
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                                        {item.topic || 'General'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                    <p className="text-xs text-center text-gray-500">
                        Top discussions from the community
                    </p>
                </div>
            </div>
        </div>
    )
}
