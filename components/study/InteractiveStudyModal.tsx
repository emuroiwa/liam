'use client'

import React, { useState } from 'react'

type InteractiveStudyModalProps = {
  taskId: string
  interactiveType: 'quiz' | 'flashcard' | 'reading' | 'typing'
  onClose: () => void
  onComplete: () => void
}

export default function InteractiveStudyModal({ taskId, interactiveType, onClose, onComplete }: InteractiveStudyModalProps) {
  // Simple Mock Data for interactive materials
  const [step, setStep] = useState(0)

  const renderMathQuiz = () => {
    const questions = [
      { q: "If you have 12 apples and share them equally among 3 friends, how many does each get?", options: [3, 4, 5, 6], answer: 4 },
      { q: "Share 20 sweets between 4 children. How many sweets per child?", options: [4, 5, 2, 10], answer: 5 },
      { q: "Group 15 balls into groups of 5. How many groups?", options: [2, 3, 4, 5], answer: 3 },
    ]

    if (step >= questions.length) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">Great job, Liam!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You got all the math problems right!</p>
          <button onClick={onComplete} className="btn-primary w-full py-3 rounded-xl font-bold">Claim Completion!</button>
        </div>
      )
    }

    const currentQ = questions[step]

    return (
      <div className="py-4">
        <h3 className="text-xl font-bold mb-6">{currentQ.q}</h3>
        <div className="grid grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => {
                if (opt === currentQ.answer) {
                  setStep(s => s + 1)
                } else {
                  alert("Oops, try again!")
                }
              }}
              className="py-4 bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white rounded-xl text-2xl font-bold transition-colors border-2 border-transparent hover:border-primary-dark"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderFlashcards = () => {
    const cards = [
      { xhosa: "Molo", english: "Hello" },
      { xhosa: "Unjani?", english: "How are you?" },
      { xhosa: "Ndiphilile", english: "I am fine" },
      { xhosa: "Enkosi", english: "Thank you" }
    ]
    const [flipped, setFlipped] = useState(false)

    if (step >= cards.length) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-2">Excellent!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You reviewed all your isiXhosa words.</p>
          <button onClick={onComplete} className="btn-primary w-full py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white">Complete Task</button>
        </div>
      )
    }

    const card = cards[step]

    return (
      <div className="py-4 flex flex-col items-center">
        <div 
          onClick={() => setFlipped(!flipped)}
          className="w-full h-64 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl flex items-center justify-center cursor-pointer mb-6 transition-all hover:shadow-md"
        >
          <h2 className="text-5xl font-bold text-indigo-900 dark:text-indigo-100 text-center px-4">
            {flipped ? card.english : card.xhosa}
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Tap card to flip</p>
        
        <div className="flex gap-4 w-full">
          {flipped && (
            <button 
              onClick={() => { setFlipped(false); setStep(s => s + 1); }}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl"
            >
              Next Word {'->'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
          <h2 className="text-lg font-bold text-primary dark:text-primary-light">
            {interactiveType === 'quiz' && 'Math Quiz 📝'}
            {interactiveType === 'flashcard' && 'Flashcards 🎴'}
            {interactiveType === 'reading' && 'Reading Task 📚'}
            {interactiveType === 'typing' && 'Typing Game ⌨️'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {interactiveType === 'quiz' && renderMathQuiz()}
          {interactiveType === 'flashcard' && renderFlashcards()}
          {(interactiveType === 'reading' || interactiveType === 'typing') && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-gray-500 mb-6">This interactive module is still being built.</p>
              <button onClick={onComplete} className="py-2 px-6 bg-primary text-white rounded-lg font-bold">Mark as Done anyway</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
