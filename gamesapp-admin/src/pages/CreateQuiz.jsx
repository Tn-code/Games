import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export function CreateQuiz() {
  const [formData, setFormData] = useState({
    title: '',
    titleArabic: '',
    description: '',
    descriptionArabic: '',
    difficulty: 'easy',
    timeLimit: 5,
    points: 10,
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
  const [message, setMessage] = useState({ type: '', text: '' });
  const [optionCount, setOptionCount] = useState(4);
  const { addItem } = useFirestore('quizzes');

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
    // Update all questions with new option count
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
    setMessage({ type: '', text: '' });

    // Validate form
    if (!formData.title || !formData.titleArabic) {
      setMessage({ type: 'error', text: '⚠️ Please enter quiz title in both French and Arabic' });
      setLoading(false);
      return;
    }

    if (!formData.description || !formData.descriptionArabic) {
      setMessage({ type: 'error', text: '⚠️ Please enter description in both French and Arabic' });
      setLoading(false);
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question || !q.questionArabic) {
        setMessage({ type: 'error', text: `⚠️ Please fill question ${i + 1} in both languages` });
        setLoading(false);
        return;
      }
      
      // Check if at least 2 options have values
      const filledOptions = q.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        setMessage({ type: 'error', text: `⚠️ Question ${i + 1} needs at least 2 options` });
        setLoading(false);
        return;
      }
      
      // Check Arabic options
      const filledOptionsArabic = q.optionsArabic.filter(opt => opt.trim() !== '');
      if (filledOptionsArabic.length < 2) {
        setMessage({ type: 'error', text: `⚠️ Question ${i + 1} needs at least 2 Arabic options` });
        setLoading(false);
        return;
      }
    }

    try {
      const quizData = {
        ...formData,
        createdAt: new Date().toISOString(),
        totalQuestions: formData.questions.length,
        type: 'free' // Default to free, can be premium
      };

      const result = await addItem(quizData);
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Quiz created successfully!' });
        // Reset form
        const options = Array(optionCount).fill('');
        const optionsArabic = Array(optionCount).fill('');
        setFormData({
          title: '',
          titleArabic: '',
          description: '',
          descriptionArabic: '',
          difficulty: 'easy',
          timeLimit: 5,
          points: 10,
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
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeInDown">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <i className="fas fa-plus-circle text-purple-600"></i>
            Create New Quiz
          </h2>
          <p className="text-gray-500 mt-2">Create a quiz with questions in French and Arabic</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeInUp ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fadeInUp">
          {/* Quiz Details */}
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

            {/* Quiz Settings */}
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
                  {/* Question French */}
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

                  {/* Question Arabic */}
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

                  {/* Options */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">Options *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((_, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                            className="w-4 h-4 text-purple-600 cursor-pointer"
                          />
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={q.options[oIndex] || ''}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'options', e.target.value)}
                              className="input-field text-sm"
                              placeholder={`Option ${oIndex + 1} (FR)`}
                            />
                            <input
                              type="text"
                              value={q.optionsArabic[oIndex] || ''}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionsArabic', e.target.value)}
                              className="input-field text-sm"
                              placeholder={`Option ${oIndex + 1} (AR)`}
                              dir="rtl"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <i className="fas fa-info-circle"></i>
                      Select the radio button for the correct answer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
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
            <button
              type="reset"
              onClick={() => {
                const options = Array(optionCount).fill('');
                const optionsArabic = Array(optionCount).fill('');
                setFormData({
                  title: '',
                  titleArabic: '',
                  description: '',
                  descriptionArabic: '',
                  difficulty: 'easy',
                  timeLimit: 5,
                  points: 10,
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
                setMessage({ type: '', text: '' });
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <i className="fas fa-undo"></i>
              Reset
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-fadeInUp">
          <h4 className="font-semibold text-purple-800 flex items-center gap-2">
            <i className="fas fa-lightbulb"></i>
            Tips:
          </h4>
          <ul className="mt-2 text-sm text-purple-700 space-y-1">
            <li>• Questions and options must be in both French and Arabic</li>
            <li>• Choose 3 or 4 options per question</li>
            <li>• Select the correct answer by clicking the radio button</li>
            <li>• Add as many questions as you want</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
