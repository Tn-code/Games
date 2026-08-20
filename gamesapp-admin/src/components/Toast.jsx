import React, { useState, useEffect } from 'react';

export function Toast({ message, type, onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-[99999] flex items-center gap-3 px-6 py-4 rounded-xl text-white shadow-2xl animate-slideIn ${styles[type] || styles.info}`}>
      <i className={`fas ${icons[type] || icons.info} text-xl`}></i>
      <span className="font-medium">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-4 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
