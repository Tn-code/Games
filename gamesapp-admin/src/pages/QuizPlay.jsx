import React, { useState } from 'react';

export function QuizPlay({ quiz, onClose, language }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-500">Aucune question disponible</p>
        <button onClick={onClose} className="mt-4 btn-primary">Fermer</button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-500">Question non trouvée</p>
        <button onClick={onClose} className="mt-4 btn-primary">Fermer</button>
      </div>
    );
  }

  const getDisplayText = (text, textAr) => {
    return language === 'fr' ? text : textAr || text;
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswer;
    if (isCorrect) {
      setScore(score + (quiz.points || 10));
    }
    setAnswers([...answers, { 
      questionIndex: currentQuestion, 
      selected: index, 
      correct: isCorrect 
    }]);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
  };

  if (showResult) {
    const correctCount = answers.filter(a => a.correct).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    return (
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto animate-scaleIn">
        <div className="text-center">
          <div className="mb-6">
            {percentage >= 70 ? (
              <div className="text-6xl floating">🏆</div>
            ) : percentage >= 40 ? (
              <div className="text-6xl floating">👍</div>
            ) : (
              <div className="text-6xl floating">📚</div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 animate-fadeInUp">
            {language === 'fr' ? 'Quiz Terminé ! 🎉' : 'انتهى الاختبار! 🎉'}
          </h3>
          <p className="text-gray-500 mt-2 animate-fadeInUp delay-200">
            {language === 'fr' ? 'Vous avez marqué' : 'لقد حصلت على'}{' '}
            <span className="text-2xl font-bold text-purple-600">{score}</span>{' '}
            {language === 'fr' ? 'points' : 'نقطة'}
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl grid grid-cols-3 gap-4 animate-fadeInUp delay-300">
            <div>
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-gray-500">{language === 'fr' ? 'Correctes' : 'صحيحة'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{totalQuestions - correctCount}</p>
              <p className="text-sm text-gray-500">{language === 'fr' ? 'Fausses' : 'خاطئة'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
              <p className="text-sm text-gray-500">{language === 'fr' ? 'Score' : 'النتيجة'}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={handleRestart} className="btn-primary flex items-center gap-2">
              <i className="fas fa-redo"></i>{language === 'fr' ? 'Recommencer' : 'أعد المحاولة'}
            </button>
            <button onClick={onClose} className="btn-secondary">{language === 'fr' ? 'Fermer' : 'أغلق'}</button>
          </div>
        </div>
      </div>
    );
  }

  const options = question.options || [];
  const optionsArabic = question.optionsArabic || [];

  return (
    <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto animate-scaleIn">
      {/* Quiz Image */}
      {quiz.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img 
            src={quiz.imageUrl} 
            alt={getDisplayText(quiz.title, quiz.titleArabic)} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {language === 'fr' ? 'Question' : 'سؤال'} {currentQuestion + 1} / {quiz.questions.length}
          </h3>
          <p className="text-sm text-gray-500">{getDisplayText(quiz.title, quiz.titleArabic)}</p>
        </div>
        <div className="px-4 py-2 bg-purple-100 rounded-lg animate-pulse">
          <i className="fas fa-star text-yellow-500 mr-2"></i>
          <span className="font-bold text-purple-700">{score} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6 animate-fadeInUp">
        <p className="text-xl font-medium text-gray-800">{getDisplayText(question.question, question.questionArabic)}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              selectedAnswer === null
                ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg'
                : selectedAnswer === index
                ? question.correctAnswer === index
                  ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200'
                  : 'border-red-500 bg-red-50 shadow-lg shadow-red-200'
                : question.correctAnswer === index && selectedAnswer !== null
                ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200'
                : 'border-gray-200 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-all duration-300 ${
                selectedAnswer === null
                  ? 'bg-gray-100 text-gray-600'
                  : selectedAnswer === index && question.correctAnswer === index
                  ? 'bg-green-500 text-white'
                  : selectedAnswer === index && question.correctAnswer !== index
                  ? 'bg-red-500 text-white'
                  : question.correctAnswer === index && selectedAnswer !== null
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <div className="flex-1">
                <span className="text-gray-800">{getDisplayText(option, optionsArabic[index])}</span>
              </div>
              {selectedAnswer !== null && index === question.correctAnswer && (
                <i className="fas fa-check-circle text-green-500 text-xl animate-bounceIn"></i>
              )}
              {selectedAnswer === index && index !== question.correctAnswer && (
                <i className="fas fa-times-circle text-red-500 text-xl animate-bounceIn"></i>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Next button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform ${
            selectedAnswer !== null
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-600/30 hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion < quiz.questions.length - 1 ? (
            <>
              {language === 'fr' ? 'Question suivante' : 'السؤال التالي'} <i className="fas fa-arrow-right ml-2"></i>
            </>
          ) : (
            <>
              {language === 'fr' ? 'Voir les résultats' : 'عرض النتائج'} <i className="fas fa-trophy ml-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
