import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { PaymentModal } from '../components/PaymentModal';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  if (storiesLoading || quizzesLoading) return <LoadingSpinner />;

  const handlePurchase = (item) => {
    setSelectedItem({ ...item, price: item.type === 'premium' ? '€4.99' : '€0.00' });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => { window.location.reload(); };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-gamepad text-lg"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-800">GamesApp</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <i className="fas fa-user mr-2"></i>{user?.email}
            </span>
            <button onClick={logout} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('stories')} className={`px-6 py-2 rounded-xl font-medium ${activeTab === 'stories' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <i className="fas fa-book mr-2"></i>Stories
          </button>
          <button onClick={() => setActiveTab('quizzes')} className={`px-6 py-2 rounded-xl font-medium ${activeTab === 'quizzes' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}>
            <i className="fas fa-puzzle-piece mr-2"></i>Quizzes
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map(story => (
                <div key={story.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-40 bg-gray-200 relative">
                    <img src={story.imageUrl || 'https://via.placeholder.com/400x200/cccccc/666666?text=Story'} alt={story.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${story.type === 'premium' ? 'bg-yellow-400' : 'bg-green-400'}`}>
                        {story.type === 'premium' ? '⭐ Premium' : '📖 Free'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.nameArabic}</p>
                    <button onClick={() => { if (story.type === 'premium') handlePurchase(story); }} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all font-medium">
                      {story.type === 'premium' ? '🔒 Unlock for €4.99' : '📖 Read Story'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">{quiz.titleArabic}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.difficulty === 'easy' ? 'bg-green-100' : quiz.difficulty === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span><i className="fas fa-question-circle mr-1"></i>{quiz.totalQuestions || 0}</span>
                    <span><i className="fas fa-clock mr-1"></i>{quiz.timeLimit || 5} min</span>
                  </div>
                  <button onClick={() => { if (quiz.type === 'premium') handlePurchase(quiz); }} className="mt-3 w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-all font-medium">
                    {quiz.type === 'premium' ? '🔒 Unlock for €3.99' : '🧠 Start Quiz'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPayment && <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} item={selectedItem} onPaymentSuccess={handlePaymentSuccess} />}
    </div>
  );
}
