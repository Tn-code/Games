import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PremiumRequest } from './PremiumRequest';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { data: stories, loading: storiesLoading, fetchData: fetchStories } = useFirestore('stories');
  const { data: videos, loading: videosLoading, fetchData: fetchVideos } = useFirestore('videos');
  const { data: quizzes, loading: quizzesLoading, fetchData: fetchQuizzes } = useFirestore('quizzes');
  const { data: users, loading: usersLoading, fetchData: fetchUsers } = useFirestore('users');
  
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumType, setPremiumType] = useState('story');
  const [viewingStory, setViewingStory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data every 10 seconds to check for approvals
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
      fetchStories();
      fetchVideos();
      fetchQuizzes();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (storiesLoading || videosLoading || quizzesLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  // Get current user from Firestore
  const currentUserData = users.find(u => u.uid === user?.uid);

  // Check if user has access to content
  const hasAccess = (itemId, type) => {
    const unlocked = currentUserData?.unlockedContent || [];
    return unlocked.some(item => item.id === itemId && item.type === type);
  };

  const handlePremiumRequest = (item, type) => {
    setSelectedItem(item);
    setPremiumType(type);
    setShowPremiumModal(true);
  };

  const handleViewContent = (item, type) => {
    if (item.type === 'premium' && !hasAccess(item.id, type)) {
      handlePremiumRequest(item, type);
      return;
    }
    
    if (type === 'story') {
      setViewingStory(item);
    }
  };

  const renderContent = (items, type, icon, color) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <i className={`fas ${icon} text-6xl text-gray-300 mb-4`}></i>
          <p className="text-gray-500">No {type}s available yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isLocked = item.type === 'premium' && !hasAccess(item.id, type);
          const isUnlocked = item.type === 'premium' && hasAccess(item.id, type);
          
          return (
            <div key={item.id} className={`border rounded-2xl overflow-hidden hover:shadow-xl transition-all ${
              isLocked ? 'opacity-75' : ''
            }`}>
              <div className="relative">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name || item.title} className="w-full h-48 object-cover" />
                )}
                {!item.imageUrl && (
                  <div className={`w-full h-48 ${color} flex items-center justify-center text-6xl`}>
                    <i className={`fas ${icon}`}></i>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.type === 'premium' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Premium
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                      🔒 Locked
                    </span>
                  )}
                  {isUnlocked && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                      ✅ Unlocked
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{item.name || item.title}</h3>
                <p className="text-sm text-gray-500">{item.nameArabic || item.titleArabic}</p>
                <button
                  onClick={() => handleViewContent(item, type)}
                  className={`mt-3 w-full py-2 rounded-xl font-medium transition-all ${
                    isLocked
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                      : isUnlocked
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLocked ? '⭐ Request Premium' : isUnlocked ? '✅ Access Granted' : type === 'story' ? '📖 Read' : '▶️ Watch'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-4 border-purple-400 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform rotate-3">
                🎮
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  GamesApp
                </h1>
                <p className="text-xs text-gray-500">Fun for all ages!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full px-3 py-1">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700 transition-all">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'stories'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mr-2">📚</span>
            Stories
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mr-2">🎬</span>
            Videos
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'quizzes'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mr-2">🧩</span>
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mr-2">📂</span>
            My Library
            {currentUserData?.unlockedContent?.length > 0 && (
              <span className="ml-2 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs">
                {currentUserData.unlockedContent.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          {activeTab === 'stories' && renderContent(stories, 'story', 'fa-book', 'bg-blue-100')}
          {activeTab === 'videos' && renderContent(videos, 'video', 'fa-video', 'bg-red-100')}
          {activeTab === 'quizzes' && renderContent(quizzes, 'quiz', 'fa-puzzle-piece', 'bg-purple-100')}
          {activeTab === 'library' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 My Library</h2>
              {currentUserData?.unlockedContent?.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Your library is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Request premium content to build your library!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUserData?.unlockedContent.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center text-2xl">
                          {item.type === 'story' && '📚'}
                          {item.type === 'video' && '🎬'}
                          {item.type === 'quiz' && '🧩'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span><i className="fas fa-check-circle text-green-500 mr-1"></i> Unlocked</span>
                        <span>• {new Date(item.grantedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Premium Request Modal */}
      {showPremiumModal && (
        <PremiumRequest
          item={selectedItem}
          type={premiumType}
          onClose={() => {
            setShowPremiumModal(false);
            setSelectedItem(null);
            // Refresh data after modal closes
            fetchUsers();
            fetchStories();
            fetchVideos();
            fetchQuizzes();
          }}
        />
      )}

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{viewingStory.name}</h2>
                <p className="text-gray-500">{viewingStory.nameArabic}</p>
              </div>
              <button onClick={() => setViewingStory(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            {viewingStory.imageUrl && (
              <img src={viewingStory.imageUrl} alt={viewingStory.name} className="w-full h-64 object-cover rounded-2xl mb-4" />
            )}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap text-lg">{viewingStory.content}</p>
              <p className="text-gray-600 mt-4 whitespace-pre-wrap text-lg" dir="rtl">{viewingStory.contentArabic}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
