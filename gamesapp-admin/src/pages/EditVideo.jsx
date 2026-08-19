import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: videos, loading, updateItem } = useFirestore('videos');
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 'kids', label: '🧒 Kids' },
    { id: 'education', label: '📚 Education' },
    { id: 'entertainment', label: '🎭 Entertainment' },
    { id: 'story', label: '📖 Story' },
    { id: 'game', label: '🎮 Game' },
  ];

  useEffect(() => {
    if (videos.length > 0) {
      const video = videos.find(v => v.id === id);
      if (video) {
        setFormData({
          title: video.title || '',
          titleArabic: video.titleArabic || '',
          videoUrl: video.videoUrl || '',
          thumbnailUrl: video.thumbnailUrl || '',
          description: video.description || '',
          descriptionArabic: video.descriptionArabic || '',
          type: video.type || 'free',
          category: video.category || 'entertainment',
          duration: video.duration || ''
        });
      }
    }
  }, [videos, id]);

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
        showToast('✅ Video updated successfully!', 'success');
        setTimeout(() => navigate('/videos'), 1500);
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
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-edit text-red-600"></i>
          Edit Video
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (French) *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic) *</label>
              <input
                type="text"
                name="titleArabic"
                value={formData.titleArabic}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="input-field"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (Optional)</label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="input-field"
              />
              {formData.thumbnailUrl && (
                <img 
                  src={formData.thumbnailUrl} 
                  alt="Thumbnail preview" 
                  className="mt-3 h-32 w-auto rounded-xl border border-gray-200 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+not+found';
                  }}
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (French)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[80px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label>
              <textarea
                name="descriptionArabic"
                value={formData.descriptionArabic}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="free"
                    checked={formData.type === 'free'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <span>📖 Free</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="premium"
                    checked={formData.type === 'premium'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span>⭐ Premium</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Optional)</label>
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
                  Update Video
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/videos')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
