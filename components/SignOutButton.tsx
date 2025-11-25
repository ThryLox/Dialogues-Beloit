'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SignOutButton() {
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
            className="w-full flex items-center justify-center space-x-2 p-2 bg-white/5 hover:bg-white/10 text-red-400 rounded-lg transition-colors disabled:opacity-50"
        >
            <LogOut size={16} />
            <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
    )
}
