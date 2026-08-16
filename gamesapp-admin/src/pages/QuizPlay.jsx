import React, { useState } from 'react';

export function QuizPlay({ quiz, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  if (!quiz || !quiz.questions) return <div>No questions available</div>;

  const question = quiz.questions[currentQuestion];
  if (!question) return <div>No questions available</div>;

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === question.correctAnswer) setScore(score + 10);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-800">Question {currentQuestion + 1} of {quiz.questions.length}</h3>
      <p className="text-xl font-medium text-gray-800 mt-4">{question.question}</p>
      <p className="text-gray-500 text-sm" dir="rtl">{question.questionArabic}</p>
      <div className="space-y-3 mt-4">
        {question.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} className="w-full text-left p-4 rounded-xl border-2 hover:border-blue-400 transition-all">
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selectedAnswer === null} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">Next</button>
    </div>
  );
}
