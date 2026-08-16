import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { PaymentModal } from '../components/PaymentModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizPlay } from './QuizPlay';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [playingQuiz, setPlayingQuiz] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);

  if (storiesLoading || quizzesLoading) return <LoadingSpinner />;

  const handlePurchase = (item) => {
    setSelectedItem({ ...item, price: item.type === 'premium' ? '€4.99' : '€0.00' });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => { window.location.reload(); };

  const handlePlayQuiz = (quiz) => {
    // Check if premium and not purchased
    if (quiz.type === 'premium') {
      // Here you would check if user purchased it
      // For now, allow premium quizzes to be played
      setPlayingQuiz(quiz);
    } else {
      setPlayingQuiz(quiz);
    }
  };

  const handleViewStory = (story) => {
    setViewingStory(story);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <i className="fas fa-gamepad text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-800">GamesApp</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <button onClick={() => setActiveTab('stories')} className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'stories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <i className="fas fa-book mr-2"></i>Stories
          </button>
          <button onClick={() => setActiveTab('quizzes')} className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'quizzes' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <i className="fas fa-puzzle-piece mr-2"></i>Quizzes
          </button>
          <button onClick={() => setActiveTab('library')} className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'library' ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <i className="fas fa-folder-open mr-2"></i>My Library
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'stories' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-40 bg-gray-200 relative">
                      <img src={story.imageUrl || 'https://via.placeholder.com/400x200/cccccc/666666?text=Story'} alt={story.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${story.type === 'premium' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                          {story.type === 'premium' ? '⭐ Premium' : '📖 Free'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{story.name}</h3>
                      <p className="text-sm text-gray-500">{story.nameArabic}</p>
                      <button onClick={() => handleViewStory(story)} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all font-medium">
                        📖 Read Story
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🧩 Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">{quiz.titleArabic}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' : quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{quiz.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span><i className="fas fa-question-circle mr-1"></i> {quiz.totalQuestions || quiz.questions?.length || 0}</span>
                        <span><i className="fas fa-clock mr-1"></i> {quiz.timeLimit || 5} min</span>
                        <span><i className="fas fa-star mr-1"></i> {quiz.points || 10} pts</span>
                      </div>
                      <button onClick={() => handlePlayQuiz(quiz)} className="mt-3 w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-all font-medium">
                        🧠 Start Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="text-center py-12">
              <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Your purchased content will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} item={selectedItem} onPaymentSuccess={handlePaymentSuccess} />}

      {/* Quiz Play Modal */}
      {playingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 overflow-y-auto">
          <QuizPlay quiz={playingQuiz} onClose={() => setPlayingQuiz(null)} />
        </div>
      )}

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{viewingStory.name}</h2>
                <p className="text-gray-500">{viewingStory.nameArabic}</p>
              </div>
              <button onClick={() => setViewingStory(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            {viewingStory.imageUrl && (
              <img src={viewingStory.imageUrl} alt={viewingStory.name} className="w-full h-64 object-cover rounded-xl mb-4" />
            )}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{viewingStory.content}</p>
              <p className="text-gray-600 mt-4 whitespace-pre-wrap" dir="rtl">{viewingStory.contentArabic}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
