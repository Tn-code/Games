import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export function RecentlyViewedProvider({ children }) {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        setRecentItems(JSON.parse(saved));
      } catch (e) {
        setRecentItems([]);
      }
    }
  }, []);

  const addRecent = (item, type) => {
    const newItem = {
      id: item.id,
      name: item.name || item.title,
      type: type,
      timestamp: Date.now(),
      imageUrl: item.imageUrl
    };
    
    setRecentItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentItems([]);
    localStorage.removeItem('recentlyViewed');
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentItems, addRecent, clearRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
