import { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();
const COURSES_STORAGE_KEY = 'vt-scheduler-courses';
const SECTIONS_STORAGE_KEY = 'vt-scheduler-sections';
const CHECKED_COURSES_KEY = 'vt-scheduler-checked';

export function CourseProvider({ children }) {
  const [selectedCourses, setSelectedCourses] = useState(() => {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSections, setSelectedSections] = useState(() => {
    const saved = localStorage.getItem(SECTIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [checkedCourses, setCheckedCourses] = useState(() => {
    const saved = localStorage.getItem(CHECKED_COURSES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [generatedSchedules, setGeneratedSchedules] = useState([]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(selectedCourses));
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(selectedSections));
    localStorage.setItem(CHECKED_COURSES_KEY, JSON.stringify(checkedCourses));
  }, [selectedCourses, selectedSections, checkedCourses]);

  const addCourse = (course) => {
    setSelectedCourses(prev => {
      if (prev.some(c => c.course_number === course.course_number && c.subject === course.subject)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const removeCourse = (courseToRemove) => {
    // Remove from selectedCourses
    setSelectedCourses(prev => 
      prev.filter(course => 
        !(course.subject === courseToRemove.subject && 
          course.course_number === courseToRemove.course_number)
      )
    );

    // Remove from selectedSections
    const courseId = `${courseToRemove.subject}-${courseToRemove.course_number}`;
    setSelectedSections(prev => {
      const { [courseId]: removed, ...rest } = prev;
      return rest;
    });

    // Remove from checkedCourses
    setCheckedCourses(prev => 
      prev.filter(id => id !== courseId)
    );
  };

  const updateSelectedSections = (courseId, sections) => {
    setSelectedSections(prev => ({
      ...prev,
      [courseId]: sections
    }));
  };

  const updateCheckedCourses = (courseIds) => {
    setCheckedCourses(courseIds);
  };

  const generatePossibleSchedules = () => {
    // Only consider checked courses
    const coursesToSchedule = selectedCourses.filter(course => 
      checkedCourses.includes(`${course.subject}-${course.course_number}`)
    );

    // Get selected sections for each course
    const courseSections = coursesToSchedule.map(course => {
      const courseId = `${course.subject}-${course.course_number}`;
      return {
        course,
        sections: selectedSections[courseId] || []
      };
    });

    // Generate all possible combinations
    const schedules = generateScheduleCombinations(courseSections);
    
    // Filter out schedules with conflicts
    const validSchedules = schedules.filter(schedule => !hasTimeConflicts(schedule));
    setGeneratedSchedules(validSchedules);
    return validSchedules;
  };

  return (
    <CourseContext.Provider value={{ 
      selectedCourses,
      selectedSections,
      checkedCourses,
      generatedSchedules,
      addCourse,
      removeCourse,
      updateSelectedSections,
      updateCheckedCourses,
      generatePossibleSchedules
    }}>
      {children}
    </CourseContext.Provider>
  );
}

// Helper functions for schedule generation
function generateScheduleCombinations(courseSections) {
  if (courseSections.length === 0) return [[]];
  
  const [first, ...rest] = courseSections;
  const restCombinations = generateScheduleCombinations(rest);
  
  const combinations = [];
  first.sections.forEach(section => {
    restCombinations.forEach(combination => {
      combinations.push([section, ...combination]);
    });
  });
  
  return combinations;
}

function hasTimeConflicts(schedule) {
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      if (sectionsOverlap(schedule[i], schedule[j])) {
        return true;
      }
    }
  }
  return false;
}

function sectionsOverlap(section1, section2) {
  // Check if sections share any days
  const days1 = section1.days.split('');
  const days2 = section2.days.split('');
  const sharedDays = days1.filter(day => days2.includes(day));
  
  if (sharedDays.length === 0) return false;

  // Convert times to minutes for comparison
  const start1 = timeToMinutes(section1.begin_time);
  const end1 = timeToMinutes(section1.end_time);
  const start2 = timeToMinutes(section2.begin_time);
  const end2 = timeToMinutes(section2.end_time);

  return !(end1 <= start2 || end2 <= start1);
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export const useCourses = () => useContext(CourseContext);