import React from 'react';
import { useToast } from '../contexts/ToastContext';

export function ShareButtons({ title, url }) {
  const { showToast } = useToast();

  const shareData = {
    title: title,
    text: `Check out this awesome content: ${title}`,
    url: url || window.location.href
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast('✅ Link copied to clipboard!', 'success');
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={shareOnFacebook}
        className="w-10 h-10 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <i className="fab fa-facebook-f"></i>
      </button>
      <button 
        onClick={shareOnTwitter}
        className="w-10 h-10 bg-[#000000] text-white rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <i className="fab fa-x-twitter"></i>
      </button>
      <button 
        onClick={shareOnWhatsApp}
        className="w-10 h-10 bg-[#25D366] text-white rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <i className="fab fa-whatsapp"></i>
      </button>
      <button 
        onClick={copyLink}
        className="w-10 h-10 bg-gray-600 text-white rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <i className="fas fa-link"></i>
      </button>
    </div>
  );
}
