'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === 'sign-up') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setError('Check your email for the confirmation link.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-2">
                    {view === 'sign-in' ? 'Welcome Back' : 'Membership Application'}
                </h2>
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                    {view === 'sign-in'
                        ? 'Please sign in to continue'
                        : 'Create your account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className={`p-4 text-xs uppercase tracking-widest text-center border ${error.includes('Check your email')
                        ? 'border-green-500/30 text-green-500'
                        : 'border-red-500/30 text-red-500'
                        }`}>
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-[var(--border-subtle)] py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors text-sm font-light"
                            placeholder="Email Address"
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-[var(--border-subtle)] py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] transition-colors text-sm font-light"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex items-center justify-center gap-3 py-4 bg-[var(--color-surface-hover)] hover:bg-[var(--color-text)] text-[var(--color-text)] hover:text-[var(--color-bg)] transition-all duration-300 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <span>{view === 'sign-in' ? 'Enter' : 'Submit'}</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-12 text-center">
                <button
                    onClick={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-[10px] uppercase tracking-widest transition-colors"
                >
                    {view === 'sign-in' ? 'Apply for Membership' : 'Already a Member?'}
                </button>
            </div>
        </div>
    )
}
