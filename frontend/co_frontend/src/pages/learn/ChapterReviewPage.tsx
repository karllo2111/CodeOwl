import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useProgressStore } from '../../stores/progressStore';
import { useUiStore } from '../../stores/uiStore';

interface ReviewPart {
  id: number;
  part: 'recall' | 'coding' | 'debugging' | 'fixing' | 'application' | 'final';
  partName: string;
  category: 'theory' | 'coding' | 'debugging' | 'fixing' | 'problem_solving';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  codeSnippet?: string;
}

const mockReviewItems: ReviewPart[] = [
  {
    id: 1,
    part: 'recall',
    partName: 'Part 1: Conceptual Recall',
    category: 'theory',
    question: 'Which keyword prevents reassignment of a variable binding in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'const',
  },
  {
    id: 2,
    part: 'recall',
    partName: 'Part 1: Conceptual Recall',
    category: 'theory',
    question: 'What is the output of `typeof null` in standard JavaScript?',
    options: ['null', 'undefined', 'object', 'number'],
    correctAnswer: 'object',
  },
  {
    id: 3,
    part: 'coding',
    partName: 'Part 2: Coding Implementation',
    category: 'coding',
    question: 'How do you calculate the total cost of `price` with a 10% tax in JavaScript?',
    options: ['price + 10', 'price * 1.10', 'price / 1.10', 'price + "10%"'],
    correctAnswer: 'price * 1.10',
  },
  {
    id: 4,
    part: 'debugging',
    partName: 'Part 3: Bug Identification',
    category: 'debugging',
    question: 'What runtime error occurs when executing `const x = 5; x = 10;`?',
    options: ['ReferenceError', 'TypeError: Assignment to constant variable', 'SyntaxError', 'RangeError'],
    correctAnswer: 'TypeError: Assignment to constant variable',
  },
  {
    id: 5,
    part: 'fixing',
    partName: 'Part 4: Logic Repair',
    category: 'fixing',
    question: 'A function returns `"5" + 3` instead of `8`. What is the fix?',
    options: ['Number("5") + 3', 'String("5" + 3)', '"5" - 3', 'Boolean("5") + 3'],
    correctAnswer: 'Number("5") + 3',
  },
  {
    id: 6,
    part: 'final',
    partName: 'Part 5: Final Chapter Challenge',
    category: 'problem_solving',
    question: 'Which method transforms every element in an array into a new value without mutating the original array?',
    options: ['forEach()', 'push()', 'map()', 'filter()'],
    correctAnswer: 'map()',
  },
];

export const ChapterReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id) || 1;
  const { showXpPopup } = useUiStore();
  const { completeLesson } = useProgressStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = mockReviewItems[currentIndex];
  const totalItems = mockReviewItems.length;

  const handleSelectAnswer = (ans: string | number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentItem.id]: ans }));
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    let correctCount = 0;
    mockReviewItems.forEach((item) => {
      if (selectedAnswers[item.id] === item.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalItems) * 100);
    if (score >= 80) {
      await completeLesson(lessonId);
      showXpPopup(300);
    }
  };

  let correctCount = 0;
  mockReviewItems.forEach((item) => {
    if (selectedAnswers[item.id] === item.correctAnswer) {
      correctCount++;
    }
  });
  const overallMastery = Math.round((correctCount / totalItems) * 100);
  const isMastered = overallMastery >= 80;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-10 space-y-6 font-sans">
        <div className="bezel-shell">
          <div className="bezel-core p-8 text-center space-y-6">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border ${
              isMastered
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Trophy className="w-8 h-8" strokeWidth={1.5} />
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Examination Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {isMastered ? 'CHAPTER MASTERED ✓' : 'REVIEW COMPLETED'}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                {isMastered
                  ? 'Congratulations! You have demonstrated >= 80% mastery across theory recall, implementation, and debugging.'
                  : 'You scored below the 80% mastery threshold. Review weak areas and retake to unlock chapter progression.'}
              </p>
            </div>

            {/* Score Breakdown Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400">Overall</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{overallMastery}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400">Theory</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">100%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400">Coding</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{isMastered ? '85%' : '60%'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400">Debugging</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{isMastered ? '80%' : '50%'}</div>
              </div>
            </div>

            {isMastered ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                <span>Award: <strong>+300 XP</strong> & <strong>+150 Coins</strong></span>
                <span className="font-semibold text-emerald-400">Next Chapter Unlocked</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>Weak concept detected: <strong>Variable types and reassignments</strong>. Practice this concept before retrying.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/courses/javascript-fundamentals" className="flex-1">
                <Button variant="secondary" size="md" className="w-full">
                  Back to Curriculum Roadmap
                </Button>
              </Link>
              {!isMastered && (
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentIndex(0);
                    setSelectedAnswers({});
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                  Retry Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <Link
          to="/courses/javascript-fundamentals"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Exit Review
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Item {currentIndex + 1} of {totalItems}
          </span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {currentItem.partName}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentItem.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentItem.options?.map((opt, idx) => {
              const isSelected = selectedAnswers[currentItem.id] === opt;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? 'bg-white text-slate-950 font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isSelected ? 'bg-black text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={!selectedAnswers[currentItem.id]}
              onClick={handleNext}
            >
              {currentIndex === totalItems - 1 ? 'Finish & Grade' : 'Next Item'}
              <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
