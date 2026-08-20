import React, { useState, useEffect } from 'react';

export function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
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

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', color: 'from-purple-500 to-pink-500' },
    { id: 'premium-requests', icon: 'fa-gem', label: 'Requests', color: 'from-purple-500 to-pink-500' },
    { id: 'stories', icon: 'fa-book', label: 'Stories', color: 'from-cyan-500 to-blue-500' },
    { id: 'create-story', icon: 'fa-plus-circle', label: 'Create Story', color: 'from-emerald-500 to-green-500' },
    { id: 'videos', icon: 'fa-video', label: 'Videos', color: 'from-red-500 to-pink-500' },
    { id: 'create-video', icon: 'fa-plus-circle', label: 'Create Video', color: 'from-rose-500 to-red-500' },
    { id: 'quizzes', icon: 'fa-puzzle-piece', label: 'Quizzes', color: 'from-indigo-500 to-purple-500' },
    { id: 'create-quiz', icon: 'fa-plus-circle', label: 'Create Quiz', color: 'from-violet-500 to-purple-500' },
    { id: 'users', icon: 'fa-users', label: 'Users', color: 'from-teal-500 to-emerald-500' },
    { id: 'user-content', icon: 'fa-user-lock', label: 'User Content', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 md:hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2.5 rounded-xl shadow-lg"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
      </button>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 h-screen bg-white shadow-2xl border-r border-gray-100/50 z-50 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        } w-64`}
      >
        {/* Logo */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-90"></div>
          <div className="relative px-3 py-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                🎮
              </div>
              <div className="flex-1">
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  GamesApp
                </h1>
                <p className="text-[10px] text-white/80">Admin Panel</p>
              </div>
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="text-white/60 hover:text-white transition-all duration-300 hover:rotate-90 p-1"
                >
                  <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-xs`}></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`group relative sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} ${
                activeTab === item.id ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300 rounded-xl`}></div>
              <div className="relative flex items-center gap-2 px-2 py-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${item.color} shadow-md transition-all duration-300 ${
                  activeTab === item.id ? 'scale-105' : ''
                }`}>
                  <i className={`fas ${item.icon} text-xs`}></i>
                </div>
                <span className={`font-medium text-xs ${
                  activeTab === item.id ? 'text-white' : 'text-gray-700'
                } transition-colors duration-300`}>
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-2 border-t border-gray-100/50">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-user text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Admin</p>
              <p className="text-[10px] text-gray-500 truncate">houssinetrabelsi6@gmail.com</p>
            </div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          </div>
        </div>
      </div>
    </>
  );
}
