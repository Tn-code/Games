import React from 'react';

export function VideoPlayer({ video, onClose, language }) {
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

  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full p-8 text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800">Invalid YouTube URL</h2>
          <p className="text-gray-500 mt-2">Please check the video URL</p>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
            Close
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

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
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* YouTube Player - Always visible */}
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={getDisplayName()}
            frameBorder="0"
          />
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
