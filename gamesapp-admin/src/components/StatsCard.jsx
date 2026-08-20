import React from 'react';

export function StatsCard({ icon, title, value, color = 'blue', subtitle }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${colors[color]}`}>
          <i className={`fas fa-${icon} text-lg sm:text-xl ${iconColors[color]}`}></i>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mt-1">{title}</h3>
      {subtitle && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
