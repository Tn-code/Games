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

  useEffect(() => {
    if (videos.length > 0) {
      const video = videos.find(v => v.id === id);
      if (video) setFormData(video);
    }
  }, [videos, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateItem(id, { ...formData, updatedAt: new Date().toISOString() });
      if (result.success) {
        showToast('✅ Video updated successfully!', 'success');
        setTimeout(() => navigate('/videos'), 2000);
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
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <i className="fas fa-edit text-red-600"></i> Edit Video
        </h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (French) *</label>
              <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic) *</label>
              <input type="text" value={formData.titleArabic || ''} onChange={(e) => setFormData({...formData, titleArabic: e.target.value})} className="input-field" dir="rtl" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
              <input type="url" value={formData.videoUrl || ''} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="input-field" required />
              <p className="text-xs text-gray-400 mt-1">
                YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
              <input type="url" value={formData.thumbnailUrl || ''} onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (French)</label>
              <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field min-h-[80px]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label>
              <textarea value={formData.descriptionArabic || ''} onChange={(e) => setFormData({...formData, descriptionArabic: e.target.value})} className="input-field min-h-[80px]" dir="rtl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" value="free" checked={formData.type === 'free'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                  <span>📖 Free</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" value="premium" checked={formData.type === 'premium'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                  <span>⭐ Premium</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input type="text" value={formData.duration || ''} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="input-field" placeholder="5:30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={formData.category || 'entertainment'} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field">
                <option value="kids">🧒 Kids</option>
                <option value="education">📚 Education</option>
                <option value="entertainment">🎭 Entertainment</option>
                <option value="story">📖 Story</option>
                <option value="game">🎮 Game</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Update Video'}</button>
            <button type="button" onClick={() => navigate('/videos')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
