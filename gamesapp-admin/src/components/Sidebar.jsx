import React from 'react';

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'stories', icon: 'fa-book', label: 'Stories' },
    { id: 'create-story', icon: 'fa-plus-circle', label: 'Create Story' },
    { id: 'quizzes', icon: 'fa-puzzle-piece', label: 'Quizzes' },
    { id: 'create-quiz', icon: 'fa-plus-circle', label: 'Create Quiz' },
    { id: 'users', icon: 'fa-users', label: 'User Management' },
  ];

  return (
    <div className="w-64 bg-white h-screen sticky top-0 border-r border-gray-100 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <i className="fas fa-gamepad text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">GamesApp</h1>
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
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50">
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
            <i className="fas fa-user"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">admin@gamesapp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
