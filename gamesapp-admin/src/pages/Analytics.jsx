import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Analytics() {
  const { data: stories } = useFirestore('stories');
  const { data: videos } = useFirestore('videos');
  const { data: quizzes } = useFirestore('quizzes');
  const { data: users } = useFirestore('users');
  const { data: requests } = useFirestore('premiumRequests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stories && videos && quizzes && users && requests) {
      setLoading(false);
    }
  }, [stories, videos, quizzes, users, requests]);

  if (loading) return <LoadingSpinner />;

  const totalContent = stories.length + videos.length + quizzes.length;
  const premiumContent = stories.filter(s => s.type === 'premium').length + 
                        videos.filter(v => v.type === 'premium').length +
                        quizzes.filter(q => q.type === 'premium').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const getCategoryCount = (items) => {
    const counts = {};
    items.forEach(item => {
      const cat = item.category || 'uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };

  const storyCategories = getCategoryCount(stories);
  const videoCategories = getCategoryCount(videos);
  const quizCategories = getCategoryCount(quizzes);

  const allCategories = { ...storyCategories, ...videoCategories, ...quizCategories };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-chart-line text-purple-600"></i>
          Analytics Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Content</p>
            <p className="text-3xl font-bold">{totalContent}</p>
            <div className="flex gap-4 mt-2 text-xs opacity-80">
              <span>📚 {stories.length} Stories</span>
              <span>🎬 {videos.length} Videos</span>
              <span>🧩 {quizzes.length} Quizzes</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Premium Content</p>
            <p className="text-3xl font-bold">{premiumContent}</p>
            <div className="text-xs opacity-80 mt-2">
              {Math.round((premiumContent / totalContent) * 100)}% of total
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
            <div className="text-xs opacity-80 mt-2">
              👤 Active users
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Pending Requests</p>
            <p className="text-3xl font-bold">{pendingRequests}</p>
            <div className="text-xs opacity-80 mt-2">
              ⏳ Awaiting approval
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-tags text-yellow-500 mr-2"></i>
            Content by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(allCategories).map(([category, count]) => {
              const labels = {
                kids: '🧒 Kids',
                education: '📚 Education',
                entertainment: '🎭 Entertainment',
                story: '📖 Story',
                game: '🎮 Game'
              };
              return (
                <div key={category} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-500">{labels[category] || category}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-rocket text-blue-600 mr-2"></i>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-center">
              <i className="fas fa-download text-blue-600 text-xl"></i>
              <p className="text-sm text-gray-700 mt-1">Export Report</p>
            </button>
            <button className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-center">
              <i className="fas fa-users text-green-600 text-xl"></i>
              <p className="text-sm text-gray-700 mt-1">User Activity</p>
            </button>
            <button className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-center">
              <i className="fas fa-gem text-purple-600 text-xl"></i>
              <p className="text-sm text-gray-700 mt-1">Premium Report</p>
            </button>
            <button className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              <p className="text-sm text-gray-700 mt-1">Issues</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
