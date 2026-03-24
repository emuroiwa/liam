'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

type Category = 'Active' | 'Creative' | 'Outdoor' | 'Learning'

type Activity = {
  id: number
  name: string
  category: Category
  pts: number
  emoji: string
}

const activities: Activity[] = [
  // Active
  { id: 1, name: 'Dance battle in the lounge', category: 'Active', pts: 0, emoji: '💃' },
  { id: 2, name: 'Obstacle course outside', category: 'Active', pts: 0, emoji: '🏃' },
  { id: 3, name: 'Hula hoop challenge', category: 'Active', pts: 0, emoji: '⭕' },
  { id: 4, name: 'Jump rope 50 times', category: 'Active', pts: 0, emoji: '🪢' },
  { id: 5, name: 'Chore sprint (timed)', category: 'Active', pts: 2, emoji: '🧹' },
  // Creative
  { id: 6, name: 'Draw a comic strip', category: 'Creative', pts: 3, emoji: '🎨' },
  { id: 7, name: 'Build something with LEGO', category: 'Creative', pts: 0, emoji: '🧱' },
  { id: 8, name: 'Write a short story', category: 'Creative', pts: 0, emoji: '✏️' },
  { id: 9, name: 'Design your dream bedroom', category: 'Creative', pts: 0, emoji: '🛋️' },
  // Outdoor
  { id: 10, name: 'Plant something in the garden', category: 'Outdoor', pts: 2, emoji: '🌱' },
  { id: 11, name: 'Collect 10 different leaves', category: 'Outdoor', pts: 0, emoji: '🍃' },
  { id: 12, name: 'Draw the street from outside', category: 'Outdoor', pts: 0, emoji: '🏠' },
  // Learning
  { id: 13, name: 'isiXhosa flashcards (10 words)', category: 'Learning', pts: 3, emoji: '📚' },
  { id: 14, name: 'Times tables drill (5 min)', category: 'Learning', pts: 3, emoji: '🔢' },
  { id: 15, name: 'Bag packed for tomorrow', category: 'Learning', pts: 2, emoji: '🎒' },
  { id: 16, name: 'Read for 15 min', category: 'Learning', pts: 0, emoji: '📖' },
  { id: 17, name: 'Teach Mum/Dad one new fact', category: 'Learning', pts: 0, emoji: '🧠' },
]

const categoryColors: Record<Category, { bg: string; text: string; badge: string }> = {
  Active: { bg: 'bg-orange-50', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700' },
  Creative: { bg: 'bg-pink-50', text: 'text-pink-800', badge: 'bg-pink-100 text-pink-700' },
  Outdoor: { bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-100 text-green-700' },
  Learning: { bg: 'bg-blue-50', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-700' },
}

const encouragements = [
  "Let's go! Have fun! 🎉",
  "You've got this! 💪",
  "Challenge accepted! 🚀",
  "Adventure awaits! 🌟",
  "Go for it! 🎯",
  "That sounds awesome! 😄",
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function BoredomBusterTab() {
  const [visible, setVisible] = useState<Activity[]>(() => shuffle(activities).slice(0, 8))
  const [feedback, setFeedback] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState<number | null>(null)

  const handleShuffle = useCallback(() => {
    setVisible(shuffle(activities).slice(0, 8))
    setFeedback({})
  }, [])

  const handleActivityClick = async (activity: Activity) => {
    if (activity.pts > 0) {
      const ok = window.confirm(`Add +${activity.pts} pts for "${activity.name}"?`)
      if (!ok) return

      setSubmitting(activity.id)
      try {
        const { error } = await supabase.from('points_log').insert({
          points: activity.pts,
          label: activity.name,
          type: 'earn',
        })
        if (error) throw error
        setFeedback((prev) => ({ ...prev, [activity.id]: `+${activity.pts} pts added! 🎉` }))
        setTimeout(() => {
          setFeedback((prev) => {
            const next = { ...prev }
            delete next[activity.id]
            return next
          })
        }, 2500)
      } catch (err: unknown) {
        alert(`Error: ${err instanceof Error ? err.message : 'Failed to add points'}`)
      } finally {
        setSubmitting(null)
      }
    } else {
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)]
      setFeedback((prev) => ({ ...prev, [activity.id]: msg }))
      setTimeout(() => {
        setFeedback((prev) => {
          const next = { ...prev }
          delete next[activity.id]
          return next
        })
      }, 2500)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Boredom Buster</h2>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors active:scale-95 transform"
        >
          🔀 Shuffle
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Tap an activity to do it. Activities with points will add to your total!
      </p>

      <div className="grid grid-cols-2 gap-3">
        {visible.map((activity) => {
          const colors = categoryColors[activity.category]
          const isBusy = submitting === activity.id
          const msg = feedback[activity.id]

          return (
            <button
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              disabled={isBusy}
              className={`${colors.bg} rounded-2xl p-4 text-left transition-transform active:scale-95 transform min-h-[120px] flex flex-col gap-2 shadow-sm border border-white disabled:opacity-60`}
            >
              <span className="text-3xl">{activity.emoji}</span>

              <div className="flex-1">
                <p className={`text-sm font-semibold leading-tight ${colors.text}`}>
                  {activity.name}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {activity.category}
                </span>
                {activity.pts > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-earn-bg text-earn-text">
                    +{activity.pts} pts
                  </span>
                )}
              </div>

              {msg && (
                <div className="text-xs font-semibold text-center w-full py-1 bg-white/70 rounded-lg text-gray-700 animate-pulse">
                  {msg}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-center text-gray-400 pb-4">
        Showing 8 of {activities.length} activities — shuffle for more!
      </p>
    </div>
  )
}
