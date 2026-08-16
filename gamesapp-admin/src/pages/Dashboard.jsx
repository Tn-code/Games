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
import { SyncUsers } from './SyncUsers';
import { UserContentManager } from './UserContentManager';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const { data: games, loading: gamesLoading } = useFirestore('games');
  const { data: users, loading: usersLoading } = useFirestore('users');
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const { data: videos, loading: videosLoading } = useFirestore('videos');

  const handleLogout = async () => { await logout(); };

  if (gamesLoading || usersLoading || storiesLoading || quizzesLoading || videosLoading) {
    return <LoadingSpinner />;
  }

  const stats = {
    games: games.length,
    users: users.length,
    stories: stories.length,
    premiumStories: stories.filter(s => s.type === 'premium').length,
    quizzes: quizzes.length,
    totalQuestions: quizzes.reduce((acc, q) => acc + (q.totalQuestions || 0), 0),
    videos: videos.length,
    premiumVideos: videos.filter(v => v.type === 'premium').length,
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'create-story': return <CreateStory />;
      case 'stories': return <StoriesList />;
      case 'videos': return <VideoStoriesList />;
      case 'create-video': return <CreateVideoStory />;
      case 'create-quiz': return <CreateQuiz />;
      case 'quizzes': return <QuizzesList />;
      case 'users': return <UserManagement />;
      case 'user-content': return <UserContentManager />;
      case 'sync-users': return <SyncUsers />;
      default: return (
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-500 text-sm">Welcome back, {user?.email || 'Admin'}!</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard icon="book" title="Stories" value={stats.stories} color="blue" subtitle={`${stats.premiumStories} premium`} />
            <StatsCard icon="video" title="Videos" value={stats.videos} color="red" subtitle={`${stats.premiumVideos} premium`} />
            <StatsCard icon="puzzle-piece" title="Quizzes" value={stats.quizzes} color="purple" subtitle={`${stats.totalQuestions} questions`} />
            <StatsCard icon="users" title="Users" value={stats.users} color="green" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-rocket text-blue-600 mr-2"></i>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <button onClick={() => setActiveTab('create-story')} className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-center">
                <i className="fas fa-plus-circle text-2xl text-blue-600 mb-2"></i>
                <p className="text-sm font-medium text-gray-700">Add Story</p>
              </button>
              <button onClick={() => setActiveTab('create-video')} className="p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-center">
                <i className="fas fa-video text-2xl text-red-600 mb-2"></i>
                <p className="text-sm font-medium text-gray-700">Add Video</p>
              </button>
              <button onClick={() => setActiveTab('create-quiz')} className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-center">
                <i className="fas fa-puzzle-piece text-2xl text-purple-600 mb-2"></i>
                <p className="text-sm font-medium text-gray-700">Add Quiz</p>
              </button>
              <button onClick={() => setActiveTab('users')} className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-center">
                <i className="fas fa-users text-2xl text-green-600 mb-2"></i>
                <p className="text-sm font-medium text-gray-700">Manage Users</p>
              </button>
              <button onClick={() => setActiveTab('user-content')} className="p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all text-center">
                <i className="fas fa-user-lock text-2xl text-yellow-600 mb-2"></i>
                <p className="text-sm font-medium text-gray-700">User Content</p>
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
