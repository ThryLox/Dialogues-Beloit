import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dialogues @ Beloit</h1>
                <p className="text-gray-400">Join the campus conversation.</p>
            </div>
            <AuthForm />
        </div>
    )
}
