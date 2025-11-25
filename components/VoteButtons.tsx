'use client'

import { ArrowBigUp, ArrowBigDown } from 'lucide-react'

interface VoteButtonsProps {
    score: number
    userVote?: number // 1, -1, or 0/undefined
    onVote: (value: number) => void
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
}

export default function VoteButtons({ score, userVote, onVote, disabled, orientation = 'vertical' }: VoteButtonsProps) {
    const isHorizontal = orientation === 'horizontal'

    return (
        <div
            className={`flex items-center bg-[#15151b]/50 rounded-lg ${isHorizontal ? 'flex-row space-x-1 p-1' : 'flex-col space-y-1 p-2'
                }`}
            onClick={(e) => e.preventDefault()}
        >
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onVote(1)
                }}
                disabled={disabled}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${userVote === 1 ? 'text-orange-500' : 'text-gray-400'
                    }`}
            >
                <ArrowBigUp size={isHorizontal ? 20 : 24} fill={userVote === 1 ? 'currentColor' : 'none'} />
            </button>
            <span className={`font-bold text-white ${isHorizontal ? 'text-xs min-w-[1.5rem] text-center' : 'text-sm'}`}>
                {score}
            </span>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onVote(-1)
                }}
                disabled={disabled}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${userVote === -1 ? 'text-blue-500' : 'text-gray-400'
                    }`}
            >
                <ArrowBigDown size={isHorizontal ? 20 : 24} fill={userVote === -1 ? 'currentColor' : 'none'} />
            </button>
        </div>
    )
}
