import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export function CreateQuiz() {
  const [formData, setFormData] = useState({
    title: '', titleArabic: '', description: '', descriptionArabic: '',
    difficulty: 'easy', timeLimit: 5, points: 10,
    questions: [{ question: '', questionArabic: '', options: ['', '', '', ''], optionsArabic: ['', '', '', ''], correctAnswer: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { addItem } = useFirestore('quizzes');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addItem({ ...formData, totalQuestions: formData.questions.length, createdAt: new Date().toISOString() });
      if (result.success) { setMessage({ type: 'success', text: '✅ Quiz created!' }); setFormData({ ...formData, title: '', titleArabic: '', description: '', descriptionArabic: '' }); }
      else setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
    } catch (error) { setMessage({ type: 'error', text: `❌ Error: ${error.message}` }); }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"><i className="fas fa-plus-circle text-purple-600"></i>Create Quiz</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Title (French) *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic) *</label><input type="text" value={formData.titleArabic} onChange={(e) => setFormData({...formData, titleArabic: e.target.value})} className="input-field" dir="rtl" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description (French) *</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field min-h-[80px]" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic) *</label><textarea value={formData.descriptionArabic} onChange={(e) => setFormData({...formData, descriptionArabic: e.target.value})} className="input-field min-h-[80px]" dir="rtl" required /></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">{loading ? 'Creating...' : 'Create Quiz'}</button>
        </form>
      </div>
    </div>
  );
}
