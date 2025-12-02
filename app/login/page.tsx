import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-12 text-center">
                <span className="block text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-4">
                    Exclusive Access
                </span>
                <h1 className="text-5xl font-[family-name:var(--font-serif)] text-[var(--color-text)] mb-4 tracking-tight">
                    Dialogues @ Beloit
                </h1>
                <p className="text-[var(--color-text-muted)] font-light italic">
                    Join the campus conversation.
                </p>
            </div>
            <AuthForm />
        </div>
    )
}
