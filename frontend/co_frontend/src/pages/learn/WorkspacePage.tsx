import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { coursesApi } from "../../api/courses";
import { useEditorStore } from "../../stores/editorStore";
import { useUiStore } from "../../stores/uiStore";
import { useAuthStore } from "../../stores/authStore";
import type { Lesson } from "../../types/course";
import type { Activity } from "../../types/activity";
import { CodeEditor } from "../../components/editor/CodeEditor";
import { EditorToolbar } from "../../components/editor/EditorToolbar";
import { OutputPanel } from "../../components/editor/OutputPanel";
import { TestResults } from "../../components/editor/TestResults";
import { HintPanel } from "../../components/course/HintPanel";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useProgressStore } from "../../stores/progressStore";

export const WorkspacePage: React.FC<{ lessonId?: number }> = ({ lessonId: propLessonId }) => {
  const { id } = useParams<{ id: string }>();
  const lessonId = propLessonId || Number(id);

  const {
    code,
    output,
    error,
    isRunning,
    isSubmitting,
    submission,
    hints,
    setCode,
    runCode,
    submitCode,
    requestHint,
    reset,
  } = useEditorStore();

  const { showXpPopup } = useUiStore();
  const { fetchUser } = useAuthStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    coursesApi
      .getLesson(lessonId)
      .then((l) => {
        setLesson(l);
        if (l.activity) {
          setActivity(l.activity);
          reset(l.activity.starter_code || "");
        }
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleRun = () => {
    if (activity) runCode(activity.id);
  };

  const handleSubmit = async () => {
    if (!activity) return;
    try {
      const sub = await submitCode(activity.id);
      if (sub.status === "passed") {
        if (lesson) {
          useProgressStore.getState().completeLesson(lesson.id);
        }
        showXpPopup(activity.xp_reward || 50);
        fetchUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleHint = () => {
    if (activity) requestHint(activity.id);
  };

  const handleReset = () => {
    if (activity) reset(activity.starter_code || "");
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading exercise workspace...</div>;
  if (!lesson || !activity) return <div className="p-8 text-center text-rose-400">Activity not found.</div>;

  const isCompleted = submission?.status === "passed";
  const isDebug = lesson.type === "debug";
  const [debugStep, setDebugStep] = useState<'diagnose' | 'resolve'>('diagnose');
  const [suspectedLine, setSuspectedLine] = useState<number>(3);
  const [suspectedCause, setSuspectedCause] = useState<string>("wrong_variable");
  const [diagnosisConfirmed, setDiagnosisConfirmed] = useState<boolean>(false);

  const bugCauses = [
    { value: 'wrong_variable', label: 'Wrong variable name typo (ReferenceError)' },
    { value: 'syntax_error', label: 'Missing syntax token or bracket (SyntaxError)' },
    { value: 'runtime_error', label: 'Invalid property access (TypeError)' },
    { value: 'logic_error', label: 'Incorrect operator or boolean logic' },
    { value: 'incorrect_condition', label: 'Boundary check condition off-by-one' },
  ];

  const handleConfirmDiagnosis = () => {
    setDiagnosisConfirmed(true);
    setDebugStep('resolve');
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#050505] font-sans">
      {/* Left Instructions Column (5 cols) */}
      <div className="w-full md:w-5/12 border-r border-[var(--border)] flex flex-col h-full bg-[var(--surface)] overflow-y-auto">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <Link
            to={"/chapters/" + lesson.chapter_id}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back to Chapter
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="eyebrow">
              {lesson.type.replace("_", " ")}
            </Badge>
            <Badge variant="xp" size="sm">
              +{activity.xp_reward} XP
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                Difficulty: {lesson.difficulty || 'Normal'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{lesson.title}</h2>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {activity.instructions}
            </div>
          </div>

          {/* DEBUG STAGE STEPPER */}
          {isDebug && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-[10px] font-semibold text-[var(--text-subtle)]">
                  Bug Hunter Protocol
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {debugStep === 'diagnose' ? 'Stage 1/2' : 'Stage 2/2'}
                </span>
              </div>

              {debugStep === 'diagnose' && !diagnosisConfirmed ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    <strong>Stage 1 — Diagnose:</strong> Identify the bug location and root cause before editing code.
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400">Suspected Gutter Line:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={suspectedLine}
                      onChange={(e) => setSuspectedLine(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400">Root Cause Category:</label>
                    <select
                      value={suspectedCause}
                      onChange={(e) => setSuspectedCause(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                    >
                      {bugCauses.map((c) => (
                        <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-2"
                    onClick={handleConfirmDiagnosis}
                  >
                    Confirm Diagnosis & Proceed to Fix
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>Diagnosis confirmed on line #{suspectedLine}: {suspectedCause}</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    <strong>Stage 2 — Resolve:</strong> Edit the code in the editor, run tests, and click Submit when ready.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5-Tier Hint System */}
          <HintPanel hints={hints} onRequestHint={handleHint} availableHintsCount={4} />

          {/* Completion Celebration Card */}
          {isCompleted && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={2} />
                <div>
                  <div className="font-bold text-sm text-white">
                    {lesson.type === 'fix' ? 'FIX VERIFIED ✓' : 'CHALLENGE COMPLETED ✓'}
                  </div>
                  <div className="text-xs text-emerald-300/90">
                    All tests evaluated successfully. +{activity.xp_reward} XP awarded.
                  </div>
                </div>
              </div>
              <Link to={"/lessons/" + (lesson.id + 1)}>
                <Button variant="success" size="sm" className="w-full">
                  Lanjut ke Pelajaran Berikutnya
                  <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Editor & Results Column (7 cols) */}
      <div className="w-full md:w-7/12 flex flex-col h-full overflow-hidden bg-black/40">
        <EditorToolbar
          onRun={handleRun}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
        />

        <div className="flex-1 min-h-0 relative">
          <CodeEditor value={code} onChange={setCode} language="javascript" />
        </div>

        <div className="h-60 border-t border-[var(--border)] flex flex-col shrink-0 bg-[var(--surface)]">
          <TestResults submission={submission} />
          <div className="flex-1 min-h-0">
            <OutputPanel output={output} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};
