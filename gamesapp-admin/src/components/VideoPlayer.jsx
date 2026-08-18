import React, { useState } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getDisplayName = () => {
    return language === 'fr' ? video.title : (video.titleArabic || video.title);
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : (video.descriptionArabic || video.description);
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/v=([^&]+)/);
      if (match) videoId = match[1];
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    } else if (url.includes('youtube.com/embed')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    } else if (url.includes('youtube.com/shorts')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    }
    return videoId;
  };

  const videoId = getYouTubeId(video.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800 truncate">
            {getDisplayName()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl ml-2"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* YouTube Video */}
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          {!isPlaying ? (
            // Thumbnail with Play Button
            <div 
              className="relative w-full h-full cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={getDisplayName()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-purple-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fab fa-youtube text-7xl mb-3"></i>
                    <p className="text-lg">YouTube Video</p>
                  </div>
                </div>
              )}
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all duration-300">
                <div className="w-24 h-24 bg-red-600/80 rounded-full flex items-center justify-center text-white text-5xl hover:scale-110 transition-all duration-300 shadow-2xl">
                  <i className="fas fa-play ml-2"></i>
                </div>
              </div>
            </div>
          ) : (
            // YouTube Player
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={getDisplayName()}
              frameBorder="0"
            />
          )}
        </div>

        {/* Description */}
        {getDisplayContent() && (
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-gray-700 text-sm">
              {getDisplayContent()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
