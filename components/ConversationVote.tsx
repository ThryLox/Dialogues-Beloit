'use client'

import { useState } from 'react'
import VoteButtons from './VoteButtons'
import { vote } from '@/app/actions'

interface ConversationVoteProps {
    id: string
    initialScore: number
    initialUserVote?: number
}

export default function ConversationVote({ id, initialScore, initialUserVote }: ConversationVoteProps) {
    const [score, setScore] = useState(initialScore)
    const [userVote, setUserVote] = useState<number | undefined>(initialUserVote)

    const handleVote = async (value: number) => {
        // Optimistic update
        const previousScore = score
        const previousVote = userVote

        let newScore = score
        let newVote = userVote

        if (userVote === value) {
            // Toggle off
            newVote = undefined
            newScore -= value
        } else {
            // Flip or new vote
            if (userVote) {
                newScore += value * 2 // e.g. -1 to 1 is +2
            } else {
                newScore += value
            }
            newVote = value
        }

        setScore(newScore)
        setUserVote(newVote)

        const result = await vote('conversation', id, value)
        if (result?.error) {
            // Revert on error
            setScore(previousScore)
            setUserVote(previousVote)
            // Ideally show a toast here
        }
    }

    return (
        <VoteButtons
            score={score}
            userVote={userVote}
            onVote={handleVote}
        />
    )
}
