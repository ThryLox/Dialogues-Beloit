'use client'

import { useState } from 'react'
import VoteButtons from './VoteButtons'
import { vote } from '@/app/actions'

interface CommentVoteProps {
    id: string
    initialScore: number
    initialUserVote?: number
    orientation?: 'vertical' | 'horizontal'
}

export default function CommentVote({ id, initialScore, initialUserVote, orientation = 'vertical' }: CommentVoteProps) {
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
                newScore += value * 2
            } else {
                newScore += value
            }
            newVote = value
        }

        setScore(newScore)
        setUserVote(newVote)

        const result = await vote('comment', id, value)
        if (result?.error) {
            // Revert on error
            setScore(previousScore)
            setUserVote(previousVote)
        }
    }

    return (
        <VoteButtons
            score={score}
            userVote={userVote}
            onVote={handleVote}
            orientation={orientation}
        />
    )
}
