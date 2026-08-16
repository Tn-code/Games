import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function QuizzesList() {
  const { data: quizzes, loading, deleteItem } = useFirestore('quizzes');
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-puzzle-piece text-purple-600"></i>Quizzes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4">
              <h3 className="font-bold text-gray-800">{quiz.title}</h3>
              <p className="text-sm text-gray-500">{quiz.titleArabic}</p>
              <button onClick={() => deleteItem(quiz.id)} className="mt-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium">
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
