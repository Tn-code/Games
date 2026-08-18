import React from 'react';

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', color: 'from-purple-500 to-pink-500' },
    { id: 'premium-requests', icon: 'fa-gem', label: 'Premium Requests', color: 'from-purple-500 to-pink-500' },
    { id: 'stories', icon: 'fa-book', label: 'Stories', color: 'from-cyan-500 to-blue-500' },
    { id: 'create-story', icon: 'fa-plus-circle', label: 'Create Story', color: 'from-emerald-500 to-green-500' },
    { id: 'videos', icon: 'fa-video', label: 'Video Stories', color: 'from-red-500 to-pink-500' },
    { id: 'create-video', icon: 'fa-plus-circle', label: 'Create Video', color: 'from-rose-500 to-red-500' },
    { id: 'quizzes', icon: 'fa-puzzle-piece', label: 'Quizzes', color: 'from-indigo-500 to-purple-500' },
    { id: 'create-quiz', icon: 'fa-plus-circle', label: 'Create Quiz', color: 'from-violet-500 to-purple-500' },
    { id: 'users', icon: 'fa-users', label: 'User Management', color: 'from-teal-500 to-emerald-500' },
    { id: 'user-content', icon: 'fa-user-lock', label: 'User Content', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="w-64 bg-white h-screen sticky top-0 border-r border-gray-100 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg floating">
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
            className={`group relative sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} ${
              activeTab === item.id ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 rounded-xl`}></div>
            <div className="relative flex items-center gap-3 px-3 py-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${item.color} shadow-md group-hover:scale-110 transition-all duration-300 ${
                activeTab === item.id ? 'scale-110' : ''
              }`}>
                <i className={`fas ${item.icon} text-sm`}></i>
              </div>
              <span className={`font-medium text-sm ${
                activeTab === item.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
              } transition-colors duration-300`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-8 bg-white rounded-full shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100/50">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg floating">
              <i className="fas fa-user"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">houssinetrabelsi6@gmail.com</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
