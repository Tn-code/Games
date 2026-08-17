import React, { useState, useEffect } from 'react';

export function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'left-64' : 'left-4'
        }`}
        style={{ transition: 'left 0.3s ease' }}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 h-screen bg-white shadow-2xl border-r border-gray-100/50 z-50 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        } ${isMobile ? 'w-64' : 'w-64'}`}
      >
        {/* Logo Section with Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg floating">
                🎮
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  GamesApp
                </h1>
                <p className="text-xs text-white/80">Admin Panel</p>
              </div>
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="text-white/60 hover:text-white transition-all duration-300 hover:rotate-90"
                >
                  <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`group relative sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsOpen(false);
              }}
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

        {/* User Profile Section */}
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
    </>
  );
}
