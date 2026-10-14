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

    // Next chapter is unlocked only if this chapter is completed
    previousMastered = isMastered;

    // Transform lessons for panel
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

    return {
      chapter: ch,
      index: idx + 1,
      state,
      masteryPercent,
      isMastered,
      lessons,
      glyph: ch.icon || 'code',
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
      {/* Sinuous / Zig-zag isometric path */}
      <div className="flex flex-col items-center space-y-12 sm:space-y-16">
        {nodes.map((node, i) => {
          // Responsive alternating layout (stagger left, center, right)
          const offsetStyles = [
            'sm:-translate-x-16 md:-translate-x-24', // Left
            'sm:translate-x-0',                      // Center
            'sm:translate-x-16 md:translate-x-24',   // Right
            'sm:translate-x-0',                      // Center back
          ][i % 4];

          return (
            <div key={node.chapter.id} className="relative flex flex-col items-center">
              {/* Connector line from previous node */}
              {i > 0 && (
                <div
                  className="w-1 h-8 sm:h-12 -mt-8 sm:-mt-12 mb-3 bg-[var(--border)] rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      node.state === 'completed' || node.state === 'active'
                        ? 'var(--accent)'
                        : 'var(--border)',
                  }}
                />
              )}

              {/* Isometric Tile */}
              <div className={`transition-transform duration-200 ${offsetStyles}`}>
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
            </div>
          );
        })}

        {/* Final Course Mystery Chest Node */}
        {nodes.length > 0 && (
          <div className="relative flex flex-col items-center pt-2">
            <div className="w-1 h-8 sm:h-12 mb-3 bg-[var(--border)] rounded-full" />
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
