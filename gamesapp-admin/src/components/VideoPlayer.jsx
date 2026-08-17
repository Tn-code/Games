import React, { useState, useRef, useEffect } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Check if it's a YouTube URL
  useEffect(() => {
    const url = video.videoUrl || '';
    
    // Check for YouTube URLs
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('youtube.com/embed')) {
      setIsYouTube(true);
      
      // Extract video ID
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        try {
          const params = new URLSearchParams(new URL(url).search);
          videoId = params.get('v');
        } catch (e) {
          // Fallback
          const match = url.match(/v=([^&]+)/);
          if (match) videoId = match[1];
        }
      } else if (url.includes('youtu.be/')) {
        const parts = url.split('/');
        videoId = parts[parts.length - 1].split('?')[0];
      } else if (url.includes('youtube.com/embed')) {
        const parts = url.split('/');
        videoId = parts[parts.length - 1].split('?')[0];
      }
      
      if (videoId) {
        // Use the embed URL with proper parameters
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3`);
      } else {
        setVideoError(true);
      }
    } else {
      setIsYouTube(false);
    }
  }, [video.videoUrl]);

  const getDisplayName = () => {
    return language === 'fr' ? video.title : video.titleArabic;
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (isYouTube) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = x * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : video.descriptionArabic;
  };

  // If it's a YouTube video - use iframe embed
  if (isYouTube) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInUp">
        <div className="bg-black rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black">
            <div>
              <h2 className="text-xl font-bold text-white">{getDisplayName()}</h2>
              <p className="text-sm text-gray-400">YouTube Video</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* YouTube Video */}
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={getDisplayName()}
                frameBorder="0"
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                  <p>Could not load video</p>
                  <p className="text-sm text-gray-400">Please check the video URL</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {getDisplayContent() && (
            <div className="p-4 bg-gradient-to-r from-gray-900 to-black">
              <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
            </div>
          )}
          
          {/* Fallback link */}
          <div className="p-4 bg-gradient-to-r from-gray-800 to-black border-t border-gray-700">
            <a 
              href={video.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
            >
              <i className="fab fa-youtube text-red-500"></i>
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    );
  }

  // For MP4 and other video files - use HTML5 video player
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInUp">
      <div className="bg-black rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl" ref={containerRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black">
          <div>
            <h2 className="text-xl font-bold text-white">{getDisplayName()}</h2>
            <p className="text-sm text-gray-400">{video.duration || 'Video'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full aspect-video"
              src={video.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              controls={false}
              poster={video.thumbnailUrl}
              onError={() => setVideoError(true)}
            >
              <p>Your browser doesn't support HTML5 video</p>
            </video>
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center text-white">
              <p>No video URL provided</p>
            </div>
          )}
          
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                <p className="text-xl">Cannot play this video</p>
                <p className="text-sm text-gray-400 mt-2">The video format may not be supported</p>
              </div>
            </div>
          )}
          
          {/* Play Button Overlay */}
          {!isPlaying && !videoError && video.videoUrl && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-4xl group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <i className="fas fa-play ml-2"></i>
              </div>
            </button>
          )}

          {/* Controls */}
          {!videoError && video.videoUrl && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div 
                className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-purple-400 transition-all duration-300 text-xl">
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={toggleFullscreen} className="text-white hover:text-purple-400 transition-all duration-300 text-xl">
                    <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {getDisplayContent() && (
          <div className="p-4 bg-gradient-to-r from-gray-900 to-black">
            <p className="text-gray-300 text-sm">{getDisplayContent()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
