import React from 'react';

const categories = [
  { id: 'all', icon: '🌟', label: 'All', color: 'from-purple-500 to-blue-500' },
  { id: 'kids', icon: '🧒', label: 'Kids', color: 'from-pink-500 to-rose-500' },
  { id: 'education', icon: '📚', label: 'Education', color: 'from-blue-500 to-cyan-500' },
  { id: 'entertainment', icon: '🎭', label: 'Entertainment', color: 'from-purple-500 to-indigo-500' },
  { id: 'story', icon: '📖', label: 'Story', color: 'from-orange-500 to-amber-500' },
  { id: 'game', icon: '🎮', label: 'Game', color: 'from-green-500 to-emerald-500' },
];

export function Categories({ selected, onSelect }) {
  return (
    <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap animate-fadeInUp">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id === selected ? null : cat.id)}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            selected === cat.id 
              ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` 
              : 'bg-white/80 backdrop-blur text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="mr-2">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
