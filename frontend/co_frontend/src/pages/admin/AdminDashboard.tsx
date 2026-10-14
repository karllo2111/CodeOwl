import React, { useEffect, useState } from "react";
import { coursesApi } from "../../api/courses";
import type { Course } from "../../types/course";
import { Card } from "../../components/ui/Card";
import { ShieldCheck } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    coursesApi.getCourses().then(setCourses).catch(console.error);
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Content Management CMS</h1>
          <p className="text-xs text-slate-400">Create and modify courses, chapters, exercises, tests, and hints</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Kursus Dikelola</h3>
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{course.title}</h4>
                <span className="text-xs text-slate-500">{course.slug}</span>
              </div>
              <div className="text-xs text-slate-400">
                {course.chapters_count || 6} Chapters Published
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
