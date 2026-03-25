'use client'

import React, { useState, useEffect } from 'react'
import InteractiveStudyModal from '@/components/study/InteractiveStudyModal'
import { supabase } from '@/lib/supabase'

type Task = {
  id: string
  title: string
  description: string
  type: string
  interactiveType?: 'quiz' | 'flashcard' | 'reading' | 'typing'
  interactiveContent?: any
  completed: boolean
}

type DaySchedule = {
  dayName: string
  tasks: Task[]
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudyHelperTab() {
  const [currentWeek, setCurrentWeek] = useState<number>(1)
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [schedule, setSchedule] = useState<Record<number, DaySchedule>>({})
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<{ id: string; type: 'quiz' | 'flashcard' | 'reading' | 'typing', content: any } | null>(null)

  useEffect(() => {
    const today = new Date().getDay() // 0 is Sunday, 1 is Monday...
    setCurrentDay(today)
    fetchSchedule(currentWeek)
  }, [currentWeek])

  const fetchSchedule = async (week: number) => {
    setLoading(true)
    
    // Fetch curriculum tasks for the specific week
    const { data: currTasks, error: err1 } = await supabase
      .from('curriculum_tasks')
      .select('*')
      .eq('week_number', week)
      
    // Fetch Liam's progress
    const { data: progress, error: err2 } = await supabase
      .from('task_progress')
      .select('task_id')

    if (err1 || err2) {
      console.error(err1 || err2)
      setLoading(false)
      return
    }

    const completedIds = new Set(progress?.map(p => p.task_id) || [])
    
    // Group into a weekly schedule object
    const newSchedule: Record<number, DaySchedule> = {}
    for (let i = 0; i < 7; i++) {
        newSchedule[i] = { dayName: DAYS[i], tasks: [] }
    }

    currTasks?.forEach(task => {
      const day = task.day_of_week
      if (newSchedule[day]) {
        newSchedule[day].tasks.push({
          id: task.id,
          title: task.title,
          description: task.description,
          type: task.subject,
          interactiveType: task.interactive_type,
          interactiveContent: task.interactive_content,
          completed: completedIds.has(task.id)
        })
      }
    })

    setSchedule(newSchedule)
    setLoading(false)
  }

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    // Optimistic UI update
    setSchedule(prev => {
      const newState = { ...prev }
      for (const day in newState) {
        newState[day].tasks = newState[day].tasks.map(t => 
          t.id === taskId ? { ...t, completed: !isCompleted } : t
        )
      }
      return newState
    })

    if (isCompleted) {
      // Un-complete (delete from progress)
      await supabase.from('task_progress').delete().eq('task_id', taskId)
    } else {
      // Complete (insert)
      await supabase.from('task_progress').insert({ task_id: taskId, score: 100 })
    }
  }

  const activeSchedule = schedule[currentDay];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        
        {/* Header with Week Navigation */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📚 Study Helper
          </h2>
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
            <button 
              onClick={() => setCurrentWeek(w => Math.max(1, w - 1))}
              className="text-gray-500 hover:text-primary transition-colors disabled:opacity-30"
              disabled={currentWeek === 1}
            >
              ◀
            </button>
            <span className="font-bold text-sm">Week {currentWeek}</span>
            <button 
              onClick={() => setCurrentWeek(w => Math.min(10, w + 1))}
              className="text-gray-500 hover:text-primary transition-colors disabled:opacity-30"
              disabled={currentWeek === 10}
            >
              ▶
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Term 2 Curriculum Tracker - Liam's journey!
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-indigo-500 font-bold">
            Loading Curriculum... 📚
          </div>
        ) : (
          <>
            {/* Day Selector */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-4">
              {[1, 2, 3, 4, 5, 6, 0].map(dayNum => (
                <button
                  key={dayNum}
                  onClick={() => setCurrentDay(dayNum)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    currentDay === dayNum
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {DAYS[dayNum]}
                </button>
              ))}
            </div>

            {/* Schedule View */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {activeSchedule?.dayName}&apos;s Tasks
              </h3>
              
              {activeSchedule?.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col gap-4 ${
                    task.completed 
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">
                          {task.type === 'math' ? '🧮' : ''}
                          {task.type === 'english' ? '✍️' : ''}
                          {task.type === 'xhosa' ? '🌍' : ''}
                          {task.type === 'reading' ? '📖' : ''}
                          {task.type === 'fun' ? '🎮' : ''}
                        </span>
                        <h4 className={`font-semibold ${task.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                          {task.title}
                        </h4>
                      </div>
                      <p className={`text-sm ${task.completed ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {task.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-primary hover:text-white'
                      }`}
                    >
                      {task.completed ? '✓' : ''}
                    </button>
                  </div>

                  {/* Interactive Material Placeholder */}
                  {!task.completed && task.interactiveType && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600/50">
                      <button 
                        onClick={() => setActiveTask({ id: task.id, type: task.interactiveType!, content: task.interactiveContent })}
                        className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        {task.interactiveType === 'quiz' && '📝 Start Quiz Practice'}
                        {task.interactiveType === 'flashcard' && '🎴 Study Flashcards'}
                        {task.interactiveType === 'reading' && '📚 View Assignment'}
                        {task.interactiveType === 'typing' && '⌨️  Start Typing Game'}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {activeSchedule?.tasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tasks found. Time for free play!</p>
              )}

              {activeSchedule?.tasks.every(t => t.completed) && activeSchedule.tasks.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-xl text-center shadow-inner font-bold flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl text-center block">🌟🎓🥇</span>
                  Amazing job, Liam! You finished all your tasks for today!
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {activeTask && (
        <InteractiveStudyModal 
          taskId={activeTask.id}
          interactiveType={activeTask.type}
          content={activeTask.content}
          onClose={() => setActiveTask(null)}
          onComplete={() => {
            handleToggleTask(activeTask.id, false)
            setActiveTask(null)
          }}
        />
      )}
    </div>
  )
}
