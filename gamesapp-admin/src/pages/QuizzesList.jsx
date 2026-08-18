import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

const getCategoryLabel = (category) => {
  const categories = {
    kids: '🧒 Kids',
    education: '📚 Education',
    entertainment: '🎭 Entertainment',
    story: '📖 Story',
    game: '🎮 Game'
  };
  return categories[category] || '📚 Education';
};

export function QuizzesList() {
  const { data: quizzes, loading, deleteItem } = useFirestore('quizzes');
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-puzzle-piece text-purple-600"></i> Quizzes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.titleArabic}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {getCategoryLabel(quiz.category)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span><i className="fas fa-signal mr-1"></i> {quiz.difficulty}</span>
                <span><i className="fas fa-question-circle mr-1"></i> {quiz.totalQuestions || quiz.questions?.length || 0}</span>
                <span><i className="fas fa-clock mr-1"></i> {quiz.timeLimit || 5} min</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => navigate(`/edit-quiz/${quiz.id}`)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium">
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
                <button onClick={() => deleteItem(quiz.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
