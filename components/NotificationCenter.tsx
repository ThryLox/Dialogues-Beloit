'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Notification = {
    id: string
    type: 'reply' | 'hot_post' | 'mention'
    content: string
    is_read: boolean
    created_at: string
    resource_id: string
}

export default function NotificationCenter({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const supabase = createClient() as any

    useEffect(() => {
        fetchNotifications()

        // Optional: Set up realtime subscription here
        const channel = supabase
            .channel('realtime-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload: any) => {
                    setNotifications((prev) => [payload.new as Notification, ...prev])
                    setUnreadCount((prev) => prev + 1)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10)

        if (data) {
            setNotifications(data as Notification[])
            setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
        }
    }

    const markAsRead = async () => {
        if (unreadCount > 0) {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false)

            setUnreadCount(0)
            setNotifications((prev: Notification[]) => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    const toggleDropdown = () => {
        if (!isOpen) {
            markAsRead()
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--color-accent)] text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-[var(--glass-border)] bg-white/5">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={`/conversations/${notification.resource_id}`}
                                    className="block p-3 hover:bg-white/5 transition-colors border-b border-[var(--glass-border)] last:border-0"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notification.type === 'hot_post' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-primary)]'}`} />
                                        <div>
                                            <p className="text-sm text-gray-200 line-clamp-2">
                                                {notification.content}
                                            </p>
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
