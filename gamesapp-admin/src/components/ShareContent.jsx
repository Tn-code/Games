import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

export function ShareContent({ title, url, type = 'content' }) {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const shareData = {
    title: title || 'GamesApp Content',
    text: `Check out this amazing ${type}: ${title || 'GamesApp Content'}`,
    url: url || window.location.href
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
    showToast('📱 Sharing on Facebook...', 'info');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
    showToast('🐦 Sharing on Twitter...', 'info');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
    showToast('💬 Sharing on WhatsApp...', 'info');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast('✅ Link copied to clipboard!', 'success');
    });
  };

  const generateQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareData.url)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm"
      >
        <i className="fas fa-share-alt"></i>
        Share
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeInUp">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">📤 Share This Content</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">{shareData.text}</p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareOnFacebook}
                className="p-3 bg-[#1877F2] text-white rounded-xl hover:scale-105 transition-all"
              >
                <i className="fab fa-facebook-f text-xl"></i>
              </button>
              <button
                onClick={shareOnTwitter}
                className="p-3 bg-[#000000] text-white rounded-xl hover:scale-105 transition-all"
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="p-3 bg-[#25D366] text-white rounded-xl hover:scale-105 transition-all"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={copyLink}
                className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-link"></i> Copy Link
              </button>
              <button
                onClick={generateQR}
                className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-qrcode"></i> QR Code
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
