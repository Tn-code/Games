import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: stories, loading, updateItem } = useFirestore('stories');
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stories.length > 0) {
      const story = stories.find(s => s.id === id);
      if (story) {
        setFormData(story);
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
    setMessage({ type: '', text: '' });

    try {
      const result = await updateItem(id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Story updated successfully!' });
        setTimeout(() => navigate('/stories'), 2000);
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
          <i className="fas fa-edit text-blue-600"></i>
          Edit Story
        </h2>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Name (French) *</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Name (Arabic) *</label>
              <input type="text" name="nameArabic" value={formData.nameArabic || ''} onChange={handleChange} className="input-field" dir="rtl" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" name="type" value="free" checked={formData.type === 'free'} onChange={handleChange} />
                  <span>📖 Free</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer">
                  <input type="radio" name="type" value="premium" checked={formData.type === 'premium'} onChange={handleChange} />
                  <span>⭐ Premium</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (French) *</label>
              <textarea name="content" value={formData.content || ''} onChange={handleChange} className="input-field min-h-[120px]" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (Arabic) *</label>
              <textarea name="contentArabic" value={formData.contentArabic || ''} onChange={handleChange} className="input-field min-h-[120px]" dir="rtl" required />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? 'Saving...' : 'Update Story'}
            </button>
            <button type="button" onClick={() => navigate('/stories')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
