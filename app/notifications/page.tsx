import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NotificationList from '@/components/NotificationList'
import { Database } from '@/lib/database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="pb-20">
            <div className="sticky top-0 z-20 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 py-4">
                <h1 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--color-text)]">Notifications</h1>
            </div>

            <div className="p-0">
                <NotificationList notifications={notifications as Notification[] || []} />
            </div>
        </div>
    )
}
