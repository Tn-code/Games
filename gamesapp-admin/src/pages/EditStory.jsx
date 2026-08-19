import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: stories, loading, updateItem } = useFirestore('stories');
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 'kids', label: '🧒 Kids', labelAr: '🧒 أطفال' },
    { id: 'education', label: '📚 Education', labelAr: '📚 تعليم' },
    { id: 'entertainment', label: '🎭 Entertainment', labelAr: '🎭 ترفيه' },
    { id: 'story', label: '📖 Story', labelAr: '📖 قصة' },
    { id: 'game', label: '🎮 Game', labelAr: '🎮 لعبة' },
  ];

  useEffect(() => {
    if (stories.length > 0) {
      const story = stories.find(s => s.id === id);
      if (story) {
        setFormData({
          name: story.name || '',
          nameArabic: story.nameArabic || '',
          imageUrl: story.imageUrl || '',
          type: story.type || 'free',
          category: story.category || 'story',
          content: story.content || '',
          contentArabic: story.contentArabic || ''
        });
      }
    }
  }, [stories, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateItem(id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        showToast('✅ Story updated successfully!', 'success');
        setTimeout(() => navigate('/stories'), 1500);
      } else {
        showToast(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
    setSaving(false);
  };

  if (loading || !formData) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-edit text-blue-600"></i>
          Edit Story
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Name (French) *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Name (Arabic) *</label>
              <input
                type="text"
                name="nameArabic"
                value={formData.nameArabic}
                onChange={handleChange}
                className="input-field"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                required
              />
              {formData.imageUrl && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="h-32 w-auto rounded-xl border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+not+found';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (French) *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (Arabic) *</label>
              <textarea
                name="contentArabic"
                value={formData.contentArabic}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                dir="rtl"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Story
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/stories')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
