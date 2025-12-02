'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SignOutButton({ className = '' }: { className?: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.refresh()
        setLoading(false)
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className={`flex items-center space-x-2 text-[var(--color-accent)] hover:text-red-400 transition-colors disabled:opacity-50 text-xs uppercase tracking-widest ${className}`}
        >
            <LogOut size={14} />
            <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
    )
}
