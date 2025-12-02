'use server'

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export async function vote(
    type: 'conversation' | 'comment',
    id: string,
    value: number // 1 or -1
) {
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    let newScoreDelta = 0

    if (type === 'conversation') {
        const { data } = await supabase
            .from('conversation_votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('conversation_id', id)
            .maybeSingle()

        const existingVote = data as Database['public']['Tables']['conversation_votes']['Row'] | null

        if (existingVote) {
            if (existingVote.value === value) {
                await supabase.from('conversation_votes').delete().eq('id', existingVote.id)
                newScoreDelta = -value
            } else {
                await supabase.from('conversation_votes').update({ value }).eq('id', existingVote.id)
                newScoreDelta = value * 2
            }
        } else {
            await supabase.from('conversation_votes').insert({
                user_id: user.id,
                conversation_id: id,
                value,
            })
            newScoreDelta = value
        }

        const { data: itemData } = await supabase
            .from('conversations')
            .select('score')
            .eq('id', id)
            .single()

        const item = itemData as { score: number } | null

        // ... (existing vote logic)

        if (item) {
            const newScore = item.score + newScoreDelta
            await supabase
                .from('conversations')
                .update({ score: newScore })
                .eq('id', id)

            // Check for "Hot" post (e.g., score > 10) and notify author if not already notified
            if (newScore >= 10 && type === 'conversation') {
                const { data: conversation } = await supabase
                    .from('conversations')
                    .select('author_id, title')
                    .eq('id', id)
                    .single()

                if (conversation && conversation.author_id !== user.id) {
                    // Check if already notified for hot post
                    const { data: existingNotif } = await supabase
                        .from('notifications')
                        .select('id')
                        .eq('type', 'hot_post')
                        .eq('resource_id', id)
                        .eq('user_id', conversation.author_id)
                        .maybeSingle()

                    if (!existingNotif) {
                        await supabase.from('notifications').insert({
                            user_id: conversation.author_id,
                            type: 'hot_post',
                            resource_id: id,
                            content: `Your post "${conversation.title}" is trending!`,
                        })
                    }
                }
            }
        }
    } else {
        const { data } = await supabase
            .from('comment_votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('comment_id', id)
            .maybeSingle()

        const existingVote = data as Database['public']['Tables']['comment_votes']['Row'] | null

        if (existingVote) {
            if (existingVote.value === value) {
                await supabase.from('comment_votes').delete().eq('id', existingVote.id)
                newScoreDelta = -value
            } else {
                await supabase.from('comment_votes').update({ value }).eq('id', existingVote.id)
                newScoreDelta = value * 2
            }
        } else {
            await supabase.from('comment_votes').insert({
                user_id: user.id,
                comment_id: id,
                value,
            })
            newScoreDelta = value
        }

        const { data: itemData } = await supabase
            .from('comments')
            .select('score')
            .eq('id', id)
            .single()

        const item = itemData as { score: number } | null

        if (item) {
            await supabase
                .from('comments')
                .update({ score: item.score + newScoreDelta })
                .eq('id', id)
        }
    }

    revalidatePath('/')
    revalidatePath(`/conversations/${id}`)
    revalidatePath('/me')

    return { success: true }
}

export async function createComment(conversationId: string, body: string) {
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Insert comment
    const { error } = await supabase
        .from('comments')
        .insert({
            conversation_id: conversationId,
            author_id: user.id,
            body: body.trim(),
            score: 0,
            created_at: new Date().toISOString(),
        })

    if (error) return { error: error.message }

    // Notify conversation author
    const { data: conversation } = await supabase
        .from('conversations')
        .select('author_id, title')
        .eq('id', conversationId)
        .single()

    if (conversation && conversation.author_id !== user.id) {
        await supabase.from('notifications').insert({
            user_id: conversation.author_id,
            type: 'reply',
            resource_id: conversationId,
            content: `New reply on "${conversation.title}"`,
        })
    }

    revalidatePath(`/conversations/${conversationId}`)
    return { success: true }
}

export async function closeConversation(id: string) {
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify ownership
    const { data: conversation } = await supabase
        .from('conversations')
        .select('author_id')
        .eq('id', id)
        .single()

    if (!conversation || conversation.author_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('conversations')
        .update({ status: 'closed' })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath(`/conversations/${id}`)
    revalidatePath('/')
    return { success: true }
}

export async function deleteConversation(id: string) {
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify ownership
    const { data: conversation } = await supabase
        .from('conversations')
        .select('author_id')
        .eq('id', id)
        .single()

    if (!conversation || conversation.author_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    // Delete conversation (database handles cascade via migration.sql)
    const { error } = await supabase.from('conversations').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/me')
    return { success: true }
}
