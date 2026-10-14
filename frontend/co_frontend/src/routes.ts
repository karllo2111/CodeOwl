export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  CURRICULUM: '/kurikulum',
  COURSE_DETAIL: '/kurikulum/:slug',
  CHAPTER_DETAIL: '/bab/:id',
  LESSON: '/materi/:id',
  REVIEW: '/review/:id',
  PROJECT_WORKSPACE: '/proyek/:id',

  // Latihan sub-routes
  PRACTICE: '/latihan',
  PRACTICE_QUESTIONS: '/latihan/soal',
  PRACTICE_DEBUG: '/latihan/debug',
  PRACTICE_FIX: '/latihan/perbaiki',
  PRACTICE_CHALLENGES: '/latihan/tantangan',
  PRACTICE_PROJECTS: '/latihan/proyek',

  PLAYGROUND: '/playground',
  LEADERBOARD: '/peringkat',
  SHOP: '/toko',
  PROFILE: '/profil',
  SETTINGS: '/pengaturan',
  LOGIN: '/masuk',
  REGISTER: '/daftar',
  ADMIN: '/admin',
  DEV_UI: '/dev/ui',
} as const;

export const linkTo = {
  course: (slug: string) => `/kurikulum/${slug}`,
  chapter: (id: number | string) => `/bab/${id}`,
  lesson: (id: number | string) => `/materi/${id}`,
  review: (id: number | string) => `/review/${id}`,
  project: (id: number | string) => `/proyek/${id}`,
};
