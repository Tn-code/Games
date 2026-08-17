import React, { useState, useRef } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  const getDisplayName = () => {
    return language === 'fr' ? video.title : video.titleArabic;
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : video.descriptionArabic;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Check if it's a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com/watch') || 
           url.includes('youtu.be/');
  };

  // Get YouTube video ID
  const getYouTubeId = (url) => {
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/v=([^&]+)/);
      if (match) videoId = match[1];
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    }
    return videoId;
  };

  // If YouTube, show special YouTube player
  if (isYouTubeUrl(video.videoUrl)) {
    const videoId = getYouTubeId(video.videoUrl);
    const youtubeUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 bg-gray-100">
            <h2 className="text-lg font-bold text-gray-800 truncate">{getDisplayName()}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={youtubeUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={getDisplayName()}
            />
          </div>
          
          <div className="p-4 bg-gray-50">
            <p className="text-gray-600 text-sm">{getDisplayContent()}</p>
            <a href={video.videoUrl} target="_blank" rel="noopener" className="text-blue-500 text-sm hover:underline">
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    );
  }

  // For direct video files (MP4, WebM, etc.)
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <h2 className="text-lg font-bold text-gray-800 truncate">{getDisplayName()}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="relative bg-black">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full"
              controls
              autoPlay
              poster={video.thumbnailUrl}
              onError={() => setError(true)}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-white">
              <p>No video available</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50">
          <p className="text-gray-600 text-sm">{getDisplayContent()}</p>
        </div>
      </div>
    </div>
  );
}
