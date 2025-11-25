'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, User } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#15151b] border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/') ? 'text-white bg-black/50' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <Home size={24} />
                    <span className="text-xs mt-1">Feed</span>
                </Link>
                <Link
                    href="/start"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/start') ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <PlusCircle size={24} />
                    <span className="text-xs mt-1">Start</span>
                </Link>
                <Link
                    href="/me"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/me') ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <User size={24} />
                    <span className="text-xs mt-1">Me</span>
                </Link>
            </div>
        </nav>
    )
}
