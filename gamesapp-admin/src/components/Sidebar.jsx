import React from 'react';

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'premium-requests', icon: 'fa-gem', label: 'Premium Requests' },
    { id: 'fix-unlock', icon: 'fa-unlock', label: 'Fix Unlock' },
    { id: 'stories', icon: 'fa-book', label: 'Stories' },
    { id: 'create-story', icon: 'fa-plus-circle', label: 'Create Story' },
    { id: 'videos', icon: 'fa-video', label: 'Video Stories' },
    { id: 'create-video', icon: 'fa-plus-circle', label: 'Create Video' },
    { id: 'quizzes', icon: 'fa-puzzle-piece', label: 'Quizzes' },
    { id: 'create-quiz', icon: 'fa-plus-circle', label: 'Create Quiz' },
    { id: 'users', icon: 'fa-users', label: 'User Management' },
    { id: 'user-content', icon: 'fa-user-lock', label: 'User Content' },
    { id: 'sync-users', icon: 'fa-sync', label: 'Sync Users' },
  ];

  return (
    <div className="w-64 bg-white h-screen sticky top-0 border-r border-gray-100 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
          🎮
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            GamesApp
          </h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
            <i className="fas fa-user"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">houssinetrabelsi6@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
