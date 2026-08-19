import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PremiumRequest } from './PremiumRequest';
import { QuizPlay } from './QuizPlay';
import { VideoPlayer } from '../components/VideoPlayer';
import { Categories } from '../components/Categories';
import { UserProgress } from '../components/UserProgress';
import { Badges } from '../components/Badges';
import { AdvancedSearch } from '../components/AdvancedSearch';
import { ThemeToggle } from '../components/ThemeToggle';
import { UserProfile } from '../components/UserProfile';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: videos, loading: videosLoading } = useFirestore('videos');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const { data: users, loading: usersLoading, fetchData: fetchUsers } = useFirestore('users');
  
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumType, setPremiumType] = useState('story');
  const [viewingStory, setViewingStory] = useState(null);
  const [playingQuiz, setPlayingQuiz] = useState(null);
  const [watchingVideo, setWatchingVideo] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [language, setLanguage] = useState('fr');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCurrentUserData(data);
        const unlocked = data.unlockedContent || [];
        setUnlockedCount(unlocked.length);
        setUnlockedItems(unlocked);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  if (storiesLoading || videosLoading || quizzesLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  if (showProfile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeInUp">
        <UserProfile onClose={() => setShowProfile(false)} />
      </div>
    );
  }

  const userFromList = users.find(u => u.uid === user?.uid);
  const userData = currentUserData || userFromList;
  const unlockedContent = userData?.unlockedContent || [];

  const hasAccess = (itemId) => {
    return unlockedContent.some(item => item.id === itemId);
  };

  const handlePremiumRequest = (item, type) => {
    setSelectedItem(item);
    setPremiumType(type);
    setShowPremiumModal(true);
  };

  const handleModalClose = () => {
    setShowPremiumModal(false);
    setSelectedItem(null);
    fetchUsers();
    showToast('🔄 Content updated!', 'info');
  };

  const handleViewContent = (item, type) => {
    const hasAccess_ = hasAccess(item.id);
    if (item.type === 'premium' && !hasAccess_) {
      handlePremiumRequest(item, type);
      return;
    }
    if (type === 'story') setViewingStory(item);
    else if (type === 'quiz') setPlayingQuiz(item);
    else if (type === 'video') setWatchingVideo(item);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
    showToast(language === 'fr' ? '🇸🇦 Arabic selected' : '🇫🇷 Français sélectionné', 'info');
  };

  const getDisplayName = (item) => {
    return language === 'fr' ? item.name || item.title : item.nameArabic || item.titleArabic;
  };

  const getDisplayContent = (item) => {
    return language === 'fr' ? item.content : item.contentArabic;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filter) => {
    setFilterType(filter);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
  };

  const filterByCategory = (items) => {
    if (!selectedCategory || selectedCategory === 'all') return items;
    return items.filter(item => item.category === selectedCategory);
  };

  const getFilteredAndSortedItems = (items) => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nameArabic || item.titleArabic || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    switch(sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'az':
        filtered = [...filtered].sort((a, b) => ((a.name || a.title) || '').localeCompare((b.name || b.title) || ''));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const renderContent = (items, type, icon, color) => {
    const filteredItems = getFilteredAndSortedItems(filterByCategory(items));
    
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12 animate-fadeInUp">
          <i className={`fas ${icon} text-6xl text-gray-300 mb-4 floating`}></i>
          <p className="text-gray-500">
            {language === 'fr' ? `Aucun ${type} trouvé` : `لا يوجد ${type === 'story' ? 'قصص' : type === 'video' ? 'فيديوهات' : 'اختبارات'}`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const isUnlocked = hasAccess(item.id);
          const isLocked = item.type === 'premium' && !isUnlocked;
          const displayName = getDisplayName(item);
          
          return (
            <div 
              key={item.id} 
              className={`${currentTheme.card} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${currentTheme.cardBorder} animate-fadeInUp`}
              style={{ animationDelay: `${(index % 5 + 1) * 0.1}s` }}
            >
              <div className="relative group">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={displayName} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : type === 'video' ? (
                  <div className="w-full h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110">
                    <i className="fas fa-play-circle text-white"></i>
                  </div>
                ) : (
                  <div className={`w-full h-48 ${color} flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110`}>
                    <i className={`fas ${icon}`}></i>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
                  {item.type === 'premium' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ⭐ {language === 'fr' ? 'Premium' : 'مميز'}
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold shadow-lg">
                      🔒 {language === 'fr' ? 'Fermé' : 'مغلق'}
                    </span>
                  )}
                  {isUnlocked && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg animate-bounceIn">
                      ✅ {language === 'fr' ? 'Débloqué' : 'مفتوح'}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4">
                <h3 className={`font-bold text-lg ${currentTheme.text}`}>{displayName}</h3>
                <button
                  onClick={() => handleViewContent(item, type)}
                  className={`mt-3 w-full py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isLocked
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-600/30'
                      : isUnlocked
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30'
                      : type === 'video'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  }`}
                >
                  {isLocked ? (language === 'fr' ? '⭐ Demander Premium' : '⭐ طلب مميز') : 
                   isUnlocked ? (language === 'fr' ? '✅ Accès Accordé' : '✅ تم الفتح') : 
                   type === 'story' ? (language === 'fr' ? '📖 Lire' : '📖 اقرأ') : 
                   type === 'quiz' ? (language === 'fr' ? '🧠 Jouer' : '🧠 العب') : 
                   (language === 'fr' ? '▶️ Regarder' : '▶️ شاهد')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="user-bg min-h-screen transition-all duration-500">
      {/* Navigation */}
      <nav className={`${currentTheme.navbar} sticky top-0 z-10 border-b ${currentTheme.cardBorder} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg floating">
                🎮
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  GamesApp
                </h1>
                <p className={`text-xs ${currentTheme.textSecondary}`}>
                  {language === 'fr' ? 'Amusement pour tous!' : 'متعة للجميع!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={toggleLanguage}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <i className="fas fa-globe"></i>
                {language === 'fr' ? '🇫🇷 FR' : '🇸🇦 AR'}
              </button>
              {unlockedCount > 0 && (
                <button 
                  onClick={() => setActiveTab('premium-unlock')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 animate-pulse"
                >
                  <span className="text-lg">⭐</span>
                  {unlockedCount} {language === 'fr' ? 'Débloqués' : 'مفتوحة'}
                </button>
              )}
              <div className={`flex items-center gap-2 ${currentTheme.card} rounded-full px-3 py-1 border ${currentTheme.cardBorder}`}>
                <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 hover:opacity-80 transition-all">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-400" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${currentTheme.text} hidden sm:block`}>
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>
              </div>
              <button 
                onClick={() => {
                  logout();
                  showToast('👋 Logged out successfully', 'info');
                }} 
                className={`${currentTheme.text} hover:${currentTheme.text} transition-all duration-300 hover:scale-110`}
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Progress & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <UserProgress stats={{
          storiesRead: unlockedContent.filter(i => i.type === 'story').length,
          totalStories: stories.length || 10,
          quizzesCompleted: unlockedContent.filter(i => i.type === 'quiz').length,
          totalQuizzes: quizzes.length || 5,
          videosWatched: unlockedContent.filter(i => i.type === 'video').length,
          totalVideos: videos.length || 8,
          points: unlockedContent.length * 10,
          totalPoints: (stories.length + quizzes.length + videos.length) * 10 || 1000,
        }} />
        
        <Badges stats={{
          storiesRead: unlockedContent.filter(i => i.type === 'story').length,
          quizzesCompleted: unlockedContent.filter(i => i.type === 'quiz').length,
          videosWatched: unlockedContent.filter(i => i.type === 'video').length,
          totalPoints: unlockedContent.length * 10,
          premiumUnlocked: unlockedContent.length,
        }} />
      </div>

      {/* Tabs and Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 mb-4 flex-wrap animate-fadeInDown">
          {['stories', 'videos', 'quizzes', 'library'].map((tab, index) => {
            const icons = ['📚', '🎬', '🧩', '📂'];
            const labels = {
              fr: ['Stories', 'Videos', 'Quizzes', 'Ma Bibliothèque'],
              ar: ['قصص', 'فيديوهات', 'اختبارات', 'مكتبتي']
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeInUp ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : `${currentTheme.card} ${currentTheme.text} hover:bg-gray-100 border ${currentTheme.cardBorder}`
                }`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <span className="text-2xl mr-2">{icons[index]}</span>
                {language === 'fr' ? labels.fr[index] : labels.ar[index]}
              </button>
            );
          })}
          {unlockedCount > 0 && (
            <button
              onClick={() => setActiveTab('premium-unlock')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeInUp ${
                activeTab === 'premium-unlock'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:shadow-lg'
              }`}
            >
              <span className="text-2xl mr-2">⭐</span>
              {language === 'fr' ? 'Premium Débloqué' : 'المميز المفتوح'}
              <span className="ml-2 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {unlockedCount}
              </span>
            </button>
          )}
        </div>

        {/* Advanced Search */}
        {(activeTab === 'stories' || activeTab === 'videos' || activeTab === 'quizzes') && (
          <AdvancedSearch 
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
          />
        )}

        {/* Categories */}
        {(activeTab === 'stories' || activeTab === 'videos' || activeTab === 'quizzes') && (
          <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
        )}

        {/* Content */}
        <div className={`${currentTheme.card} rounded-3xl shadow-xl p-6 border ${currentTheme.cardBorder} animate-fadeInUp`}>
          {activeTab === 'stories' && renderContent(stories, 'story', 'fa-book', 'bg-blue-100')}
          {activeTab === 'videos' && renderContent(videos, 'video', 'fa-video', 'bg-red-100')}
          {activeTab === 'quizzes' && renderContent(quizzes, 'quiz', 'fa-puzzle-piece', 'bg-purple-100')}
          
          {activeTab === 'library' && (
            <div className="animate-fadeInUp">
              <h2 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>
                {language === 'fr' ? '📂 Ma Bibliothèque' : '📂 مكتبتي'}
              </h2>
              {unlockedCount === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-folder-open text-6xl text-gray-300 mb-4 floating"></i>
                  <p className="text-gray-500">{language === 'fr' ? 'Votre bibliothèque est vide' : 'مكتبتك فارغة'}</p>
                  <p className="text-sm text-gray-400 mt-2">{language === 'fr' ? 'Demandez du contenu premium pour construire votre bibliothèque!' : 'اطلب محتوى مميز لبناء مكتبتك!'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedContent.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`${currentTheme.card} rounded-2xl p-4 border-2 border-green-200 hover-lift animate-fadeInUp`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center text-2xl floating">
                          {item.type === 'story' && '📚'}
                          {item.type === 'video' && '🎬'}
                          {item.type === 'quiz' && '🧩'}
                        </div>
                        <div>
                          <p className={`font-bold ${currentTheme.text}`}>{item.name}</p>
                          <p className={`text-xs ${currentTheme.textSecondary} capitalize`}>{item.type}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="badge-unlocked text-xs">✅ {language === 'fr' ? 'Débloqué' : 'مفتوح'}</span>
                        <span>• {new Date(item.grantedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Premium Unlock Tab */}
          {activeTab === 'premium-unlock' && (
            <div className="animate-fadeInUp">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl floating">⭐</span>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {language === 'fr' ? 'Contenu Premium Débloqué' : 'المحتوى المميز المفتوح'}
                </h2>
              </div>
              {unlockedCount === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-star text-6xl text-gray-300 mb-4 floating"></i>
                  <p className="text-gray-500">{language === 'fr' ? 'Aucun contenu premium débloqué' : 'لا يوجد محتوى مميز مفتوح'}</p>
                  <p className="text-sm text-gray-400 mt-2">{language === 'fr' ? 'Demandez du contenu premium pour débloquer!' : 'اطلب محتوى مميز لفتحه!'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedContent.map((item, index) => {
                    const storyItem = stories.find(s => s.id === item.id);
                    const videoItem = videos.find(v => v.id === item.id);
                    const quizItem = quizzes.find(q => q.id === item.id);
                    const fullItem = storyItem || videoItem || quizItem;
                    const displayName = getDisplayName(fullItem || item);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`${currentTheme.card} rounded-2xl p-4 border-2 border-green-300 shadow-md hover-lift animate-fadeInUp`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl flex items-center justify-center text-3xl floating">
                            {item.type === 'story' && '📚'}
                            {item.type === 'video' && '🎬'}
                            {item.type === 'quiz' && '🧩'}
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold ${currentTheme.text} text-lg`}>{displayName}</p>
                            <p className={`text-xs ${currentTheme.textSecondary} capitalize`}>{item.type}</p>
                          </div>
                        </div>
                        {fullItem && fullItem.imageUrl && (
                          <img src={fullItem.imageUrl} alt={displayName} className="w-full h-32 object-cover rounded-xl mt-3 transition-transform duration-300 hover:scale-105" />
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs">
                          <span className="badge-unlocked">{language === 'fr' ? '✅ Débloqué' : '✅ مفتوح'}</span>
                          <span className="text-gray-500">
                            {new Date(item.grantedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (item.type === 'story' && fullItem) setViewingStory(fullItem);
                            else if (item.type === 'quiz' && fullItem) setPlayingQuiz(fullItem);
                            else if (item.type === 'video' && fullItem) setWatchingVideo(fullItem);
                          }}
                          className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                        >
                          {item.type === 'story' ? (language === 'fr' ? '📖 Lire' : '📖 اقرأ') : 
                           item.type === 'video' ? (language === 'fr' ? '▶️ Regarder' : '▶️ شاهد') : 
                           (language === 'fr' ? '🧠 Jouer' : '🧠 العب')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPremiumModal && (
        <PremiumRequest item={selectedItem} type={premiumType} onClose={handleModalClose} />
      )}

      {watchingVideo && (
        <VideoPlayer video={watchingVideo} onClose={() => setWatchingVideo(null)} language={language} />
      )}

      {viewingStory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-fadeInUp">
          <div className={`${currentTheme.card} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-scaleIn border ${currentTheme.cardBorder}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{getDisplayName(viewingStory)}</h2>
              </div>
              <button onClick={() => setViewingStory(null)} className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:rotate-90">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            {viewingStory.imageUrl && (
              <img src={viewingStory.imageUrl} alt={getDisplayName(viewingStory)} className="w-full h-64 object-cover rounded-2xl mb-4" />
            )}
            <div className="prose max-w-none">
              <p className={`${currentTheme.text} whitespace-pre-wrap text-lg`}>{getDisplayContent(viewingStory)}</p>
            </div>
          </div>
        </div>
      )}

      {playingQuiz && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-fadeInUp">
          <QuizPlay quiz={playingQuiz} onClose={() => setPlayingQuiz(null)} language={language} />
        </div>
      )}
    </div>
  );
}
