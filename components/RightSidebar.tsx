import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Database } from '@/lib/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']

export default async function RightSidebar() {
    const supabase = await createClient()

    // Fetch top 5 trending conversations
    const { data: trending } = await supabase
        .from('conversations')
        .select('id, title, topic, score')
        .order('score', { ascending: false })
        .limit(5)

    const trendingItems = trending as Conversation[] | null

    return (
        <aside className="hidden xl:flex flex-col w-80 sticky top-0 h-screen border-l border-[var(--border-subtle)] px-8 py-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-lg font-[family-name:var(--font-serif)] text-[var(--color-text)] italic border-b border-[var(--color-primary)] pb-2 inline-block">
                    Trending Now
                </h2>
            </div>

            <div className="space-y-4">
                {!trendingItems || trendingItems.length === 0 ? (
                    <p className="text-[var(--color-text-muted)] text-sm">No trending topics yet.</p>
                ) : (
                    trendingItems.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/conversations/${item.id}`}
                            className="group block p-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-all border border-transparent hover:border-[var(--border-subtle)]"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                                    {item.topic || 'General'}
                                </span>
                                <span className="text-xs text-[var(--color-text-muted)] font-mono">
                                    #{index + 1}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors font-[family-name:var(--font-serif)]">
                                {item.title}
                            </h3>
                            <div className="mt-2 text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                <TrendingUp size={12} />
                                {item.score} points
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                <Link
                    href="/explore"
                    className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors uppercase tracking-widest text-xs"
                >
                    View all topics <ArrowRight size={14} />
                </Link>
            </div>

            {/* Footer / Copyright */}
            <div className="mt-auto pt-6 text-xs text-[var(--color-text-muted)] opacity-50">
                <p>© 2025 Dialogues @ Beloit</p>
                <p className="mt-1">Privacy · Terms · Cookies</p>
            </div>
        </aside>
    )
}
