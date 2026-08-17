import React, { useState, useRef } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

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
    
    // Try to extract video ID from various YouTube URL formats
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
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // If it's a YouTube video
  if (isYouTubeUrl(video.videoUrl)) {
    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
    
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeInUp">
        <div className="bg-black rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-800" ref={containerRef}>
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-black">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-white truncate">{getDisplayName()}</h2>
              <p className="text-xs text-gray-400">YouTube Video</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button 
                onClick={toggleFullscreen} 
                className="text-gray-400 hover:text-white transition-all duration-300 p-1"
              >
                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-lg`}></i>
              </button>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 p-1"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* YouTube Video */}
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            {embedUrl ? (
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={getDisplayName()}
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                  <p>Could not load video</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer with YouTube link */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-black flex flex-wrap items-center justify-between gap-2 border-t border-gray-800">
            {getDisplayContent() && (
              <p className="text-gray-300 text-xs sm:text-sm flex-1 min-w-0 line-clamp-2">{getDisplayContent()}</p>
            )}
            <a 
              href={video.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <i className="fab fa-youtube"></i>
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    );
  }

  // For MP4 files
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeInUp">
      <div className="bg-black rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-800" ref={containerRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-black">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-xl font-bold text-white truncate">{getDisplayName()}</h2>
            <p className="text-xs text-gray-400">Video</p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={toggleFullscreen} 
              className="text-gray-400 hover:text-white transition-all duration-300 p-1"
            >
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-lg`}></i>
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 p-1"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          {video.videoUrl ? (
            <video
              className="w-full aspect-video"
              src={video.videoUrl}
              controls
              autoPlay
              poster={video.thumbnailUrl}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center text-white">
              <p>No video URL provided</p>
            </div>
          )}
        </div>

        {/* Description */}
        {getDisplayContent() && (
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800">
            <p className="text-gray-300 text-xs sm:text-sm">{getDisplayContent()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
