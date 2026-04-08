export function parseYoutubeId(input = '') {
  if (!input) return '';
  const raw = String(input).trim();
  if (!raw) return '';
  if (!raw.includes('http')) return raw;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
    /[?&]v=([A-Za-z0-9_-]{6,})/i
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1];
  }
  return raw;
}

export function normalizeLessons(lessons = [], fallback = {}) {
  if (!Array.isArray(lessons)) return [];
  return lessons.map((lesson, index) => ({
    id: lesson.id || `lesson-${index + 1}`,
    title: lesson.title || `Lesson ${index + 1}`,
    description: lesson.description || '',
    duration: lesson.duration || '',
    videoUrl: lesson.videoUrl || lesson.youtubeLink || lesson.youtubeUrl || '',
    youtubeId: parseYoutubeId(lesson.youtubeId || lesson.videoUrl || lesson.youtubeLink || lesson.youtubeUrl || fallback.youtubePlaylistId || ''),
    notesLink: lesson.notesLink || fallback.notesDriveLink || '',
    pdfLink: lesson.pdfLink || fallback.pdfDriveLink || ''
  }));
}

export function normalizeCourse(course) {
  const lessons = normalizeLessons(course.lessons || [], course);
  return {
    ...course,
    totalLessons: course.totalLessons || lessons.length,
    lessons,
    discountPercent:
      course.originalPrice && course.price < course.originalPrice
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0
  };
}

export function formatRemainingDays(dateString) {
  if (!dateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(dateString);
  exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam.getTime() - today.getTime()) / 86400000);
}
