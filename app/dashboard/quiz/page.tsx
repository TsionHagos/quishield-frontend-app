'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

const getUserIdFromToken = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    return null;
  }
};

interface Question {
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

interface Quiz {
  id: number;
  title: string;
  moduleId: number;
  moduleRoute: string;
  questions: Question[];
}

const QUIZZES: Quiz[] = [
  {
    id: 1,
    title: "Recognizing Quishing",
    moduleId: 1,
    moduleRoute: "/training/recognizing-quishing",
    questions: [
      {
        question: "What is quishing?",
        options: ["Email phishing", "QR code phishing", "SMS phishing", "Voice phishing"],
        correct: 1,
      },
      {
        question: "Which of these is a red flag when scanning a QR code?",
        options: [
          "The QR code is on an official company website",
          "Suspicious urgency in the message",
          "The URL contains the company name",
          "The QR code is in color",
        ],
        correct: 1,
      },
      {
        question: "Should you scan unknown QR codes?",
        options: [
          "Yes, always",
          "Only if they look official",
          "No, always verify first",
          "Only on your work phone",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Safe QR Scanning",
    moduleId: 2,
    moduleRoute: "/training/safe-qr-scanning",
    questions: [
      {
        question: "What should you verify first before opening a QR code URL?",
        options: ["The color of the QR code", "The destination URL", "Who is standing near you", "The size of the QR code"],
        correct: 1,
      },
      {
        question: "What does HTTPS mean?",
        options: [
          "The website is fast",
          "The website is popular",
          "The connection is encrypted and more secure",
          "The website is government owned",
        ],
        correct: 2,
      },
      {
        question: "Which app helps verify QR codes?",
        options: ["Instagram", "A QR verification app", "Google Maps", "Calculator"],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Mobile Security",
    moduleId: 3,
    moduleRoute: "/training/mobile-security",
    questions: [
      {
        question: "How can you protect your phone from QR attacks?",
        options: [
          "Turn off WiFi",
          "Keep OS updated and use Mobile Threat Defense",
          "Delete all apps",
          "Never use QR codes",
        ],
        correct: 1,
      },
      {
        question: "What is FIDO2/Passkeys?",
        options: [
          "A type of QR code",
          "A passwordless authentication method",
          "A mobile antivirus",
          "A VPN service",
        ],
        correct: 1,
      },
      {
        question: "Where are you most at risk from QR code attacks?",
        options: [
          "At home",
          "In public places with unknown QR codes",
          "On official websites",
          "In your email inbox",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Reporting Suspicious QR Codes",
    moduleId: 4,
    moduleRoute: "/training/reporting",
    questions: [
      {
        question: "What should you do if you receive a suspicious QR code email?",
        options: [
          "Scan it to check",
          "Forward it to friends",
          "Report it to your IT department",
          "Delete it without reporting",
        ],
        correct: 2,
      },
      {
        question: "Which is a red flag in a QR code email?",
        options: [
          "Company logo present",
          "Sent from official domain",
          "Urgent language and unknown sender",
          "Plain text format",
        ],
        correct: 2,
      },
      {
        question: "After scanning a fake QR code, what should you do first?",
        options: [
          "Ignore it",
          "Tell your friends",
          "Report it immediately to IT security",
          "Change your wallpaper",
        ],
        correct: 2,
      },
    ],
  },
];

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? getUserIdFromToken() : null;

  const currentQuiz = selectedQuiz;
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // already answered

    setSelectedAnswer(optionIndex);

    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion && optionIndex === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Finish quiz
      const finalScore = Math.round((score / currentQuiz.questions.length) * 100);
      setShowResults(true);
      saveQuizResult(finalScore);
    }
  };

  const saveQuizResult = async (finalScore: number) => {
    if (!currentQuiz || !userId || !token) return;

    try {
      await fetch(`${API_BASE}/awareness/quiz/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          quiz_id: currentQuiz.id,
          score: finalScore,
        }),
      });
    } catch {
      console.error("Failed to save quiz result");
    }
  };

  const getFeedback = (score: number) => {
    if (score === 100) return "Excellent! You fully understand this topic.";
    if (score >= 67) return "Good job! Review the module to strengthen your knowledge.";
    return "Keep learning! Revisit the training module.";
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  // ====================== RESULTS SCREEN ======================
  if (showResults && currentQuiz) {
    const finalScore = Math.round((score / currentQuiz.questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="text-8xl font-bold tracking-tighter mb-2">{finalScore}</div>
        <div className="text-2xl font-medium mb-8">Your Score</div>

        <div className="text-lg text-muted-foreground mb-3">
          {score} out of {currentQuiz.questions.length} correct
        </div>

        <div className="mx-auto max-w-md mb-12 text-lg text-muted-foreground">
          {getFeedback(finalScore)}
        </div>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button onClick={resetQuiz} className="py-4 rounded-2xl border border-border font-medium">
            Back to Quizzes
          </button>
          <button onClick={() => handleQuizSelect(currentQuiz)} className="py-4 rounded-2xl bg-primary font-medium">
            Retake Quiz
          </button>
          <Link
            href={currentQuiz.moduleRoute}
            className="py-4 rounded-2xl bg-secondary font-medium"
          >
            Start Training
          </Link>
        </div>
      </div>
    );
  }

  // ====================== QUESTION SCREEN ======================
  if (currentQuiz && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <span>{currentQuiz.title}</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full">
            <div
              className="h-1.5 bg-primary rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-3xl font-semibold tracking-tight mb-10">{currentQuestion.question}</h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = currentQuestion.correct === index;

            let borderClass = "border-border hover:border-primary/40";
            if (selectedAnswer !== null) {
              if (isCorrect) borderClass = "border-emerald-400 bg-emerald-400/10";
              else if (isSelected) borderClass = "border-red-400 bg-red-400/10";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-6 rounded-2xl border text-lg transition-all ${borderClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-8">
            <button
              onClick={handleNextQuestion}
              className="w-full py-5 rounded-2xl bg-primary text-lg font-medium"
            >
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ====================== QUIZ SELECTION ======================
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-3">Quizzes</h1>
      <p className="text-muted-foreground mb-10 text-lg">Test your knowledge</p>

      <div className="grid md:grid-cols-2 gap-5">
        {QUIZZES.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => handleQuizSelect(quiz)}
            className="text-left p-8 border border-border bg-card hover:border-primary/40 rounded-3xl transition-all"
          >
            <div className="text-sm text-primary font-medium mb-1">QUIZ {quiz.id}</div>
            <div className="text-2xl font-semibold tracking-tight mb-2">{quiz.title}</div>
            <div className="text-muted-foreground">Module {quiz.moduleId}</div>
            <div className="mt-6 text-primary text-sm font-medium flex items-center gap-2">
              Start Quiz →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
