import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function NotificationBell() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: notifications, updateItem } = useFirestore('notifications');
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userNotifications = notifications.filter(n => n.userId === user?.uid);
  const unread = userNotifications.filter(n => !n.read);

  useEffect(() => {
    setUnreadCount(unread.length);
  }, [unread]);

  const markAsRead = async (id) => {
    try {
      await updateItem(id, { read: true, readAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    for (const notif of unread) {
      await markAsRead(notif.id);
    }
    showToast('✅ Toutes les notifications ont été lues', 'success');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-purple-600 transition-all hover:scale-110"
      >
        <i className="fas fa-bell text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto animate-fadeInDown">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          {userNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-inbox text-4xl mb-2 block"></i>
              <p>Aucune notification</p>
            </div>
          ) : (
            userNotifications.slice(0, 10).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer ${
                  !notif.read ? 'bg-purple-50' : ''
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{notif.icon || '📢'}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
