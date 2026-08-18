import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useToast } from '../contexts/ToastContext';

export function CreateQuiz() {
  const [formData, setFormData] = useState({
    title: '',
    titleArabic: '',
    description: '',
    descriptionArabic: '',
    category: 'education',
    difficulty: 'easy',
    timeLimit: 5,
    points: 10,
    type: 'free',
    questions: [
      {
        question: '',
        questionArabic: '',
        options: ['', '', '', ''],
        optionsArabic: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [optionCount, setOptionCount] = useState(4);
  const { addItem } = useFirestore('quizzes');
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex][field][oIndex] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
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
      setFormData(prev => ({
        ...prev,
        questions: newQuestions
      }));
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
    
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.titleArabic) {
      showToast('⚠️ Please enter quiz title in both languages', 'error');
      setLoading(false);
      return;
    }

    if (!formData.description || !formData.descriptionArabic) {
      showToast('⚠️ Please enter description in both languages', 'error');
      setLoading(false);
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question || !q.questionArabic) {
        showToast(`⚠️ Please fill question ${i + 1} in both languages`, 'error');
        setLoading(false);
        return;
      }
      
      const filledOptions = q.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        showToast(`⚠️ Question ${i + 1} needs at least 2 options`, 'error');
        setLoading(false);
        return;
      }
      
      if (q.correctAnswer === null || q.correctAnswer === undefined) {
        showToast(`⚠️ Please select the correct answer for question ${i + 1}`, 'error');
        setLoading(false);
        return;
      }
    }

    try {
      const quizData = {
        ...formData,
        createdAt: new Date().toISOString(),
        totalQuestions: formData.questions.length
      };

      const result = await addItem(quizData);
      
      if (result.success) {
        showToast('✅ Quiz created successfully!', 'success');
        const options = Array(optionCount).fill('');
        const optionsArabic = Array(optionCount).fill('');
        setFormData({
          title: '',
          titleArabic: '',
          description: '',
          descriptionArabic: '',
          category: 'education',
          difficulty: 'easy',
          timeLimit: 5,
          points: 10,
          type: 'free',
          questions: [
            {
              question: '',
              questionArabic: '',
              options: options,
              optionsArabic: optionsArabic,
              correctAnswer: 0
            }
          ]
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
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 animate-fadeInDown">
          <i className="fas fa-plus-circle text-purple-600"></i>
          Create New Quiz
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title - French */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-blue-500 mr-2"></i>
                Quiz Title (French) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Ex: General Knowledge Quiz"
                required
              />
            </div>

            {/* Title - Arabic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-font text-green-500 mr-2"></i>
                Quiz Title (Arabic) *
              </label>
              <input
                type="text"
                name="titleArabic"
                value={formData.titleArabic}
                onChange={handleChange}
                className="input-field"
                placeholder="مثال: اختبار المعرفة العامة"
                dir="rtl"
                required
              />
            </div>

            {/* Description - French */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-left text-blue-500 mr-2"></i>
                Description (French) *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Describe your quiz in French..."
                required
              />
            </div>

            {/* Description - Arabic */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-right text-green-500 mr-2"></i>
                Description (Arabic) *
              </label>
              <textarea
                name="descriptionArabic"
                value={formData.descriptionArabic}
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="وصف الاختبار بالعربية..."
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

            {/* Quiz Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-tag text-yellow-500 mr-2"></i>
                Quiz Type
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

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-signal text-yellow-500 mr-2"></i>
                Difficulty
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-clock text-blue-500 mr-2"></i>
                Time Limit (minutes)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-star text-yellow-500 mr-2"></i>
                Points per Question
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-list-ol text-purple-500 mr-2"></i>
                Options per Question
              </label>
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
                <i className="fas fa-plus"></i>
                Add Question
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Quiz...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Create Quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
