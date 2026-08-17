import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: videos, loading, updateItem } = useFirestore('videos');
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
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
        setMessage({ type: 'success', text: '✅ Video updated!' });
        setTimeout(() => navigate('/videos'), 2000);
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
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
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (French) *</label>
              <input type="text" name="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic) *</label>
              <input type="text" name="titleArabic" value={formData.titleArabic || ''} onChange={(e) => setFormData({...formData, titleArabic: e.target.value})} className="input-field" dir="rtl" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
              <input type="url" name="videoUrl" value={formData.videoUrl || ''} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" name="type" value="free" checked={formData.type === 'free'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                  <span>📖 Free</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" name="type" value="premium" checked={formData.type === 'premium'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                  <span>⭐ Premium</span>
                </label>
              </div>
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
