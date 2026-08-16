import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export function CreateStory() {
  const [formData, setFormData] = useState({ name: '', nameArabic: '', imageUrl: '', type: 'free', content: '', contentArabic: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { addItem } = useFirestore('stories');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addItem({ ...formData, createdAt: new Date().toISOString() });
      if (result.success) { setMessage({ type: 'success', text: '✅ Story created!' }); setFormData({ name: '', nameArabic: '', imageUrl: '', type: 'free', content: '', contentArabic: '' }); }
      else setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
    } catch (error) { setMessage({ type: 'error', text: `❌ Error: ${error.message}` }); }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"><i className="fas fa-plus-circle text-blue-600"></i>Create Story</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Story Name (French) *</label><input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Story Name (Arabic) *</label><input type="text" name="nameArabic" value={formData.nameArabic} onChange={(e) => setFormData({...formData, nameArabic: e.target.value})} className="input-field" dir="rtl" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label><input type="url" name="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="input-field" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Type *</label><div className="flex gap-4"><label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer"><input type="radio" name="type" value="free" checked={formData.type === 'free'} onChange={(e) => setFormData({...formData, type: e.target.value})} /><span>📖 Free</span></label><label className="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer"><input type="radio" name="type" value="premium" checked={formData.type === 'premium'} onChange={(e) => setFormData({...formData, type: e.target.value})} /><span>⭐ Premium</span></label></div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Content (French) *</label><textarea name="content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="input-field min-h-[120px]" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Content (Arabic) *</label><textarea name="contentArabic" value={formData.contentArabic} onChange={(e) => setFormData({...formData, contentArabic: e.target.value})} className="input-field min-h-[120px]" dir="rtl" required /></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">{loading ? 'Creating...' : 'Create Story'}</button>
        </form>
        {message.text && <div className={`mt-4 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
      </div>
    </div>
  );
}
