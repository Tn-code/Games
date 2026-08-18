import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useToast } from '../contexts/ToastContext';

export function CreateVideoStory() {
  const [formData, setFormData] = useState({
    title: '',
    titleArabic: '',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    descriptionArabic: '',
    type: 'free',
    category: 'entertainment',
    duration: '',
    views: 0
  });
  
  const [loading, setLoading] = useState(false);
  const { addItem } = useFirestore('videos');
  const { showToast } = useToast();

  const categories = [
    { id: 'kids', label: '🧒 Kids', labelAr: '🧒 أطفال' },
    { id: 'education', label: '📚 Education', labelAr: '📚 تعليم' },
    { id: 'entertainment', label: '🎭 Entertainment', labelAr: '🎭 ترفيه' },
    { id: 'story', label: '📖 Story', labelAr: '📖 قصة' },
    { id: 'game', label: '🎮 Game', labelAr: '🎮 لعبة' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.titleArabic) {
      showToast('⚠️ Please enter video title in both languages', 'error');
      setLoading(false);
      return;
    }

    if (!formData.videoUrl) {
      showToast('⚠️ Please enter a video URL', 'error');
      setLoading(false);
      return;
    }

    try {
      const videoData = {
        ...formData,
        createdAt: new Date().toISOString(),
        views: 0
      };

      const result = await addItem(videoData);
      
      if (result.success) {
        showToast('✅ Video story created successfully!', 'success');
        setFormData({
          title: '',
          titleArabic: '',
          videoUrl: '',
          thumbnailUrl: '',
          description: '',
          descriptionArabic: '',
          type: 'free',
          category: 'entertainment',
          duration: '',
          views: 0
        });
      } else {
        showToast(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-plus-circle text-red-600"></i>
          Create Video Story
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title - French */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-blue-500 mr-2"></i>
                Video Title (French) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Ex: Amazing Gameplay"
                required
              />
            </div>

            {/* Title - Arabic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-green-500 mr-2"></i>
                Video Title (Arabic) *
              </label>
              <input
                type="text"
                name="titleArabic"
                value={formData.titleArabic}
                onChange={handleChange}
                className="input-field"
                placeholder="مثال: لعبة مذهلة"
                dir="rtl"
                required
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-tags text-yellow-500 mr-2"></i>
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.category === cat.id
                        ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200'
                        : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl">{cat.label.split(' ')[0]}</div>
                      <p className="text-xs font-medium text-gray-700 mt-1">{cat.label.split(' ')[1]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-link text-purple-500 mr-2"></i>
                Video URL *
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/video.mp4 or YouTube URL"
                required
              />
              {formData.videoUrl && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <video 
                    src={formData.videoUrl} 
                    className="w-full max-h-64 rounded-xl border border-gray-200"
                    controls
                  />
                </div>
              )}
            </div>

            {/* Thumbnail URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-image text-purple-500 mr-2"></i>
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/thumbnail.jpg"
              />
              {formData.thumbnailUrl && (
                <img 
                  src={formData.thumbnailUrl} 
                  alt="Thumbnail preview" 
                  className="mt-3 h-32 w-auto rounded-xl border border-gray-200 object-cover"
                />
              )}
            </div>

            {/* Description - French */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-left text-blue-500 mr-2"></i>
                Description (French)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Describe your video in French..."
              />
            </div>

            {/* Description - Arabic */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-right text-green-500 mr-2"></i>
                Description (Arabic)
              </label>
              <textarea
                name="descriptionArabic"
                value={formData.descriptionArabic}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="وصف الفيديو بالعربية..."
                dir="rtl"
              />
            </div>

            {/* Video Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-tag text-yellow-500 mr-2"></i>
                Video Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="type"
                    value="free"
                    checked={formData.type === 'free'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="font-medium">📖 Free</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="type"
                    value="premium"
                    checked={formData.type === 'premium'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="font-medium">⭐ Premium</span>
                </label>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-clock text-gray-500 mr-2"></i>
                Duration (Optional)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input-field"
                placeholder="5:30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Video...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Create Video Story
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
