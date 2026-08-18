import React, { useState } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getDisplayName = () => {
    return language === 'fr' ? video.title : video.titleArabic;
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : video.descriptionArabic;
  };

  // Get YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    let videoId = '';
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
  const isYouTube = videoId !== null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInUp">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/80 to-black/80 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white truncate">{getDisplayName()}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 text-2xl ml-2"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black">
          {!isPlaying ? (
            // Thumbnail with Play Button
            <div className="relative cursor-pointer" onClick={() => setIsPlaying(true)}>
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={getDisplayName()}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-play-circle text-6xl text-purple-400 mb-3"></i>
                    <p className="text-sm text-gray-300">Click to play</p>
                  </div>
                </div>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-4xl hover:scale-110 transition-all duration-300 shadow-2xl border-2 border-white/30">
                  <i className="fas fa-play ml-2"></i>
                </div>
              </div>
            </div>
          ) : (
            // Video Player
            <div className="w-full aspect-video">
              {isYouTube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={getDisplayName()}
                  frameBorder="0"
                />
              ) : (
                <video
                  src={video.videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                  poster={video.thumbnailUrl}
                />
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {getDisplayContent() && (
          <div className="p-4 bg-gradient-to-r from-gray-800/80 to-black/80 border-t border-gray-700">
            <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
