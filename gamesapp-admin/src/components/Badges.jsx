import React from 'react';

const badges = [
  { id: 'first_story', icon: '📖', label: 'First Story', color: 'from-blue-400 to-blue-600', condition: (stats) => stats.storiesRead >= 1 },
  { id: 'story_master', icon: '📚', label: 'Story Master', color: 'from-indigo-400 to-indigo-600', condition: (stats) => stats.storiesRead >= 10 },
  { id: 'quiz_beginner', icon: '🧩', label: 'Quiz Beginner', color: 'from-purple-400 to-purple-600', condition: (stats) => stats.quizzesCompleted >= 1 },
  { id: 'quiz_champion', icon: '🏆', label: 'Quiz Champion', color: 'from-yellow-400 to-yellow-600', condition: (stats) => stats.quizzesCompleted >= 5 },
  { id: 'video_lover', icon: '🎬', label: 'Video Lover', color: 'from-red-400 to-red-600', condition: (stats) => stats.videosWatched >= 5 },
  { id: 'premium_member', icon: '⭐', label: 'Premium Member', color: 'from-yellow-500 to-amber-500', condition: (stats) => stats.premiumUnlocked >= 1 },
  { id: 'super_learner', icon: '🎓', label: 'Super Learner', color: 'from-emerald-400 to-emerald-600', condition: (stats) => stats.totalPoints >= 100 },
  { id: 'legend', icon: '👑', label: 'Legend', color: 'from-rose-400 to-rose-600', condition: (stats) => stats.totalPoints >= 500 },
];

export function Badges({ stats }) {
  const earnedBadges = badges.filter(badge => badge.condition(stats));

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>🏅</span> Badges ({earnedBadges.length}/{badges.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {badges.map((badge) => {
          const earned = earnedBadges.some(b => b.id === badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                earned
                  ? `bg-gradient-to-br ${badge.color} text-white shadow-lg hover:scale-110`
                  : 'bg-gray-100 text-gray-400 opacity-50'
              }`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <p className="text-[10px] font-medium text-center mt-1">{badge.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
