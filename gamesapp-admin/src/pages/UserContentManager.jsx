import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function UserContentManager() {
  const { user: currentUser } = useAuth();
  const { data: users, loading: usersLoading, updateItem } = useFirestore('users');
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: videos, loading: videosLoading } = useFirestore('videos');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('stories');

  if (usersLoading || storiesLoading || videosLoading || quizzesLoading) {
    return <LoadingSpinner />;
  }

  // Filter users
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user's unlocked content
  const getUserUnlocked = (userId) => {
    const user = users.find(u => u.uid === userId);
    return user?.unlockedContent || [];
  };

  // Check if user has access to specific content
  const hasAccess = (userId, contentId, type) => {
    const unlocked = getUserUnlocked(userId);
    return unlocked.some(item => item.id === contentId && item.type === type);
  };

  // Grant access to content
  const grantAccess = async (userId, contentId, contentName, type) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;

    const unlocked = user.unlockedContent || [];
    if (unlocked.some(item => item.id === contentId && item.type === type)) {
      setMessage({ type: 'info', text: '⚠️ User already has access to this content' });
      return;
    }

    const updatedUnlocked = [
      ...unlocked,
      { id: contentId, name: contentName, type: type, grantedAt: new Date().toISOString() }
    ];

    try {
      await updateItem(user.id, { unlockedContent: updatedUnlocked });
      setMessage({ type: 'success', text: `✅ Access granted to ${contentName}` });
      // Refresh user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
  };

  // Remove access from content
  const removeAccess = async (userId, contentId, type) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;

    const unlocked = user.unlockedContent || [];
    const updatedUnlocked = unlocked.filter(item => !(item.id === contentId && item.type === type));

    try {
      await updateItem(user.id, { unlockedContent: updatedUnlocked });
      setMessage({ type: 'success', text: '✅ Access removed successfully' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
  };

  // Get all premium content
  const premiumStories = stories.filter(s => s.type === 'premium');
  const premiumVideos = videos.filter(v => v.type === 'premium');
  const premiumQuizzes = quizzes.filter(q => q.type === 'premium');

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="fas fa-user-lock text-blue-600"></i>
              User Content Manager
            </h2>
            <p className="text-gray-500 mt-1">Manage premium content access for users</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : message.type === 'info'
              ? 'bg-blue-50 border border-blue-200 text-blue-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <i className={`fas ${
              message.type === 'success' ? 'fa-check-circle' :
              message.type === 'info' ? 'fa-info-circle' :
              'fa-exclamation-circle'
            }`}></i>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 max-h-[600px] overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedUser?.uid === user.uid 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="text-xs">
                      {user.isAdmin && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Admin</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Management */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                    {selectedUser.displayName?.[0] || selectedUser.email?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedUser.displayName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    <p className="text-xs text-gray-400">UID: {selectedUser.uid?.substring(0, 12)}...</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('stories')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'stories'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <i className="fas fa-book mr-2"></i>Stories
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'videos'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <i className="fas fa-video mr-2"></i>Videos
                  </button>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'quizzes'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <i className="fas fa-puzzle-piece mr-2"></i>Quizzes
                  </button>
                </div>

                {/* Content List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {activeTab === 'stories' && (
                    <div className="space-y-2">
                      {premiumStories.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No premium stories available</p>
                      ) : (
                        premiumStories.map((story) => {
                          const hasAccess_ = hasAccess(selectedUser.uid, story.id, 'story');
                          return (
                            <div key={story.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                                  <img src={story.imageUrl} alt={story.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{story.name}</p>
                                  <p className="text-xs text-gray-500">{story.nameArabic}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  hasAccess_ ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {hasAccess_ ? '✅ Unlocked' : '🔒 Locked'}
                                </span>
                                {hasAccess_ ? (
                                  <button
                                    onClick={() => removeAccess(selectedUser.uid, story.id, 'story')}
                                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => grantAccess(selectedUser.uid, story.id, story.name, 'story')}
                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Grant
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTab === 'videos' && (
                    <div className="space-y-2">
                      {premiumVideos.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No premium videos available</p>
                      ) : (
                        premiumVideos.map((video) => {
                          const hasAccess_ = hasAccess(selectedUser.uid, video.id, 'video');
                          return (
                            <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-video text-gray-500"></i>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{video.title}</p>
                                  <p className="text-xs text-gray-500">{video.titleArabic}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  hasAccess_ ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {hasAccess_ ? '✅ Unlocked' : '🔒 Locked'}
                                </span>
                                {hasAccess_ ? (
                                  <button
                                    onClick={() => removeAccess(selectedUser.uid, video.id, 'video')}
                                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => grantAccess(selectedUser.uid, video.id, video.title, 'video')}
                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Grant
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTab === 'quizzes' && (
                    <div className="space-y-2">
                      {premiumQuizzes.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No premium quizzes available</p>
                      ) : (
                        premiumQuizzes.map((quiz) => {
                          const hasAccess_ = hasAccess(selectedUser.uid, quiz.id, 'quiz');
                          return (
                            <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-puzzle-piece text-gray-500"></i>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{quiz.title}</p>
                                  <p className="text-xs text-gray-500">{quiz.titleArabic}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  hasAccess_ ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {hasAccess_ ? '✅ Unlocked' : '🔒 Locked'}
                                </span>
                                {hasAccess_ ? (
                                  <button
                                    onClick={() => removeAccess(selectedUser.uid, quiz.id, 'quiz')}
                                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => grantAccess(selectedUser.uid, quiz.id, quiz.title, 'quiz')}
                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                                  >
                                    Grant
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <i className="fas fa-user-circle text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Select a user from the list to manage their content access</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
