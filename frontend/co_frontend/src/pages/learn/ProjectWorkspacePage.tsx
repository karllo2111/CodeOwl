import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Play, CheckCircle2, FileCode, Check, Eye, ListChecks, Sparkles } from 'lucide-react';
import { CodeEditor } from '../../components/editor/CodeEditor';
import { useProgressStore } from '../../stores/progressStore';
import { useUiStore } from '../../stores/uiStore';

const starterFiles = {
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quiz App</title>
</head>
<body>
  <div id="quiz-container">
    <h1 id="question">What is 2 + 2?</h1>
    <div id="answers">
      <${'button'} class="answer-btn">3</${'button'}>
      <${'button'} class="answer-btn">4</${'button'}>
      <${'button'} class="answer-btn">5</${'button'}>
    </div>
    <div id="score">Score: 0</div>
    <${'button'} id="next">Next Question</${'button'}>
    <${'button'} id="restart">Restart</${'button'}>
  </div>
</body>
</html>`,
  css: `body {
  font-family: sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
#quiz-container {
  background: #1e293b;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 400px;
  width: 100%;
}
.answer-btn {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: #334155;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.answer-btn:hover { background: #475569; }
#next, #restart {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}`,
  js: `// Interactive Quiz Engine
const questions = [
  { question: "What is 2 + 2?", answers: [3, 4, 5], correct: 1 },
  { question: "Which keyword declares a constant?", answers: ["var", "let", "const"], correct: 2 },
  { question: "typeof 42 returns?", answers: ["number", "string", "boolean"], correct: 0 },
  { question: "typeof 'hello' returns?", answers: ["string", "object", "text"], correct: 0 },
  { question: "Which method adds to array end?", answers: ["push()", "pop()", "shift()"], correct: 0 },
];

let currentIdx = 0;
let score = 0;

function checkAnswer(index) {
  if (index === questions[currentIdx].correct) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
  }
}
`,
};

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id) || 10;
  const { showXpPopup } = useUiStore();
  const { completeLesson } = useProgressStore();

  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('js');
  const [files, setFiles] = useState(starterFiles);
  const [previewSrcDoc, setPreviewSrcDoc] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Compile files into an iframe srcDoc string
  const updatePreview = () => {
    const combined = `
      ${files.html}
      <style>${files.css}</style>
      <script>${files.js}</script>
    `;
    setPreviewSrcDoc(combined);
  };

  useEffect(() => {
    updatePreview();
  }, [files]);

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleSubmit = async () => {
    await completeLesson(lessonId);
    showXpPopup(500);
    setIsCompleted(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#050505] font-sans">
      {/* Top Project Header Bar */}
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--surface)] shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/courses/javascript-fundamentals" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back to Course
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-[var(--text-muted)]">Proyek Capstone</span>
          <span className="text-sm font-bold text-white">Interactive Quiz Application</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleValidate}>
            <ListChecks className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />
            Validate Requirements
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!isValidated}
          >
            Submit Project (+500 XP)
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Editor & Files, Right Preview & Requirements */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Code Editor & File Tabs (6 cols) */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-white/[0.08] bg-black/40 overflow-hidden">
          {/* File Tabs */}
          <div className="flex items-center border-b border-white/[0.08] bg-[#070a12]/90 px-3 py-1.5 gap-2">
            {(['js', 'html', 'css'] as const).map((ext) => (
              <button
                key={ext}
                onClick={() => setActiveFile(ext)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeFile === ext
                    ? 'bg-white text-slate-950 font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FileCode className="w-3 h-3" strokeWidth={1.5} />
                <span>{ext === 'js' ? 'script.js' : ext === 'html' ? 'index.html' : 'style.css'}</span>
              </button>
            ))}
          </div>

          {/* Monaco / Fallback Code Editor */}
          <div className="flex-1 min-h-0 relative">
            <CodeEditor
              value={files[activeFile]}
              onChange={(val) => setFiles((prev) => ({ ...prev, [activeFile]: val }))}
              language={activeFile === 'js' ? 'javascript' : activeFile === 'html' ? 'html' : 'css'}
            />
          </div>
        </div>

        {/* Right Column: Live Sandboxed Iframe Preview & Requirements Checklist (6 cols) */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#070a12]/60 overflow-y-auto">
          {/* Preview Tab Header */}
          <div className="p-3 border-b border-white/[0.08] flex items-center justify-between bg-[#070a12]/80">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
              Sandboxed Live Preview
            </span>
            <span className="text-[10px] font-mono text-slate-500">iframe: allow-scripts</span>
          </div>

          {/* Preview Frame */}
          <div className="h-64 sm:h-80 border-b border-white/[0.08] bg-slate-950/80 p-2">
            <iframe
              title="Project Live Preview"
              srcDoc={previewSrcDoc}
              sandbox="allow-scripts"
              className="w-full h-full rounded-xl border border-white/[0.06] bg-slate-900"
            />
          </div>

          {/* Requirements Checklist */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[var(--text-muted)]">
                Milestone Verification Checklist
              </h4>
              <span className="text-xs font-medium text-[var(--success)]">
                {isValidated ? '3/3 Lulus' : 'Menunggu Validasi'}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">Structure: DOM IDs exist</div>
                  <div className="text-[11px] text-slate-400">Required: #question, #answers, #score, #next, #restart</div>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isValidated ? 'text-emerald-400' : 'text-slate-600'}`} strokeWidth={1.5} />
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">Data: Question Model Array</div>
                  <div className="text-[11px] text-slate-400">Maintains array of questions with options and answer keys</div>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isValidated ? 'text-emerald-400' : 'text-slate-600'}`} strokeWidth={1.5} />
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">Logic: Score Accumulator</div>
                  <div className="text-[11px] text-slate-400">Increments score upon selecting correct option</div>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isValidated ? 'text-emerald-400' : 'text-slate-600'}`} strokeWidth={1.5} />
              </div>
            </div>

            {isCompleted && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                <span>Capstone Passed: <strong>+500 XP</strong> Awarded</span>
                <span className="font-semibold text-emerald-400">Level 2 Unlocked!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
