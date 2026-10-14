import React, { useState } from 'react';
import { IsometricTile, type TileState } from './IsometricTile';
import { ChapterPanel, type ChapterDetails } from './ChapterPanel';
import type { Chapter } from '../../types/course';
import { useProgressStore } from '../../stores/progressStore';

export interface RoadmapViewProps {
  chapters: Chapter[];
  onChapterSelect?: (chapterId: number) => void;
  className?: string;
}

const OFFSETS_PX = [0, -80, 0, 80];

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  chapters,
  className = '',
}) => {
  const { isLessonCompleted } = useProgressStore();
  const [selectedChapter, setSelectedChapter] = useState<ChapterDetails | null>(null);

  // Map chapter states
  const sortedChapters = [...chapters].sort((a, b) => a.sort_order - b.sort_order);

  // Compute node status sequentially
  let previousMastered = true;

  const nodes = sortedChapters.map((ch, idx) => {
    const chapterLessons = ch.lessons || [];
    const completedCount = chapterLessons.filter((l) => isLessonCompleted(l.id)).length;
    const totalCount = chapterLessons.length;
    const masteryPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const threshold = ch.mastery_threshold ?? 80;
    const isMastered = masteryPercent >= threshold;

    let state: TileState = 'locked';
    if (isMastered) {
      state = 'completed';
    } else if (previousMastered) {
      state = 'active';
    } else {
      state = 'locked';
    }

    previousMastered = isMastered;

    const lessons = chapterLessons.map((l, lIdx) => {
      const isDone = isLessonCompleted(l.id);
      const isPrevDone = lIdx === 0 ? true : isLessonCompleted(chapterLessons[lIdx - 1]?.id);
      return {
        id: l.id,
        title: l.title,
        type: l.type,
        difficulty: l.difficulty,
        estimated_minutes: l.estimated_minutes,
        xp_reward: l.xp_reward,
        is_completed: isDone,
        is_locked: state === 'locked' || (!isDone && !isPrevDone),
      };
    });

    const offsetIndex = idx % 4;
    const offsetX = OFFSETS_PX[offsetIndex];

    return {
      chapter: ch,
      index: idx + 1,
      state,
      masteryPercent,
      isMastered,
      lessons,
      glyph: ch.icon || 'code',
      offsetX,
      offsetClass: [
        'sm:translate-x-0',
        'sm:-translate-x-20',
        'sm:translate-x-0',
        'sm:translate-x-20',
      ][offsetIndex],
    };
  });

  const handleTileClick = (node: typeof nodes[0]) => {
    setSelectedChapter({
      id: node.chapter.id,
      title: node.chapter.title,
      description: node.chapter.description,
      sort_order: node.chapter.sort_order,
      mastery_percentage: node.masteryPercent,
      mastery_threshold: node.chapter.mastery_threshold ?? 80,
      is_mastered: node.isMastered,
      lessons: node.lessons,
    });
  };

  return (
    <div className={`relative py-8 px-4 max-w-4xl mx-auto ${className}`}>
      {/* Sinuous isometric path with mathematically connected bezier road */}
      <div className="flex flex-col items-center">
        {nodes.map((node, i) => {
          const prevNode = i > 0 ? nodes[i - 1] : null;

          return (
            <React.Fragment key={node.chapter.id}>
              {/* Connector from previous tile to current tile */}
              {prevNode && (
                <div className="w-full flex justify-center my-1 select-none pointer-events-none">
                  {/* Desktop curved bezier connector */}
                  <svg
                    className="hidden sm:block overflow-visible h-12 w-64"
                    viewBox="-120 0 240 48"
                  >
                    <path
                      d={`M ${prevNode.offsetX} 0 C ${prevNode.offsetX} 26, ${node.offsetX} 22, ${node.offsetX} 48`}
                      fill="none"
                      stroke={
                        node.state === 'completed' || node.state === 'active'
                          ? 'var(--accent)'
                          : 'var(--border)'
                      }
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={node.state === 'locked' ? '5 5' : undefined}
                    />
                  </svg>
                  {/* Mobile straight vertical connector */}
                  <div
                    className="sm:hidden w-0.5 h-8 rounded-full"
                    style={{
                      backgroundColor:
                        node.state === 'completed' || node.state === 'active'
                          ? 'var(--accent)'
                          : 'var(--border)',
                    }}
                  />
                </div>
              )}

              {/* Isometric Tile Container */}
              <div className={`transition-transform duration-200 ${node.offsetClass}`}>
                <IsometricTile
                  id={node.chapter.id}
                  title={node.chapter.title}
                  chapterNumber={node.index}
                  glyphName={node.glyph}
                  state={node.state}
                  masteryPercent={node.masteryPercent}
                  onClick={() => handleTileClick(node)}
                />
              </div>
            </React.Fragment>
          );
        })}

        {/* Final Course Mystery Chest Node */}
        {nodes.length > 0 && (
          <>
            {/* Connector to chest */}
            <div className="w-full flex justify-center my-1 select-none pointer-events-none">
              <svg
                className="hidden sm:block overflow-visible h-12 w-64"
                viewBox="-120 0 240 48"
              >
                <path
                  d={`M ${nodes[nodes.length - 1].offsetX} 0 C ${nodes[nodes.length - 1].offsetX} 26, 0 22, 0 48`}
                  fill="none"
                  stroke={previousMastered ? 'var(--warning)' : 'var(--border)'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={previousMastered ? undefined : '5 5'}
                />
              </svg>
              <div
                className="sm:hidden w-0.5 h-8 rounded-full"
                style={{
                  backgroundColor: previousMastered ? 'var(--warning)' : 'var(--border)',
                }}
              />
            </div>

            <div className="transition-transform duration-200">
              <IsometricTile
                id="course-final-chest"
                title="Peti Kelulusan"
                glyphName="chest"
                state={previousMastered ? 'active' : 'chest'}
                masteryPercent={100}
                onClick={() => {
                  const lastNode = nodes[nodes.length - 1];
                  if (lastNode) handleTileClick(lastNode);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Side Panel Drawer / Bottom Sheet */}
      <ChapterPanel
        isOpen={!!selectedChapter}
        onClose={() => setSelectedChapter(null)}
        chapter={selectedChapter}
      />
    </div>
  );
};
