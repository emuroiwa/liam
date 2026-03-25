'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type PointsLog } from '@/lib/supabase'

type Reward = {
  name: string
  cost: number
  emoji: string
}

const rewards: Reward[] = [
  { name: 'Extra 30min screen time', cost: 15, emoji: '📺' },
  { name: 'Movie night, his pick', cost: 20, emoji: '🎬' },
  { name: 'Takeaway his choice', cost: 25, emoji: '🍕' },
  { name: 'Sleepover with a friend', cost: 35, emoji: '🛏️' },
  { name: 'Day trip he chooses', cost: 55, emoji: '🗺️' },
  { name: 'New PS game', cost: 70, emoji: '🎮' },
]

export default function RewardsTab() {
  const [logs, setLogs] = useState<PointsLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('points_log')
        .select('*')
      if (error) throw error
      setLogs(data ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load points')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPoints = logs.reduce((sum, log) => sum + log.points, 0)

  const handleRedeem = async (reward: Reward) => {
    const ok = window.confirm(
      `Redeem "${reward.name}" for ${reward.cost} pts?`
    )
    if (!ok) return

    setRedeeming(reward.name)
    try {
      const { error } = await supabase.from('points_log').insert({
        points: -reward.cost,
        label: reward.name,
        type: 'spend',
      })
      if (error) throw error
      await fetchData()
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to redeem'}`)
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Loading rewards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50 text-center py-8">
        <p className="text-spend-red font-semibold mb-2">Something went wrong</p>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary text-sm px-6">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Balance banner */}
      <div className="card bg-primary text-white text-center py-5">
        <p className="text-sm font-medium opacity-80 mb-1">Current balance</p>
        <div className="text-4xl font-extrabold">⭐ {totalPoints} pts</div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reward menu</h2>

      <div className="grid grid-cols-1 gap-3">
        {rewards.map((reward) => {
          const unlocked = totalPoints >= reward.cost
          const ptsNeeded = reward.cost - totalPoints

          return (
            <div
              key={reward.name}
              className={`card flex items-center gap-4 transition-opacity ${
                !unlocked ? 'opacity-75' : ''
              }`}
            >
              <div className="text-4xl flex-shrink-0">{reward.emoji}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      unlocked
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {reward.cost} pts
                  </span>
                  {unlocked && (
                    <span className="text-xs font-semibold text-earn-text bg-earn-bg px-2 py-0.5 rounded-full">
                      Unlocked 🎉
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1 text-sm leading-snug">
                  {reward.name}
                </p>
                {!unlocked && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {ptsNeeded} more pts needed
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {unlocked ? (
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={redeeming === reward.name}
                    className="btn-primary text-sm px-4 py-2 min-h-[40px] disabled:opacity-50"
                  >
                    {redeeming === reward.name ? '...' : 'Redeem'}
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 text-xl">
                    🔒
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 pb-4">
        Redeeming a reward deducts points from your balance
      </p>
    </div>
  )
}
