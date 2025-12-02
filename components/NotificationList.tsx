'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Bell, MessageCircle, Flame, AtSign } from 'lucide-react'
import { Database } from '@/lib/database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
    const supabase = createClient()

    useEffect(() => {
        const markAsRead = async () => {
            const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
            if (unreadIds.length > 0) {
                await (supabase
                    .from('notifications') as any)
                    .update({ is_read: true })
                    .in('id', unreadIds)
            }
        }

        markAsRead()
    }, [notifications, supabase])

    const getIcon = (type: string) => {
        switch (type) {
            case 'hot_post': return <Flame className="text-[var(--color-accent)]" size={20} />
            case 'mention': return <AtSign className="text-[var(--color-primary)]" size={20} />
            default: return <MessageCircle className="text-[var(--color-primary)]" size={20} />
        }
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
                <Bell size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-light italic">No notifications yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <Link
                    key={notification.id}
                    href={`/conversations/${notification.resource_id}`}
                    className={`block p-6 border-b border-[var(--border-subtle)] transition-all hover:bg-[var(--color-surface-hover)] group ${notification.is_read ? 'opacity-70 hover:opacity-100' : 'opacity-100'
                        }`}
                >
                    <div className="flex gap-4 items-start">
                        <div className="mt-1 shrink-0">
                            {getIcon(notification.type)}
                        </div>
                        <div>
                            <p className="text-[var(--color-text)] font-medium mb-2 text-sm leading-relaxed">
                                {notification.content}
                            </p>
                            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                                {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
