import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockCourses } from '../data/mockCourses';

const normalizeLessons = (course) => {
  if (Array.isArray(course.lessons) && course.lessons.length > 0) return course.lessons;

  const total = Number(course.totalLessons) || 0;
  return Array.from({ length: total || 1 }).map((_, index) => ({
    id: `${course.id}-lesson-${index + 1}`,
    title: `Lesson ${index + 1}`,
    description: course.shortDescription || course.description || 'Course lesson',
    videoId: course.youtubeVideoId || course.youtubePlaylistId || ''
  }));
};

const normalizeCourse = (docLike) => {
  const data = docLike.data ? docLike.data() : docLike;
  const id = docLike.id || data.id;
  const price = Number(data.price || 0);
  const originalPrice = Number(data.originalPrice || price || 0);
  const discount = originalPrice > price ? originalPrice - price : 0;

  return {
    id,
    title: data.title || 'Untitled Course',
    shortTitle: data.shortTitle || data.title || 'Untitled Course',
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    category: data.category || 'Theory',
    classType: data.classType || 'online',
    teacher: data.teacher || data.instructor || 'NextGen ICT',
    price,
    originalPrice,
    discount,
    thumbnail: data.thumbnail || data.image || 'https://placehold.co/600x340?text=NextGen+ICT',
    totalLessons: Number(data.totalLessons || data.lessonCount || 0),
    duration: data.duration || 'Flexible',
    youtubeVideoId: data.youtubeVideoId || '',
    youtubePlaylistId: data.youtubePlaylistId || '',
    pdfDriveLink: data.pdfDriveLink || '',
    notesDriveLink: data.notesDriveLink || '',
    driveLink: data.driveLink || '',
    status: data.status || 'published',
    featured: Boolean(data.featured),
    lessons: normalizeLessons({ ...data, id }),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
};

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const liveCourses = snap.docs.map(normalizeCourse);
      if (liveCourses.length > 0) {
        setCourses(liveCourses);
      } else {
        setCourses(mockCourses.map(normalizeCourse));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err?.message || 'Failed to load courses.');
      setCourses(mockCourses.map(normalizeCourse));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const publishedCourses = useMemo(
    () => courses.filter((course) => course.status !== 'draft' && course.status !== 'archived'),
    [courses]
  );

  const getCourseById = useCallback(
    (courseId) => publishedCourses.find((course) => String(course.id) === String(courseId)) || null,
    [publishedCourses]
  );

  return {
    courses: publishedCourses,
    loading,
    error,
    refreshCourses: fetchCourses,
    getCourseById
  };
}
