import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ShareContent } from '../components/ShareContent';

const getCategoryLabel = (category) => {
  const categories = {
    kids: '🧒 Kids',
    education: '📚 Education',
    entertainment: '🎭 Entertainment',
    story: '📖 Story',
    game: '🎮 Game'
  };
  return categories[category] || '📖 Story';
};

export function StoriesList() {
  const { data: stories, loading, deleteItem } = useFirestore('stories');
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-book text-blue-600"></i>
          Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <div key={story.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img src={story.imageUrl || 'https://via.placeholder.com/400x200/cccccc/666666?text=Story'} alt={story.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    story.type === 'premium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}>
                    {story.type === 'premium' ? '⭐ Premium' : '📖 Free'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.nameArabic}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {getCategoryLabel(story.category)}
                  </span>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button 
                    onClick={() => navigate(`/edit-story/${story.id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(story.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <ShareContent title={story.name} type="story" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
