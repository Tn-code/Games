import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
      return;
    }

    // Check if it's mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      setShowInstall(false);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    try {
      const result = await deferredPrompt.prompt();
      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fadeInUp">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <p className="text-white font-bold text-sm">Installer GamesApp</p>
              <p className="text-white/70 text-xs">Ajouter à l'écran d'accueil</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-purple-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all"
            >
              Installer
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="text-white/60 hover:text-white text-sm"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
