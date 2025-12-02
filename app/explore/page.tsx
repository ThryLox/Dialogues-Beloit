import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flame, TrendingUp, MapPin, Search } from 'lucide-react'
import { Database } from '@/lib/database.types'
import SearchInput from '@/components/SearchInput'

type Conversation = Database['public']['Tables']['conversations']['Row']

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const supabase = await createClient()
    const { q: query } = await searchParams

    let conversations: Conversation[] | null = null

    if (query) {
        // Search mode
        const { data } = await supabase
            .from('conversations')
            .select('*')
            .or(`title.ilike.%${query}%,topic.ilike.%${query}%`)
            .order('score', { ascending: false })
            .limit(50)
        conversations = data
    } else {
        // Trending mode (default)
        const { data } = await supabase
            .from('conversations')
            .select('*')
            .order('score', { ascending: false })
            .limit(20)
        conversations = data
    }

    return (
        <div className="pb-20">
            <div className="sticky top-0 z-20 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-3">
                <h1 className="text-xl font-bold text-[var(--color-text)]">Explore</h1>
            </div>

            <div className="p-4 space-y-6">
                <SearchInput />

                {/* Header based on state */}
                <div className="flex items-center gap-2 mb-4">
                    {query ? (
                        <>
                            <Search className="text-[var(--color-primary)]" size={24} />
                            <h2 className="text-2xl font-bold text-[var(--color-text)]">
                                Results for "{query}"
                            </h2>
                        </>
                    ) : (
                        <>
                            <Flame className="text-[var(--color-accent)]" size={24} />
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-orange-500">
                                Trending Now
                            </h2>
                        </>
                    )}
                </div>

                {!conversations || conversations.length === 0 ? (
                    <div className="text-center py-10 text-[var(--color-text-muted)]">
                        {query ? `No results found for "${query}"` : 'No trending topics yet. Be the first to start a fire!'}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {conversations.map((item, index) => (
                            <Link
                                key={item.id}
                                href={`/conversations/${item.id}`}
                                className="block group"
                            >
                                <div className="flex items-start gap-4 p-4 rounded-xl card-hover bg-[var(--color-surface)]">
                                    {!query && (
                                        <div className="text-2xl font-bold text-[var(--color-text-muted)] w-8 text-center opacity-50">
                                            #{index + 1}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-primary)]">
                                                {item.topic || 'General'}
                                            </span>
                                            {item.location && (
                                                <span className="text-xs text-[var(--color-text-muted)] flex items-center">
                                                    <MapPin size={12} className="mr-1" />
                                                    {item.location}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <TrendingUp size={16} />
                                                {item.score} points
                                            </span>
                                            <span>
                                                {new Date(item.started_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
