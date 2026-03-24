'use client'

const earningRules = [
  { activity: 'Homework done unprompted', points: 5 },
  { activity: 'Reading 15 min', points: 3 },
  { activity: 'isiXhosa / writing practice', points: 3 },
  { activity: 'Maths drill', points: 3 },
  { activity: 'Bag packed night before', points: 2 },
  { activity: 'Chore unprompted', points: 2 },
  { activity: 'Bonus: teacher comment', points: 5 },
  { activity: 'Bonus: full homework week', points: 3 },
]

export default function RulesTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">The Rules</h2>

      {/* School Days */}
      <div className="card border-l-4 border-l-red-400">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🚫</span>
          <h3 className="font-bold text-gray-900">School Days (Mon–Fri)</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
            <span className="font-bold">NO</span> PlayStation
          </li>
          <li className="flex items-center gap-2 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
            <span className="font-bold">NO</span> phone
          </li>
        </ul>
      </div>

      {/* Earn Points */}
      <div className="card border-l-4 border-l-green-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✅</span>
          <h3 className="font-bold text-gray-900">Earn Points</h3>
        </div>
        <div className="bg-earn-bg rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-green-200">
                <th className="text-left px-3 py-2 text-earn-text font-semibold">Activity</th>
                <th className="text-right px-3 py-2 text-earn-text font-semibold">Points</th>
              </tr>
            </thead>
            <tbody>
              {earningRules.map((rule, i) => (
                <tr
                  key={i}
                  className={`border-b border-green-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-green-50/50'}`}
                >
                  <td className="px-3 py-2.5 text-earn-text">{rule.activity}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="font-bold text-earn-text bg-white rounded-full px-2 py-0.5 text-xs shadow-sm">
                      +{rule.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spend Points */}
      <div className="card border-l-4 border-l-primary">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎮</span>
          <h3 className="font-bold text-gray-900">Spend Points</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2.5">
            <span className="text-sm text-purple-900">1hr PlayStation (weekend)</span>
            <span className="font-bold text-primary bg-white rounded-full px-2 py-0.5 text-xs shadow-sm">
              10 pts
            </span>
          </div>
          <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2.5">
            <span className="text-sm text-purple-900">30min phone (weekend)</span>
            <span className="font-bold text-primary bg-white rounded-full px-2 py-0.5 text-xs shadow-sm">
              5 pts
            </span>
          </div>
        </div>
      </div>

      {/* Daily Caps */}
      <div className="card border-l-4 border-l-amber-400">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⏱️</span>
          <h3 className="font-bold text-gray-900">Daily Caps</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2.5">
            <span className="mt-0.5">•</span>
            Max 2hrs/day PlayStation on weekends
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2.5">
            <span className="mt-0.5">•</span>
            Max 1hr/day phone on weekends
          </li>
        </ul>
      </div>

      {/* Non-Negotiables */}
      <div className="card border-l-4 border-l-slate-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📌</span>
          <h3 className="font-bold text-gray-900">Non-Negotiables</h3>
        </div>
        <ul className="space-y-2">
          {[
            'No screens on school days',
            'Phone charges in the lounge overnight',
            'Screens off by 7:30pm',
            'Sunday study session before any weekend screens',
          ].map((rule, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2.5"
            >
              <span className="mt-0.5 text-slate-400">•</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
