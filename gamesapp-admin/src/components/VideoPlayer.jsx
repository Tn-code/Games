import React from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const getDisplayName = () => {
    return language === 'fr' ? video.title : (video.titleArabic || video.title);
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : (video.descriptionArabic || video.description);
  };

  // Check if it's a YouTube URL
  const isYouTube = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const openVideo = () => {
    window.open(video.videoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-[9999] p-4 animate-fadeInUp">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-700">

        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/80 to-black/80 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white truncate">
            {getDisplayName()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 text-2xl ml-2"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Video Preview with Play Button */}
        <div className="relative cursor-pointer" onClick={openVideo}>
          {video.thumbnailUrl ? (
            <img 
              src={video.thumbnailUrl} 
              alt={getDisplayName()}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-center text-white">
                {isYouTube(video.videoUrl) ? (
                  <i className="fab fa-youtube text-6xl text-red-500 mb-3"></i>
                ) : (
                  <i className="fas fa-play-circle text-6xl text-purple-400 mb-3"></i>
                )}
                <p className="text-sm text-gray-300">
                  {isYouTube(video.videoUrl) ? 'Watch on YouTube' : 'Click to play'}
                </p>
              </div>
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300 group">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-4xl hover:scale-110 transition-all duration-300 shadow-2xl border-2 border-white/30">
              <i className="fas fa-play ml-2"></i>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {getDisplayContent() && (
            <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
          )}
          
          <button
            onClick={openVideo}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            {isYouTube(video.videoUrl) ? (
              <>
                <i className="fab fa-youtube"></i>
                Watch on YouTube
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Watch Video
              </>
            )}
          </button>

          {isYouTube(video.videoUrl) && (
            <p className="text-xs text-gray-500 text-center">
              Opens in a new tab (YouTube)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
