'use client'

import React, { useState, useEffect } from 'react'
import InteractiveStudyModal from '@/components/study/InteractiveStudyModal'

type Task = {
  id: string
  title: string
  description: string
  type: 'math' | 'english' | 'xhosa' | 'reading' | 'fun'
  interactiveType?: 'quiz' | 'flashcard' | 'reading' | 'typing'
  completed: boolean
}

type DaySchedule = {
  dayName: string
  tasks: Task[]
}

const initialSchedule: Record<number, DaySchedule> = {
  1: {
    dayName: 'Monday',
    tasks: [
      { id: 'mon-math', title: 'Math: Grouping & Sharing', description: 'Practice dividing items into equal groups.', type: 'math', interactiveType: 'quiz', completed: false },
      { id: 'mon-xhosa', title: 'isiXhosa Vocabulary', description: 'Review 5 new words today.', type: 'xhosa', interactiveType: 'flashcard', completed: false },
    ]
  },
  2: {
    dayName: 'Tuesday',
    tasks: [
      { id: 'tue-eng', title: 'Creative Writing', description: 'Write 3 sentences about your weekend using correct punctuation.', type: 'english', interactiveType: 'reading', completed: false },
      { id: 'tue-read', title: 'Reading Time', description: 'Read a story book for 15 minutes.', type: 'reading', completed: false },
    ]
  },
  3: {
    dayName: 'Wednesday',
    tasks: [
      { id: 'wed-math', title: 'Math Word Problems', description: 'Solve addition and subtraction word problems.', type: 'math', interactiveType: 'quiz', completed: false },
      { id: 'wed-xhosa', title: 'isiXhosa Phrases', description: 'Practice simple greetings and sentences.', type: 'xhosa', interactiveType: 'flashcard', completed: false },
    ]
  },
  4: {
    dayName: 'Thursday',
    tasks: [
      { id: 'thu-eng', title: 'Sentence Structure', description: 'Fix the mixed-up sentences.', type: 'english', interactiveType: 'quiz', completed: false },
      { id: 'thu-spell', title: 'Spelling Prep', description: 'Get ready for Friday spelling test.', type: 'english', completed: false },
    ]
  },
  5: {
    dayName: 'Friday',
    tasks: [
      { id: 'fri-fun', title: 'Coding & Robotics / Typing', description: 'Play an educational typing game or coding activity.', type: 'fun', interactiveType: 'typing', completed: false },
    ]
  },
  6: {
    dayName: 'Saturday',
    tasks: [
      { id: 'sat-rest', title: 'Rest Day!', description: 'No studying today! Relax and have fun playing.', type: 'fun', completed: false },
    ]
  },
  0: {
    dayName: 'Sunday',
    tasks: [
      { id: 'sun-math', title: 'Math Review', description: 'Quick review of the week\'s math.', type: 'math', completed: false },
      { id: 'sun-read', title: 'Story Time', description: 'Shared reading of a fun story.', type: 'reading', completed: false },
    ]
  }
}

export default function StudyHelperTab() {
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [schedule, setSchedule] = useState(initialSchedule)
  const [activeTask, setActiveTask] = useState<{ id: string; type: 'quiz' | 'flashcard' | 'reading' | 'typing' } | null>(null)

  useEffect(() => {
    // Set to today's day of the week on mount
    const today = new Date().getDay()
    setCurrentDay(today)
  }, [])

  const handleToggleTask = (dayNum: number, taskId: string) => {
    setSchedule(prev => {
      const dayData = prev[dayNum]
      const updatedTasks = dayData.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
      return { ...prev, [dayNum]: { ...dayData, tasks: updatedTasks } }
    })
  }

  const activeSchedule = schedule[currentDay];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          📚 Study Helper
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Let&apos;s get smart, Liam! Here is your plan for the week.
        </p>

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
              {schedule[dayNum].dayName}
            </button>
          ))}
        </div>

        {/* Schedule View */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {activeSchedule.dayName}&apos;s Tasks
          </h3>
          
          {activeSchedule.tasks.map(task => (
            <div 
              key={task.id} 
              className={`p-4 rounded-xl border-2 transition-all ${
                task.completed 
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-100 dark:border-gray-700 hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
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
                  onClick={() => handleToggleTask(currentDay, task.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-primary hover:text-white'
                  }`}
                >
                  {task.completed ? '✓' : ''}
                </button>
              </div>

              {/* Interactive Material Placeholder */}
              {!task.completed && task.interactiveType && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button 
                    onClick={() => setActiveTask({ id: task.id, type: task.interactiveType! })}
                    className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {task.interactiveType === 'quiz' && '📝 Start Practice'}
                    {task.interactiveType === 'flashcard' && '🎴 Study Flashcards'}
                    {task.interactiveType === 'reading' && '📚 View Assignment'}
                    {task.interactiveType === 'typing' && '⌨️  Start Typing Game'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {activeSchedule.tasks.length === 0 && (
            <p className="text-gray-500 text-center py-4">No tasks for today. Take a break!</p>
          )}

          {activeSchedule.tasks.every(t => t.completed) && activeSchedule.tasks.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-xl text-center shadow-inner font-bold flex flex-col items-center justify-center gap-2">
              <span className="text-4xl text-center block">🌟🎓🥇</span>
              Amazing job, Liam! You finished all your tasks!
            </div>
          )}
        </div>
      </div>

      {activeTask && (
        <InteractiveStudyModal 
          taskId={activeTask.id}
          interactiveType={activeTask.type}
          onClose={() => setActiveTask(null)}
          onComplete={() => {
            handleToggleTask(currentDay, activeTask.id)
            setActiveTask(null)
          }}
        />
      )}
    </div>
  )
}
