'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
        <div className="w-full max-w-md p-8 space-y-6 bg-[#15151b] rounded-xl border border-white/5">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                    {view === 'sign-in' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    {view === 'sign-in'
                        ? 'Sign in to continue to Dialogues @ Beloit'
                        : 'Join the conversation today'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className={`p-3 rounded-lg text-sm ${error.includes('Check your email')
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                        }`}>
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="you@beloit.edu"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        view === 'sign-in' ? 'Sign In' : 'Sign Up'
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-gray-400">
                {view === 'sign-in' ? (
                    <p>
                        Don't have an account?{' '}
                        <button
                            onClick={() => setView('sign-up')}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <button
                            onClick={() => setView('sign-in')}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                )}
            </div>
        </div>
    )
}
