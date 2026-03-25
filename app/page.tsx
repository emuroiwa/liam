'use client'

import { useState } from 'react'
import RulesTab from '@/components/tabs/RulesTab'
import PointsTab from '@/components/tabs/PointsTab'
import RewardsTab from '@/components/tabs/RewardsTab'
import BoredomBusterTab from '@/components/tabs/BoredomBusterTab'

type Tab = 'rules' | 'tracker' | 'rewards' | 'buster'

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'rules', label: 'Rules', emoji: '📋' },
  { id: 'tracker', label: 'Tracker', emoji: '⭐' },
  { id: 'rewards', label: 'Rewards', emoji: '🎁' },
  { id: 'buster', label: 'I am bored', emoji: '🎲' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('tracker')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Fixed header */}
      <header className="sticky top-0 z-30 bg-primary text-white shadow-md">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">Liam&apos;s Reward Tracker</h1>
          <span className="text-2xl">⭐</span>
        </div>

        {/* Tab bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-lg mx-auto flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-8">
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'tracker' && <PointsTab />}
        {activeTab === 'rewards' && <RewardsTab />}
        {activeTab === 'buster' && <BoredomBusterTab />}
      </main>
    </div>
  )
}
