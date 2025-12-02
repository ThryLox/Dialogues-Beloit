'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Hash, Bell, User, PenSquare, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LeftSidebar({ userId }: { userId?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Hash, label: 'Explore', href: '/explore' },
        { icon: Bell, label: 'Notifications', href: '/notifications' },
        { icon: User, label: 'Profile', href: '/me' },
    ]

    return (
        <div className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-[var(--border-subtle)] px-4 py-6">
            {/* Logo */}
            <div className="mb-12 px-4">
                <Link href="/" className="text-3xl font-[family-name:var(--font-serif)] font-bold text-[var(--color-text)] tracking-tight">
                    Dialogues.
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg transition-all duration-200 ${isActive
                                ? 'font-bold text-[var(--color-text)] bg-[var(--color-surface-hover)]'
                                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}

                {/* Post Button */}
                <Link
                    href="/start"
                    className="w-full mt-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <PenSquare size={20} />
                    <span>Post</span>
                </Link>
            </nav>

            {/* User Profile / Sign Out */}
            {userId ? (
                <div className="mt-auto pt-6 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-full text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            ) : (
                <div className="mt-auto">
                    <Link
                        href="/login"
                        className="flex items-center justify-center w-full py-3 rounded-full border border-[var(--border-subtle)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        Log In
                    </Link>
                </div>
            )}
        </div>
    )
}
