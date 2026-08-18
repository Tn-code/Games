import React from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const getDisplayName = () => {
    return language === 'fr' ? video.title : (video.titleArabic || video.title);
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : (video.descriptionArabic || video.description);
  };

  const openInNewTab = () => {
    window.open(video.videoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-black border-b border-gray-700">
          <h2 className="text-lg font-bold text-white truncate">{getDisplayName()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Video Preview with Play Button */}
        <div className="relative cursor-pointer" onClick={openInNewTab}>
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={getDisplayName()} className="w-full aspect-video object-cover" />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-center text-white">
                <i className="fab fa-youtube text-6xl text-red-500 mb-3"></i>
                <p className="text-sm text-gray-300">Watch on YouTube</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300">
            <div className="w-20 h-20 bg-red-600/80 rounded-full flex items-center justify-center text-white text-4xl hover:scale-110 transition-all duration-300 shadow-2xl">
              <i className="fas fa-play ml-2"></i>
            </div>
          </div>
        </div>

        {/* Description */}
        {getDisplayContent() && (
          <div className="p-4 bg-gradient-to-r from-gray-800 to-black border-t border-gray-700">
            <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
