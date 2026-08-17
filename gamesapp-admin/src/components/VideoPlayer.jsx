import React, { useState } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  const getDisplayName = () => {
    return language === 'fr' ? video.title : video.titleArabic;
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : video.descriptionArabic;
  };

  // Check if it's a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com/watch') || 
           url.includes('youtu.be/') || 
           url.includes('youtube.com/embed') ||
           url.includes('youtube.com/shorts');
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
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
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return null;
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const embedUrl = isYouTubeUrl(video.videoUrl) ? getYouTubeEmbedUrl(video.videoUrl) : null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInUp">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-black border-b border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{getDisplayName()}</h2>
            <p className="text-xs text-gray-400">
              {isYouTubeUrl(video.videoUrl) ? '📺 YouTube' : '🎬 Video'}
            </p>
          </div>
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
            <div className="relative cursor-pointer" onClick={handlePlay}>
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
              {isYouTubeUrl(video.videoUrl) && embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={getDisplayName()}
                  frameBorder="0"
                />
              ) : video.videoUrl && !isYouTubeUrl(video.videoUrl) ? (
                <video
                  src={video.videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                  poster={video.thumbnailUrl}
                  onError={() => setError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>No video available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 bg-gradient-to-r from-gray-800 to-black border-t border-gray-700">
          {getDisplayContent() && (
            <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
          )}
          
          {error && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              Unable to play this video. Please check the URL.
            </p>
          )}
          
          <div className="mt-3 flex gap-3">
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-play"></i>
                Play Video
              </button>
            )}
            {isPlaying && isYouTubeUrl(video.videoUrl) && (
              <a 
                href={video.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fab fa-youtube"></i>
                Open on YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
