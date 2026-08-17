import React, { useState } from 'react';

export function QuizPlay({ quiz, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-500">No questions available for this quiz</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">Close</button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-500">Question not found</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">Close</button>
      </div>
    );
  }

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
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="mb-6">
            {percentage >= 70 ? (
              <i className="fas fa-trophy text-6xl text-yellow-500"></i>
            ) : percentage >= 40 ? (
              <i className="fas fa-thumbs-up text-6xl text-blue-500"></i>
            ) : (
              <i className="fas fa-book text-6xl text-gray-400"></i>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Quiz Complete! 🎉</h3>
          <p className="text-gray-500 mt-2">You scored {score} points</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{totalQuestions - correctCount}</p>
                <p className="text-sm text-gray-500">Wrong</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={handleRestart} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium">
              <i className="fas fa-redo mr-2"></i>Try Again
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const options = question.options || [];
  const optionsArabic = question.optionsArabic || [];

  return (
    <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h3>
          <p className="text-sm text-gray-500">{quiz.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-100 rounded-lg">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            <span className="font-bold text-purple-700">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-xl font-medium text-gray-800">{question.question}</p>
        {question.questionArabic && (
          <p className="text-gray-500 text-sm mt-1" dir="rtl">{question.questionArabic}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedAnswer === null
                ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                : selectedAnswer === index
                ? question.correctAnswer === index
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : question.correctAnswer === index && selectedAnswer !== null
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <div className="flex-1">
                <span className="text-gray-800">{option}</span>
                {optionsArabic[index] && (
                  <p className="text-gray-500 text-sm" dir="rtl">{optionsArabic[index]}</p>
                )}
              </div>
              {selectedAnswer !== null && index === question.correctAnswer && (
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              )}
              {selectedAnswer === index && index !== question.correctAnswer && (
                <i className="fas fa-times-circle text-red-500 text-xl"></i>
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
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            selectedAnswer !== null
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion < quiz.questions.length - 1 ? (
            <>
              Next Question <i className="fas fa-arrow-right ml-2"></i>
            </>
          ) : (
            <>
              See Results <i className="fas fa-trophy ml-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
