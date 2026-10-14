import React, { useEffect, useState } from 'react';
import { coursesApi } from '../../api/courses';
import type { Course } from '../../types/course';
import { CourseCard } from '../../components/course/CourseCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.getCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Kursus"
        description="Jalur belajar terstruktur dengan bab berjenjang, ulangan, dan proyek penutup."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="Belum ada kursus"
          description="Kursus belum tersedia. Coba lagi nanti."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
