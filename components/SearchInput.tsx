'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get('q') || '')

    // Simple debounce implementation inside the component to avoid creating a new file if not needed
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value !== searchParams.get('q')) {
                const params = new URLSearchParams(searchParams)
                if (value) {
                    params.set('q', value)
                } else {
                    params.delete('q')
                }
                router.push(`/explore?${params.toString()}`)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [value, router, searchParams])

    return (
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[var(--border-subtle)] rounded-full leading-5 bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:bg-[var(--color-surface-hover)] focus:border-[var(--color-primary)] transition-colors sm:text-sm"
                placeholder="Search topics, titles..."
            />
        </div>
    )
}
