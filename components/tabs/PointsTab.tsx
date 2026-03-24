'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type PointsLog, type WeeklyReset } from '@/lib/supabase'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const quickEarnButtons = [
  { label: 'Homework', pts: 5, emoji: '📚' },
  { label: 'Reading', pts: 3, emoji: '📖' },
  { label: 'isiXhosa', pts: 3, emoji: '🗣️' },
  { label: 'Maths', pts: 3, emoji: '🔢' },
  { label: 'Bag packed', pts: 2, emoji: '🎒' },
  { label: 'Chore', pts: 2, emoji: '🧹' },
  { label: 'Bonus ⭐', pts: 5, emoji: '🌟' },
  { label: 'Bonus Week', pts: 3, emoji: '🏆' },
]

const quickSpendButtons = [
  { label: 'PS5 1hr', pts: -10, emoji: '🎮' },
  { label: 'Phone 30min', pts: -5, emoji: '📱' },
]

function getMondayOfCurrentWeek(): Date {
  const now = new Date()
  const day = now.getDay() // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getWeekStart(resets: WeeklyReset[]): Date {
  const monday = getMondayOfCurrentWeek()
  if (resets.length === 0) return monday

  const latestReset = new Date(
    Math.max(...resets.map((r) => new Date(r.reset_at).getTime()))
  )

  return latestReset > monday ? latestReset : monday
}

function getDayIndex(date: Date): number {
  // Mon=0 ... Sun=6
  const d = date.getDay()
  return d === 0 ? 6 : d - 1
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function getStreak(logs: PointsLog[], weekStart: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build a set of date-keys where points were earned (net > 0)
  const dailyTotals: Record<string, number> = {}
  logs.forEach((log) => {
    const d = new Date(log.created_at)
    d.setHours(0, 0, 0, 0)
    if (d >= weekStart) {
      const key = formatDateKey(d)
      dailyTotals[key] = (dailyTotals[key] || 0) + log.points
    }
  })

  let streak = 0
  const cursor = new Date(today)

  while (true) {
    const key = formatDateKey(cursor)
    if ((dailyTotals[key] || 0) > 0) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export default function PointsTab() {
  const [logs, setLogs] = useState<PointsLog[]>([])
  const [resets, setResets] = useState<WeeklyReset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customPts, setCustomPts] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [logsRes, resetsRes] = await Promise.all([
        supabase.from('points_log').select('*').order('created_at', { ascending: false }),
        supabase.from('weekly_reset').select('*').order('reset_at', { ascending: false }),
      ])

      if (logsRes.error) throw logsRes.error
      if (resetsRes.error) throw resetsRes.error

      setLogs(logsRes.data ?? [])
      setResets(resetsRes.data ?? [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load data'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addPoints = async (pts: number, label: string, type: 'earn' | 'spend') => {
    setSubmitting(true)
    try {
      const { error } = await supabase.from('points_log').insert({
        points: pts,
        label,
        type,
      })
      if (error) throw error
      await fetchData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add points'
      alert(`Error: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickEarn = (btn: (typeof quickEarnButtons)[0]) => {
    addPoints(btn.pts, btn.label, 'earn')
  }

  const handleQuickSpend = (btn: (typeof quickSpendButtons)[0]) => {
    addPoints(btn.pts, btn.label, 'spend')
  }

  const handleCustomSubmit = async () => {
    const pts = parseInt(customPts, 10)
    if (isNaN(pts) || pts === 0) {
      alert('Enter a valid number of points (positive to earn, negative to spend)')
      return
    }
    if (!customLabel.trim()) {
      alert('Enter a label for this entry')
      return
    }
    await addPoints(pts, customLabel.trim(), pts > 0 ? 'earn' : 'spend')
    setCustomPts('')
    setCustomLabel('')
  }

  const handleResetWeek = async () => {
    const ok = window.confirm(
      'Reset the week? This marks a new weekly start — your total balance stays the same but the weekly view resets.'
    )
    if (!ok) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('weekly_reset').insert({})
      if (error) throw error
      await fetchData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset week'
      alert(`Error: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Computed values
  const totalPoints = logs.reduce((sum, log) => sum + log.points, 0)
  const weekStart = getWeekStart(resets)

  // Weekly logs (since weekStart)
  const weekLogs = logs.filter((log) => new Date(log.created_at) >= weekStart)

  // Points per day this week (Mon=0..Sun=6)
  const weekDayTotals = Array(7).fill(0) as number[]
  weekLogs.forEach((log) => {
    const idx = getDayIndex(new Date(log.created_at))
    weekDayTotals[idx] += log.points
  })

  const todayIdx = getDayIndex(new Date())

  // Progress to next milestone (every 20 pts)
  const milestone = Math.ceil((totalPoints + 1) / 20) * 20
  const ptsToMilestone = milestone - totalPoints
  const milestoneProgress = Math.min(100, ((20 - ptsToMilestone) / 20) * 100)

  // Streak
  const streak = getStreak(logs, weekStart)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your points...</p>
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
      {/* Total balance */}
      <div className="card text-center py-6">
        <div className="text-5xl font-extrabold text-primary mb-1">
          ⭐ {totalPoints}
        </div>
        <p className="text-sm text-gray-500 font-medium">Your total balance</p>

        {/* Streak */}
        <div className="mt-3">
          {streak > 0 ? (
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
              🔥 {streak} day streak
            </span>
          ) : (
            <span className="text-xs text-gray-400">Start your streak today!</span>
          )}
        </div>
      </div>

      {/* Progress to milestone */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Next milestone</span>
          <span className="text-sm font-bold text-primary">{milestone} pts</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5 text-right">
          {ptsToMilestone} pts to go
        </p>
      </div>

      {/* 7-day grid */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">This week</h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day, i) => {
            const pts = weekDayTotals[i]
            const isToday = i === todayIdx
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span
                  className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-gray-400'}`}
                >
                  {day}
                </span>
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                    ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                    ${pts > 0 ? 'bg-earn-bg text-earn-text' : pts < 0 ? 'bg-red-50 text-spend-red' : 'bg-gray-100 text-gray-400'}
                  `}
                >
                  {pts !== 0 ? (pts > 0 ? `+${pts}` : pts) : '–'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick earn buttons */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Quick earn</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickEarnButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleQuickEarn(btn)}
              disabled={submitting}
              className="btn-earn flex items-center gap-2 justify-center disabled:opacity-50"
            >
              <span>{btn.emoji}</span>
              <span>+{btn.pts} {btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spend buttons */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Spend points</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickSpendButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleQuickSpend(btn)}
              disabled={submitting}
              className="btn-spend flex items-center gap-2 justify-center disabled:opacity-50"
            >
              <span>{btn.emoji}</span>
              <span>{btn.pts} {btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom add */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">Custom entry</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Points (e.g. 4 or -4)"
            value={customPts}
            onChange={(e) => setCustomPts(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Label (e.g. 'Extra chore')"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            className="input-field"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add entry'}
          </button>
        </div>
      </div>

      {/* Recent activity */}
      {logs.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Recent activity</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {logs.slice(0, 15).map((log) => (
              <li key={log.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{log.label}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.created_at).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`text-sm font-bold ${
                    log.points > 0 ? 'text-earn-text' : 'text-spend-red'
                  }`}
                >
                  {log.points > 0 ? `+${log.points}` : log.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset week */}
      <div className="pt-2 pb-4">
        <button
          onClick={handleResetWeek}
          disabled={submitting}
          className="w-full py-3 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          🔄 Reset weekly view
        </button>
      </div>
    </div>
  )
}
