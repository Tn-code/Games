import React from 'react';
import { ProgressBar } from './ProgressBar';

export function UserProgress({ stats }) {
  const items = [
    { label: 'Stories Read', value: stats?.storiesRead || 0, total: stats?.totalStories || 10, icon: '📚' },
    { label: 'Quizzes Completed', value: stats?.quizzesCompleted || 0, total: stats?.totalQuizzes || 5, icon: '🧩' },
    { label: 'Videos Watched', value: stats?.videosWatched || 0, total: stats?.totalVideos || 8, icon: '🎬' },
    { label: 'Points Earned', value: stats?.points || 0, total: stats?.totalPoints || 1000, icon: '⭐' },
  ];

  const totalProgress = items.reduce((acc, item) => acc + ((item.value / item.total) * 100), 0) / items.length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🏆</span>
        <h3 className="text-lg font-bold text-gray-800">Your Progress</h3>
        <span className="ml-auto text-sm text-gray-500">
          {Math.round(totalProgress)}% Complete
        </span>
      </div>
      
      <ProgressBar progress={totalProgress} color="from-purple-500 to-blue-500" size="lg" />
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-lg font-bold text-gray-800">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
