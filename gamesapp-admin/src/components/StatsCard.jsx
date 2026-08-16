import React from 'react';

export function StatsCard({ icon, title, value, color = 'blue', subtitle }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 mt-2">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
