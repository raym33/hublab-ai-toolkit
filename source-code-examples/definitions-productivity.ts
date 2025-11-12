/**
 * Productivity & Task Management Capsules
 * NEW category with components for productivity tools and task management
 */

import { CapsuleDefinition } from './types';

export const PRODUCTIVITY_CAPSULES: CapsuleDefinition[] = [
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Productivity timer with work/break intervals',
    category: 'ui',
    props: [
      {
        name: 'workDuration',
        type: 'number',
        required: false,
        default: 25,
        description: 'Work duration in minutes'
      },
      {
        name: 'breakDuration',
        type: 'number',
        required: false,
        default: 5,
        description: 'Break duration in minutes'
      },
      {
        name: 'onComplete',
        type: 'object',
        required: false,
        description: 'Callback when timer completes'
      }
    ],
    code: `
import { useState, useEffect } from 'react';

export function PomodoroTimer({ workDuration = 25, breakDuration = 5, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          onComplete?.();
          setIsBreak(!isBreak);
          return isBreak ? workDuration * 60 : breakDuration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={\`rounded-2xl p-8 text-center \${
      isBreak ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
    }\`}>
      <h2 className="text-white text-2xl font-bold mb-4">
        {isBreak ? '☕ Break Time' : '🍅 Focus Time'}
      </h2>
      <div className="text-white text-7xl font-mono font-bold mb-8">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setTimeLeft(workDuration * 60);
            setIsRunning(false);
            setIsBreak(false);
          }}
          className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Visual habit tracking calendar with streak counter',
    category: 'ui',
    props: [
      {
        name: 'habitName',
        type: 'string',
        required: true,
        description: 'Name of the habit'
      },
      {
        name: 'completedDates',
        type: 'array',
        required: true,
        description: 'Array of completed dates'
      },
      {
        name: 'currentStreak',
        type: 'number',
        required: false,
        description: 'Current streak count'
      },
      {
        name: 'onToggleDay',
        type: 'object',
        required: false,
        description: 'Callback when day is toggled'
      }
    ],
    code: `
export function HabitTracker({ habitName, completedDates, currentStreak, onToggleDay }) {
  const getDaysInMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);
  const today = new Date().getDate();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{habitName}</h3>
        {currentStreak !== undefined && (
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">🔥</div>
            <div className="text-sm text-gray-600">{currentStreak} day streak</div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const isCompleted = completedDates.includes(day);
          const isToday = day === today;

          return (
            <button
              key={day}
              onClick={() => onToggleDay?.(day)}
              className={\`aspect-square rounded-lg font-semibold transition \${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isToday
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }\`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>{completedDates.length} / {days.length} days completed</span>
        <span>{Math.round((completedDates.length / days.length) * 100)}%</span>
      </div>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'notes-editor',
    name: 'Quick Notes Editor',
    description: 'Simple rich text editor for quick notes',
    category: 'ui',
    props: [
      {
        name: 'initialContent',
        type: 'string',
        required: false,
        description: 'Initial note content'
      },
      {
        name: 'onSave',
        type: 'object',
        required: false,
        description: 'Callback when note is saved'
      },
      {
        name: 'autoSave',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable auto-save'
      }
    ],
    code: `
import { useState, useEffect } from 'react';

export function NotesEditor({ initialContent = '', onSave, autoSave = true }) {
  const [content, setContent] = useState(initialContent);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (!autoSave) return;

    const timer = setTimeout(() => {
      if (content !== initialContent) {
        onSave?.(content);
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, autoSave]);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="border-b border-gray-200 p-3 flex gap-2">
        <button
          onClick={() => handleFormat('bold')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => handleFormat('underline')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="border-l border-gray-300 mx-2"></div>
        <button
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bullet List"
        >
          • List
        </button>
        <div className="flex-1"></div>
        {lastSaved && (
          <span className="text-xs text-gray-500 self-center">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div
        contentEditable
        onInput={(e) => setContent(e.target.innerHTML)}
        className="p-6 min-h-[300px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'time-tracking-widget',
    name: 'Time Tracking Widget',
    description: 'Track time spent on tasks with start/stop timer',
    category: 'ui',
    props: [
      {
        name: 'taskName',
        type: 'string',
        required: false,
        description: 'Current task name'
      },
      {
        name: 'onComplete',
        type: 'object',
        required: false,
        description: 'Callback when task is completed'
      }
    ],
    code: `
import { useState, useEffect } from 'react';

export function TimeTrackingWidget({ taskName: initialTask, onComplete }) {
  const [taskName, setTaskName] = useState(initialTask || '');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const handleComplete = () => {
    setIsRunning(false);
    onComplete?.({ taskName, duration: seconds });
    setSeconds(0);
    setTaskName('');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">⏱️ Time Tracker</h3>

      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="What are you working on?"
        className="w-full px-4 py-2 rounded-lg text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-white"
        disabled={isRunning}
      />

      <div className="text-6xl font-mono font-bold text-center mb-6">
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:
        {String(secs).padStart(2, '0')}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={!taskName}
          className="flex-1 bg-white text-indigo-600 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 transition"
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        {seconds > 0 && (
          <button
            onClick={handleComplete}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            ✓ Complete
          </button>
        )}
      </div>
    </div>
  );
}`,
    dependencies: [],
  },
  {
    id: 'goal-progress-card',
    name: 'Goal Progress Card',
    description: 'Visual goal tracker with milestones',
    category: 'ui',
    props: [
      {
        name: 'goalName',
        type: 'string',
        required: true,
        description: 'Name of the goal'
      },
      {
        name: 'current',
        type: 'number',
        required: true,
        description: 'Current progress value'
      },
      {
        name: 'target',
        type: 'number',
        required: true,
        description: 'Target value'
      },
      {
        name: 'unit',
        type: 'string',
        required: false,
        default: 'units',
        description: 'Unit of measurement'
      },
      {
        name: 'deadline',
        type: 'string',
        required: false,
        description: 'Goal deadline'
      }
    ],
    code: `
export function GoalProgressCard({ goalName, current, target, unit = 'units', deadline }) {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{goalName}</h3>
          {deadline && (
            <p className="text-sm text-gray-500">Due: {deadline}</p>
          )}
        </div>
        {isComplete && (
          <span className="text-3xl">🎯</span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{current} {unit}</span>
          <span>{target} {unit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={\`h-4 rounded-full transition-all duration-500 \${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }\`}
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(progress)}%
          </p>
          <p className="text-sm text-gray-500">Complete</p>
        </div>
        {!isComplete && (
          <p className="text-sm text-gray-600">
            {target - current} {unit} to go
          </p>
        )}
      </div>

      {isComplete && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-semibold">
          🎉 Goal Achieved!
        </div>
      )}
    </div>
  );
}`,
    dependencies: [],
  }
];
