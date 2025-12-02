'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Hash, Bell, User, PenSquare } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Hash, label: 'Explore', href: '/explore' },
        { icon: PenSquare, label: 'Post', href: '/start' },
        { icon: Bell, label: 'Alerts', href: '/notifications' },
        { icon: User, label: 'Profile', href: '/me' },
    ]

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-bg)]/90 backdrop-blur-lg border-t border-[var(--border-subtle)] pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
