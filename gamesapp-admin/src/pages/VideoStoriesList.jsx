import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function VideoStoriesList() {
  const { data: videos, loading, deleteItem } = useFirestore('videos');
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <i className="fas fa-video text-red-600"></i>
            Video Stories
          </h2>
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium">
            Total: {videos.length}
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <i className="fas fa-video text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600">No video stories yet</h3>
            <p className="text-gray-400 mt-2">Click "Create Video Story" to add your first video</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="relative aspect-video bg-gray-900">
                  {video.videoUrl ? (
                    <video 
                      src={video.videoUrl} 
                      className="w-full h-full object-cover"
                      controls
                      poster={video.thumbnailUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fas fa-play-circle text-6xl"></i>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      video.type === 'premium' 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-green-400 text-green-900'
                    }`}>
                      {video.type === 'premium' ? '⭐ Premium' : '📖 Free'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.titleArabic}</p>
                  {video.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span><i className="fas fa-clock mr-1"></i>{video.duration || 'N/A'}</span>
                    <span><i className="fas fa-eye mr-1"></i>{video.views || 0} views</span>
                  </div>
                  <button 
                    onClick={() => deleteItem(video.id)}
                    className="mt-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium flex items-center gap-1"
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
