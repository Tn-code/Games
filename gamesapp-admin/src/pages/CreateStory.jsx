import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useToast } from '../contexts/ToastContext';

export function CreateStory() {
  const [formData, setFormData] = useState({
    name: '',
    nameArabic: '',
    imageUrl: '',
    type: 'free',
    content: '',
    contentArabic: '',
    category: 'story'
  });
  
  const [loading, setLoading] = useState(false);
  const { addItem } = useFirestore('stories');
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

    if (!formData.name || !formData.nameArabic) {
      showToast('⚠️ Please enter story name in both languages', 'error');
      setLoading(false);
      return;
    }

    if (!formData.content || !formData.contentArabic) {
      showToast('⚠️ Please enter content in both languages', 'error');
      setLoading(false);
      return;
    }

    try {
      const result = await addItem({ 
        ...formData, 
        createdAt: new Date().toISOString() 
      });
      
      if (result.success) {
        showToast('✅ Story created successfully!', 'success');
        setFormData({
          name: '',
          nameArabic: '',
          imageUrl: '',
          type: 'free',
          content: '',
          contentArabic: '',
          category: 'story'
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
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-plus-circle text-blue-600"></i>
          Create Story
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Story Name - French */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-blue-500 mr-2"></i>
                Story Name (French) *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Ex: The Lost Kingdom"
                required
              />
            </div>

            {/* Story Name - Arabic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-green-500 mr-2"></i>
                Story Name (Arabic) *
              </label>
              <input
                type="text"
                name="nameArabic"
                value={formData.nameArabic}
                onChange={handleChange}
                className="input-field"
                placeholder="مثال: المملكة المفقودة"
                dir="rtl"
                required
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-image text-purple-500 mr-2"></i>
                Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/story-image.jpg"
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
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
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

            {/* Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-tag text-yellow-500 mr-2"></i>
                Story Type *
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

            {/* Content - French */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-left text-blue-500 mr-2"></i>
                Content (French) *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                placeholder="Write the story content in French..."
                required
              />
            </div>

            {/* Content - Arabic */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-right text-green-500 mr-2"></i>
                Content (Arabic) *
              </label>
              <textarea
                name="contentArabic"
                value={formData.contentArabic}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                placeholder="اكتب محتوى القصة بالعربية..."
                dir="rtl"
                required
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
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Create Story
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
