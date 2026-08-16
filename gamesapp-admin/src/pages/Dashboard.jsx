import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StoriesList } from './StoriesList';
import { CreateStory } from './CreateStory';
import { QuizzesList } from './QuizzesList';
import { CreateQuiz } from './CreateQuiz';
import { UserManagement } from './UserManagement';
import { UserDashboard } from './UserDashboard';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const { data: games, loading: gamesLoading } = useFirestore('games');
  const { data: users, loading: usersLoading } = useFirestore('users');
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');

  const handleLogout = async () => { await logout(); };

  if (gamesLoading || usersLoading || storiesLoading || quizzesLoading) {
    return <LoadingSpinner />;
  }

  const stats = {
    games: games.length,
    users: users.length,
    stories: stories.length,
    premiumStories: stories.filter(s => s.type === 'premium').length,
    quizzes: quizzes.length,
    totalQuestions: quizzes.reduce((acc, q) => acc + (q.totalQuestions || 0), 0),
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'create-story': return <CreateStory />;
      case 'stories': return <StoriesList />;
      case 'create-quiz': return <CreateQuiz />;
      case 'quizzes': return <QuizzesList />;
      case 'users': return <UserManagement />;
      case 'user-dashboard': return <UserDashboard />;
      default: return (
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div><h2 className="text-2xl font-bold text-gray-800">Dashboard</h2><p className="text-gray-500 text-sm">Welcome back, {user?.email || 'Admin'}!</p></div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700"><i className="fas fa-sign-out-alt"></i><span>Logout</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard icon="book" title="Stories" value={stats.stories} color="blue" subtitle={`${stats.premiumStories} premium`} />
            <StatsCard icon="puzzle-piece" title="Quizzes" value={stats.quizzes} color="purple" subtitle={`${stats.totalQuestions} questions`} />
            <StatsCard icon="users" title="Users" value={stats.users} color="green" />
            <StatsCard icon="gamepad" title="Games" value={stats.games} color="orange" />
          </div>
        </div>
      );
    }
  };

  if (activeTab === 'user-dashboard') return <UserDashboard />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
