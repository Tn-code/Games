import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function StoriesList() {
  const { data: stories, loading, deleteItem } = useFirestore('stories');
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"><i className="fas fa-book text-blue-600"></i>Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <div key={story.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img src={story.imageUrl || 'https://via.placeholder.com/400x200/cccccc/666666?text=Story'} alt={story.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${story.type === 'premium' ? 'bg-yellow-400' : 'bg-green-400'}`}>{story.type === 'premium' ? '⭐ Premium' : '📖 Free'}</span></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{story.name}</h3>
                <p className="text-sm text-gray-500">{story.nameArabic}</p>
                <button onClick={() => deleteItem(story.id)} className="mt-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"><i className="fas fa-trash mr-1"></i>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
