/**
 * Gaming & Gamification Capsules
 * NEW category with components for gaming interfaces and gamification features
 */

import { CapsuleDefinition } from './types';

export const GAMING_CAPSULES: CapsuleDefinition[] = [
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Ranking list with positions, scores, and user avatars',
    category: 'ui',
    props: [
      {
        name: 'entries',
        type: 'array',
        required: true,
        default: [],
        description: 'Array of leaderboard entries with rank, name, score, avatar'
      },
      {
        name: 'currentUserId',
        type: 'string',
        required: false,
        description: 'Highlight the current user entry'
      },
      {
        name: 'showTopOnly',
        type: 'number',
        required: false,
        default: 10,
        description: 'Number of top entries to show'
      }
    ],
    code: `
export function Leaderboard({ entries, currentUserId, showTopOnly = 10 }) {
  const displayEntries = entries.slice(0, showTopOnly);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>🏆</span> Leaderboard
      </h2>
      <div className="space-y-3">
        {displayEntries.map((entry, index) => (
          <div
            key={entry.id}
            className={\`flex items-center gap-4 p-4 rounded-lg transition \${
              entry.id === currentUserId ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
            }\`}
          >
            <div className="w-10 h-10 flex items-center justify-center font-bold text-lg">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && \`#\${index + 1}\`}
            </div>
            <img src={entry.avatar} alt={entry.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">{entry.name}</p>
              <p className="text-sm text-gray-500">{entry.score.toLocaleString()} points</p>
            </div>
            {entry.id === currentUserId && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    dependencies: [],
    preview: 'https://example.com/previews/leaderboard.png'
  },
  {
    id: 'achievement-badge',
    name: 'Achievement Badge',
    description: 'Achievement/trophy display with unlock animation',
    category: 'ui',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Achievement title'
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Achievement description'
      },
      {
        name: 'icon',
        type: 'string',
        required: true,
        description: 'Achievement icon (emoji or URL)'
      },
      {
        name: 'unlocked',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether the achievement is unlocked'
      },
      {
        name: 'progress',
        type: 'number',
        required: false,
        description: 'Progress towards unlocking (0-100)'
      }
    ],
    code: `
export function AchievementBadge({ title, description, icon, unlocked = false, progress }) {
  return (
    <div className={\`relative p-6 rounded-xl border-2 transition \${
      unlocked ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400' : 'bg-gray-100 border-gray-300 opacity-60'
    }\`}>
      <div className="flex items-start gap-4">
        <div className={\`text-5xl \${unlocked ? 'animate-bounce' : 'grayscale'}\`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          {!unlocked && typeof progress === 'number' && (
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: \`\${progress}%\` }}
              />
            </div>
          )}
          {unlocked && (
            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Unlocked!</span>
          )}
        </div>
      </div>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'level-progress',
    name: 'Level Progress',
    description: 'XP bar with level and progress towards next level',
    category: 'ui',
    props: [
      {
        name: 'currentLevel',
        type: 'number',
        required: true,
        description: 'Current level'
      },
      {
        name: 'currentXP',
        type: 'number',
        required: true,
        description: 'Current XP'
      },
      {
        name: 'xpForNextLevel',
        type: 'number',
        required: true,
        description: 'XP required for next level'
      }
    ],
    code: `
export function LevelProgress({ currentLevel, currentXP, xpForNextLevel }) {
  const progress = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Level</p>
          <p className="text-3xl font-bold text-blue-600">{currentLevel}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Next Level</p>
          <p className="text-xl font-semibold">{currentLevel + 1}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: \`\${progress}%\` }}
        >
          <span className="text-xs text-white font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
      </p>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'daily-quest',
    name: 'Daily Quest Card',
    description: 'Quest/mission card with objectives and rewards',
    category: 'ui',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Quest title'
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Quest description'
      },
      {
        name: 'objectives',
        type: 'array',
        required: true,
        description: 'Array of objectives with completed status'
      },
      {
        name: 'reward',
        type: 'object',
        required: true,
        description: 'Reward object with type and amount'
      },
      {
        name: 'timeLeft',
        type: 'string',
        required: false,
        description: 'Time remaining to complete'
      }
    ],
    code: `
export function DailyQuest({ title, description, objectives, reward, timeLeft }) {
  const completed = objectives.every(obj => obj.completed);
  const progress = (objectives.filter(obj => obj.completed).length / objectives.length) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-purple-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {timeLeft && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
            ⏰ {timeLeft}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {objectives.map((objective, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={objective.completed}
              readOnly
              className="w-5 h-5 text-purple-600"
            />
            <span className={\`text-sm \${objective.completed ? 'line-through text-gray-500' : ''}\`}>
              {objective.text}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all"
          style={{ width: \`\${progress}%\` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{reward.icon}</span>
          <span className="font-semibold">{reward.amount} {reward.type}</span>
        </div>
        <button
          disabled={!completed}
          className={\`px-4 py-2 rounded-lg font-semibold transition \${
            completed ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }\`}
        >
          {completed ? 'Claim Reward' : 'In Progress'}
        </button>
      </div>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'inventory-grid',
    name: 'Inventory Grid',
    description: 'Item inventory grid with drag & drop support',
    category: 'ui',
    props: [
      {
        name: 'items',
        type: 'array',
        required: true,
        description: 'Array of inventory items'
      },
      {
        name: 'gridSize',
        type: 'number',
        required: false,
        default: 6,
        description: 'Number of slots per row'
      },
      {
        name: 'onItemClick',
        type: 'object',
        required: false,
        description: 'Callback when item is clicked'
      }
    ],
    code: `
export function InventoryGrid({ items, gridSize = 6, onItemClick }) {
  const totalSlots = gridSize * Math.ceil(items.length / gridSize);
  const slots = Array.from({ length: totalSlots }, (_, i) => items[i] || null);

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <span>🎒</span> Inventory ({items.length}/{totalSlots})
      </h3>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: \`repeat(\${gridSize}, 1fr)\` }}
      >
        {slots.map((item, index) => (
          <div
            key={index}
            onClick={() => item && onItemClick?.(item)}
            className={\`aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer transition \${
              item ? 'bg-gray-700 border-gray-600 hover:border-blue-500' : 'bg-gray-900 border-gray-800'
            }\`}
          >
            {item && (
              <div className="text-center p-2">
                <div className="text-3xl mb-1">{item.icon}</div>
                <p className="text-xs text-white font-semibold truncate">{item.name}</p>
                {item.quantity > 1 && (
                  <span className="text-xs bg-blue-600 text-white px-1 rounded">
                    x{item.quantity}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    dependencies: [],
  }
];
