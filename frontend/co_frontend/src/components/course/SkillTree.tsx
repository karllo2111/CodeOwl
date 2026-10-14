import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check, Lock, Sparkles, Layers, Box, PlusCircle, GitBranch, Repeat, Code, Globe, ArrowRight } from 'lucide-react';

export interface SkillNode {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  sort_order: number;
  mastery_percentage?: number;
  is_unlocked?: boolean;
  prerequisites?: { id: number; title: string; slug: string }[];
}

interface SkillTreeProps {
  skills?: SkillNode[];
  onSelectSkill?: (skill: SkillNode) => void;
  courseSlug?: string;
}

const defaultSkills: SkillNode[] = [
  { id: 1, slug: 'variables', title: 'Variables & Storage', description: 'let, const, memory containers & primitive types', icon: 'box', sort_order: 1, mastery_percentage: 100, is_unlocked: true },
  { id: 2, slug: 'operators', title: 'Operators & Logic', description: 'Arithmetic, strict equality, boolean logic & expressions', icon: 'plus-circle', sort_order: 2, mastery_percentage: 85, is_unlocked: true, prerequisites: [{ id: 1, title: 'Variables & Storage', slug: 'variables' }] },
  { id: 3, slug: 'conditionals', title: 'Control Flow', description: 'if/else branching, ternary expressions & guard clauses', icon: 'git-branch', sort_order: 3, mastery_percentage: 70, is_unlocked: true, prerequisites: [{ id: 2, title: 'Operators & Logic', slug: 'operators' }] },
  { id: 4, slug: 'loops', title: 'Iteration & Repetition', description: 'for loops, while loops, array traversals & termination guards', icon: 'repeat', sort_order: 4, mastery_percentage: 45, is_unlocked: true, prerequisites: [{ id: 3, title: 'Control Flow', slug: 'conditionals' }] },
  { id: 5, slug: 'functions', title: 'Functions & Modularity', description: 'Pure functions, parameter defaults, return statements & scope', icon: 'code', sort_order: 5, mastery_percentage: 20, is_unlocked: true, prerequisites: [{ id: 4, title: 'Iteration & Repetition', slug: 'loops' }] },
  { id: 6, slug: 'data-structures', title: 'Arrays & Objects', description: 'Key/value records, indexing, map, filter and reduce transformations', icon: 'layers', sort_order: 6, mastery_percentage: 0, is_unlocked: false, prerequisites: [{ id: 5, title: 'Functions & Modularity', slug: 'functions' }] },
  { id: 7, slug: 'dom', title: 'DOM & Events (Level 2)', description: 'Document tree querying, element mutation and listener callbacks', icon: 'globe', sort_order: 7, mastery_percentage: 0, is_unlocked: false, prerequisites: [{ id: 6, title: 'Arrays & Objects', slug: 'data-structures' }] },
];

const iconMap: Record<string, React.ElementType> = {
  box: Box,
  'plus-circle': PlusCircle,
  'git-branch': GitBranch,
  repeat: Repeat,
  code: Code,
  layers: Layers,
  globe: Globe,
};

export const SkillTree: React.FC<SkillTreeProps> = ({ skills = defaultSkills, onSelectSkill }) => {
  const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;
  const [activeSkill, setActiveSkill] = useState<SkillNode>(displaySkills[0]);

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Graf Kompetensi
            </span>
            <Badge variant="default" size="sm">6 Core Skills</Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-100">Interactive Skill Tree</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Progress through prerequisite concepts to unlock higher-tier programming abilities.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Mastered (80%+)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Tree Nodes on Left, Selected Skill Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Pipeline Flow */}
        <div className="lg:col-span-7 space-y-4">
          {displaySkills.map((skill, index) => {
            const Icon = iconMap[skill.icon || 'box'] || Box;
            const isSelected = activeSkill?.id === skill.id;
            const isMastered = (skill.mastery_percentage || 0) >= 80;
            const isUnlocked = skill.is_unlocked !== false;
            const isLast = index === displaySkills.length - 1;

            return (
              <div key={skill.id} className="relative">
                {/* SVG Connecting Pipe to Next Node */}
                {!isLast && (
                  <div className="absolute left-8 top-16 bottom-0 w-[2px] -mb-4 bg-white/[0.08] z-0" />
                )}

                <div
                  onClick={() => {
                    setActiveSkill(skill);
                    onSelectSkill?.(skill);
                  }}
                  className={`relative z-10 flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/20'
                      : 'bg-white/[0.025] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Skill Node Avatar */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isMastered
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : isUnlocked
                        ? 'bg-white/[0.08] border-white/20 text-white'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-600'
                    }`}
                  >
                    {isMastered ? (
                      <Check className="w-5 h-5" strokeWidth={2} />
                    ) : isUnlocked ? (
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Skill Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                        {skill.title}
                      </h4>
                      <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
                        {skill.mastery_percentage || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {skill.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered ? 'bg-emerald-400' : 'bg-white'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, skill.mastery_percentage || 0))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Inspector Card */}
        <div className="lg:col-span-5">
          <Card className="sticky top-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <Badge variant="eyebrow">Skill Inspector</Badge>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Tier {activeSkill.sort_order}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{activeSkill.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeSkill.description}
                </p>
              </div>

              {/* Mastery Stats */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Mastery</span>
                  <span className="font-bold text-white font-mono">{activeSkill.mastery_percentage || 0}%</span>
                </div>
                <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${activeSkill.mastery_percentage || 0}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Threshold for unlocking dependent abilities: 70%
                </div>
              </div>

              {/* Prerequisites list */}
              <div>
                <h5 className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                  Prasyarat
                </h5>
                {activeSkill.prerequisites && activeSkill.prerequisites.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeSkill.prerequisites.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={1.5} />
                        <span>{p.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    None (Foundation Skill)
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" className="w-full">
                  Practice This Skill
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
