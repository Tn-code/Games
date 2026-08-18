import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StoriesList } from './StoriesList';
import { CreateStory } from './CreateStory';
import { VideoStoriesList } from './VideoStoriesList';
import { CreateVideoStory } from './CreateVideoStory';
import { QuizzesList } from './QuizzesList';
import { CreateQuiz } from './CreateQuiz';
import { UserManagement } from './UserManagement';
import { UserContentManager } from './UserContentManager';
import { AdminPremiumRequests } from './AdminPremiumRequests';
import { Analytics } from './Analytics';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const { data: games, loading: gamesLoading } = useFirestore('games');
  const { data: users, loading: usersLoading } = useFirestore('users');
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const { data: videos, loading: videosLoading } = useFirestore('videos');
  const { data: requests, loading: requestsLoading } = useFirestore('premiumRequests');

  const handleLogout = async () => { await logout(); };

  if (gamesLoading || usersLoading || storiesLoading || quizzesLoading || videosLoading || requestsLoading) {
    return <LoadingSpinner />;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const stats = {
    games: games.length,
    users: users.length,
    stories: stories.length,
    premiumStories: stories.filter(s => s.type === 'premium').length,
    quizzes: quizzes.length,
    totalQuestions: quizzes.reduce((acc, q) => acc + (q.totalQuestions || 0), 0),
    videos: videos.length,
    premiumVideos: videos.filter(v => v.type === 'premium').length,
    pendingRequests: pendingRequests
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'analytics': return <Analytics />;
      case 'premium-requests': return <AdminPremiumRequests />;
      case 'create-story': return <CreateStory />;
      case 'stories': return <StoriesList />;
      case 'videos': return <VideoStoriesList />;
      case 'create-video': return <CreateVideoStory />;
      case 'create-quiz': return <CreateQuiz />;
      case 'quizzes': return <QuizzesList />;
      case 'users': return <UserManagement />;
      case 'user-content': return <UserContentManager />;
      default: return (
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="animate-fadeInUp">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-500 text-sm">Welcome back, {user?.email || 'Admin'}!</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95 text-gray-700 shadow-sm"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatsCard icon="gem" title="Pending Requests" value={stats.pendingRequests} color="purple" />
            <StatsCard icon="book" title="Stories" value={stats.stories} color="blue" subtitle={`${stats.premiumStories} premium`} />
            <StatsCard icon="video" title="Videos" value={stats.videos} color="red" subtitle={`${stats.premiumVideos} premium`} />
            <StatsCard icon="users" title="Users" value={stats.users} color="green" />
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { id: 'premium-requests', icon: 'fa-gem', label: 'Requests', color: 'from-purple-500 to-pink-500' },
                { id: 'create-story', icon: 'fa-plus-circle', label: 'Add Story', color: 'from-emerald-500 to-green-500' },
                { id: 'create-video', icon: 'fa-video', label: 'Add Video', color: 'from-red-500 to-rose-500' },
                { id: 'create-quiz', icon: 'fa-puzzle-piece', label: 'Add Quiz', color: 'from-indigo-500 to-purple-500' },
              ].map((action) => (
                <button 
                  key={action.id}
                  onClick={() => setActiveTab(action.id)} 
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
                >
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <i className={`fas ${action.icon}`}></i>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
