'use client'

import React, { useState, useEffect } from 'react'

type InteractiveStudyModalProps = {
  taskId: string
  interactiveType: 'quiz' | 'flashcard' | 'reading' | 'typing'
  content?: any
  onClose: () => void
  onComplete: () => void
}

export default function InteractiveStudyModal({ taskId, interactiveType, content, onClose, onComplete }: InteractiveStudyModalProps) {
  const [step, setStep] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Text to Speech helper
  const speak = (text: string, lang: string = 'en-ZA') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      
      // Try to find a local voice that fits the language
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.includes(lang) || v.lang.includes('en'))
      if (voice) utterance.voice = voice

      window.speechSynthesis.speak(utterance)
    }
  }

  // Play a success sound
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime) // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1) // C6
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.3)
    } catch (e) {
      console.error("Audio API not supported")
    }
  }

  const playErrorSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.2)
    } catch(e) {}
  }

  const renderMathQuiz = () => {
    // Fallback to mock if content is missing
    const questions = content?.questions || [
      { q: "If you have 12 apples and share them equally among 3 friends, how many does each get?", options: [3, 4, 5, 6], answer: 4 }
    ]

    if (step >= questions.length) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">Great job, Liam!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You finished the quiz!</p>
          <button onClick={() => { playSuccessSound(); speak("Great job! You finished the quiz."); onComplete(); }} className="btn-primary w-full py-3 rounded-xl font-bold">Claim Completion!</button>
        </div>
      )
    }

    const currentQ = questions[step]

    return (
      <div className="py-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold flex-1 text-gray-800 dark:text-white">{currentQ.q}</h3>
          <button 
            onClick={() => speak(currentQ.q, 'en-ZA')}
            className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-200"
            title="Read out loud"
          >
            🔊
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {currentQ.options.map((opt: any, i: number) => (
            <button 
              key={i}
              onClick={() => {
                if (opt === currentQ.answer) {
                  playSuccessSound()
                  speak("Correct! well done!")
                  setStep(s => s + 1)
                } else {
                  playErrorSound()
                  speak("Oops, try again!")
                  // Quick visual feedback instead of an alert
                  alert("Oops, try again!")
                }
              }}
              className="py-4 bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white rounded-xl text-2xl font-bold text-gray-800 dark:text-white transition-colors border-2 border-transparent hover:border-primary-dark"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderFlashcards = () => {
    const cards = content?.cards || [
      { xhosa: "Molo", english: "Hello" }
    ]

    if (step >= cards.length) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-2">Excellent!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You reviewed all your words.</p>
          <button onClick={() => { playSuccessSound(); speak("Excellent!"); onComplete(); }} className="btn-primary w-full py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white">Complete Task</button>
        </div>
      )
    }

    const card = cards[step]

    return (
      <div className="py-4 flex flex-col items-center">
        <div className="w-full flex justify-end mb-2">
           <button 
            onClick={(e) => {
              e.stopPropagation()
              speak(flipped ? card.english : card.xhosa, flipped ? 'en-ZA' : 'xh-ZA')
            }}
            className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-200"
            title="Read out loud"
          >
            🔊
          </button>
        </div>
        <div 
          onClick={() => {
            const nextFlipped = !flipped
            setFlipped(nextFlipped)
            if (nextFlipped) {
                // If flipping to english, read english
                speak(card.english, 'en-ZA')
            } else {
                // Flipping back to xhosa, read xhosa
                speak(card.xhosa, 'xh-ZA')
            }
          }}
          className="w-full h-64 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl flex items-center justify-center cursor-pointer mb-6 transition-all hover:shadow-md relative"
        >
          <h2 className="text-5xl font-bold text-indigo-900 dark:text-indigo-100 text-center px-4">
            {flipped ? card.english : card.xhosa}
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Tap card to flip</p>
        
        <div className="flex gap-4 w-full">
          {flipped && (
            <button 
              onClick={() => { setFlipped(false); setStep(s => s + 1); playSuccessSound(); }}
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
        <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
          <h2 className="text-lg font-bold text-primary dark:text-primary-light">
            {interactiveType === 'quiz' && 'Quiz 📝'}
            {interactiveType === 'flashcard' && 'Flashcards 🎴'}
            {interactiveType === 'reading' && 'Reading Task 📚'}
            {interactiveType === 'typing' && 'Typing Game ⌨️'}
          </h2>
          <button 
            onClick={() => { 
                if ('speechSynthesis' in window) window.speechSynthesis.cancel(); 
                onClose(); 
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

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
