import React, { useState } from "react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { EditorToolbar } from "../components/editor/EditorToolbar";
import { OutputPanel } from "../components/editor/OutputPanel";
import { apiClient } from "../api/client";

export const PlaygroundPage: React.FC = () => {
  const [code, setCode] = useState(`// Free-form Code Playground
// Write any JavaScript below and click 'Run Code'

function greet(name) {
    return "Hello, " + name + "! Welcome to CodeQuest.";
}

console.log(greet("Karllo"));

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);
`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    try {
      const res = await apiClient.post("/activities/1/run", { code, language: "javascript" });
      setOutput(res.data.data.output || (res.data.data.success ? "Done (no output)" : ""));
      setError(res.data.data.error || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to execute");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode("// Write your JavaScript code here\nconsole.log(\"Hello from CodeOwl!\");\n");
    setOutput("");
    setError(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-950">
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100">JavaScript Scratchpad</h2>
          <p className="text-[11px] text-slate-500">Test ideas, prototype functions, experiment freely</p>
        </div>
      </div>

      <EditorToolbar
        onRun={handleRun}
        onReset={handleReset}
        isRunning={isRunning}
        canSubmit={false}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 h-full min-h-0">
          <CodeEditor value={code} onChange={setCode} language="javascript" />
        </div>
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-slate-800 h-64 md:h-full">
          <OutputPanel output={output} error={error} />
        </div>
      </div>
    </div>
  );
};
