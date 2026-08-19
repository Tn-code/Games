import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quizzes, loading, updateItem } = useFirestore('quizzes');
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [optionCount, setOptionCount] = useState(4);

  const categories = [
    { id: 'kids', label: '🧒 Kids' },
    { id: 'education', label: '📚 Education' },
    { id: 'entertainment', label: '🎭 Entertainment' },
    { id: 'story', label: '📖 Story' },
    { id: 'game', label: '🎮 Game' },
  ];

  useEffect(() => {
    if (quizzes.length > 0) {
      const quiz = quizzes.find(q => q.id === id);
      if (quiz) {
        setFormData({
          title: quiz.title || '',
          titleArabic: quiz.titleArabic || '',
          description: quiz.description || '',
          descriptionArabic: quiz.descriptionArabic || '',
          imageUrl: quiz.imageUrl || '',
          category: quiz.category || 'education',
          difficulty: quiz.difficulty || 'easy',
          timeLimit: quiz.timeLimit || 5,
          points: quiz.points || 10,
          type: quiz.type || 'free',
          questions: quiz.questions || [
            {
              question: '',
              questionArabic: '',
              options: ['', '', '', ''],
              optionsArabic: ['', '', '', ''],
              correctAnswer: 0
            }
          ]
        });
        if (quiz.questions && quiz.questions[0]?.options) {
          setOptionCount(quiz.questions[0].options.length);
        }
      }
    }
  }, [quizzes, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex][field][oIndex] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    const options = Array(optionCount).fill('');
    const optionsArabic = Array(optionCount).fill('');
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          questionArabic: '',
          options: options,
          optionsArabic: optionsArabic,
          correctAnswer: 0
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    }
  };

  const handleOptionCountChange = (e) => {
    const count = parseInt(e.target.value);
    setOptionCount(count);
    const newQuestions = formData.questions.map(q => {
      const currentOptions = q.options || [];
      const currentOptionsArabic = q.optionsArabic || [];
      const newOptions = [];
      const newOptionsArabic = [];
      
      for (let i = 0; i < count; i++) {
        newOptions.push(currentOptions[i] || '');
        newOptionsArabic.push(currentOptionsArabic[i] || '');
      }
      
      return {
        ...q,
        options: newOptions,
        optionsArabic: newOptionsArabic
      };
    });
    
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateItem(id, {
        ...formData,
        totalQuestions: formData.questions.length,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        showToast('✅ Quiz updated successfully!', 'success');
        setTimeout(() => navigate('/quizzes'), 1500);
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
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-edit text-purple-600"></i>
          Edit Quiz
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-image text-purple-500 mr-2"></i>
                Quiz Image (URL)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/quiz-image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img 
                    src={formData.imageUrl} 
                    alt="Quiz preview" 
                    className="h-32 w-auto rounded-xl border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+not+found';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.category === cat.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (French) *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic) *</label>
              <textarea
                name="descriptionArabic"
                value={formData.descriptionArabic}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points per Question</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options per Question</label>
              <select
                value={optionCount}
                onChange={handleOptionCountChange}
                className="input-field"
              >
                <option value="3">3 Options</option>
                <option value="4">4 Options</option>
              </select>
            </div>
          </div>

          {/* Questions Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fas fa-question-circle text-purple-600 mr-2"></i>
                Questions
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <i className="fas fa-plus"></i> Add Question
              </button>
            </div>

            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200 animate-fadeInUp">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-700">Question {qIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110"
                    >
                      <i className="fas fa-times"></i> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Question (French) *</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="input-field"
                      placeholder="Enter question in French"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Question (Arabic) *</label>
                    <input
                      type="text"
                      value={q.questionArabic}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionArabic', e.target.value)}
                      className="input-field"
                      placeholder="السؤال بالعربية"
                      dir="rtl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <i className="fas fa-list-ul text-purple-500 mr-2"></i>
                      Options * <span className="text-xs text-gray-400">(Select the correct answer)</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map((_, oIndex) => (
                        <div 
                          key={oIndex} 
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                            q.correctAnswer === oIndex 
                              ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              q.correctAnswer === oIndex 
                                ? 'border-green-500 bg-green-500 text-white scale-110' 
                                : 'border-gray-300 hover:border-purple-400'
                            }`}
                          >
                            {q.correctAnswer === oIndex && (
                              <i className="fas fa-check text-xs"></i>
                            )}
                          </button>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={q.options[oIndex] || ''}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'options', e.target.value)}
                              className={`input-field text-sm ${
                                q.correctAnswer === oIndex ? 'border-green-400 bg-green-50' : ''
                              }`}
                              placeholder={`Option ${oIndex + 1} (FR)`}
                            />
                            <input
                              type="text"
                              value={q.optionsArabic[oIndex] || ''}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionsArabic', e.target.value)}
                              className={`input-field text-sm ${
                                q.correctAnswer === oIndex ? 'border-green-400 bg-green-50' : ''
                              }`}
                              placeholder={`Option ${oIndex + 1} (AR)`}
                              dir="rtl"
                            />
                          </div>
                          {q.correctAnswer === oIndex && (
                            <span className="text-xs font-bold text-green-600 animate-pulse">
                              ✅ Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                  Update Quiz
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/quizzes')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
