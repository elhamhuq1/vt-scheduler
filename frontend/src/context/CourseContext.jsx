import { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();

const COURSES_STORAGE_KEY = 'vt-scheduler-courses';

export function CourseProvider({ children }) {
  // Initialize state from localStorage or empty array
  const [selectedCourses, setSelectedCourses] = useState(() => {
    const savedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  // Save to localStorage whenever selectedCourses changes
  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const addCourse = (course) => {
    setSelectedCourses(prev => {
      if (prev.some(c => c.course_number === course.course_number && c.subject === course.subject)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const removeCourse = (courseToRemove) => {
    setSelectedCourses(prev => 
      prev.filter(course => 
        !(course.subject === courseToRemove.subject && 
          course.course_number === courseToRemove.course_number)
      )
    );
  };

  return (
    <CourseContext.Provider value={{ selectedCourses, addCourse, removeCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => useContext(CourseContext);