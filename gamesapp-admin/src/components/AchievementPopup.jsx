import React, { useState, useEffect } from 'react';

export function AchievementPopup({ achievement, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideIn">
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 shadow-2xl max-w-sm border-2 border-white/20">
        <div className="flex items-start gap-3">
          <div className="text-4xl animate-bounceIn">🏆</div>
          <div className="flex-1">
            <p className="text-xs text-yellow-900/70 font-medium">ACHIEVEMENT UNLOCKED!</p>
            <h4 className="font-bold text-yellow-900">{achievement.title}</h4>
            <p className="text-sm text-yellow-900/80">{achievement.description}</p>
          </div>
          <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-yellow-900/50 hover:text-yellow-900">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
