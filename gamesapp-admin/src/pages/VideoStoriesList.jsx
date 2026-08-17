import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function VideoStoriesList() {
  const { data: videos, loading, deleteItem } = useFirestore('videos');
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-video text-red-600"></i> Video Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.titleArabic}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate(`/edit-video/${video.id}`)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium">
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button onClick={() => deleteItem(video.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
