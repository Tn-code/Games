import React, { useState, useRef } from 'react';

export function VideoPlayer({ video, onClose, language }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDisplayContent = () => {
    return language === 'fr' ? video.description : video.descriptionArabic;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeInUp">
      <div className="bg-black rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl" ref={containerRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black">
          <div>
            <h2 className="text-xl font-bold text-white">{getDisplayName()}</h2>
            <p className="text-sm text-gray-400">{video.duration || '5:30'}</p>
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
          <video
            ref={videoRef}
            className="w-full aspect-video"
            src={video.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            controls={false}
            poster={video.thumbnailUrl}
          />
          
          {/* Play Button Overlay */}
          {!isPlaying && (
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
