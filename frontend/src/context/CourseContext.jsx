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
    console.log('Starting schedule generation...');
    console.log('Selected sections:', selectedSections);
    
    // Get all courses that have selected sections
    const coursesWithSections = Object.entries(selectedSections)
      .filter(([courseId, sections]) => sections && sections.length > 0)
      .map(([courseId, sections]) => ({ courseId, sections }));

    console.log('Courses with sections:', coursesWithSections);

    if (coursesWithSections.length < 2) {
      console.log('Need at least 2 courses with sections');
      setGeneratedSchedules([]);
      return [];
    }

    // Generate all possible combinations
    const allCombinations = generateCombinations(coursesWithSections.map(c => c.sections));
    console.log('All combinations:', allCombinations);

    // Filter out schedules with conflicts
    const validSchedules = allCombinations.filter(schedule => !hasTimeConflicts(schedule));
    console.log('Valid schedules:', validSchedules);

    setGeneratedSchedules(validSchedules);
    return validSchedules;
  };

  // Helper function to generate combinations
  const generateCombinations = (sectionGroups) => {
    if (sectionGroups.length === 0) return [[]];
    if (sectionGroups.length === 1) return sectionGroups[0].map(section => [section]);

    const [first, ...rest] = sectionGroups;
    const restCombinations = generateCombinations(rest);
    
    const combinations = [];
    first.forEach(section => {
      restCombinations.forEach(combination => {
        combinations.push([section, ...combination]);
      });
    });
    
    return combinations;
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
  console.log('Checking overlap between:', {
    section1: { days: section1.days, begin: section1.begin_time, end: section1.end_time },
    section2: { days: section2.days, begin: section2.begin_time, end: section2.end_time }
  });

  // Check if sections share any days
  if (!section1.days || !section2.days) {
    console.log('Missing days data');
    return false;
  }
  
  // Parse space-separated days like "M W" -> ["M", "W"]
  const days1 = section1.days.trim().split(/\s+/);
  const days2 = section2.days.trim().split(/\s+/);
  const sharedDays = days1.filter(day => days2.includes(day));
  
  console.log('Days comparison:', { days1, days2, sharedDays });
  
  if (sharedDays.length === 0) {
    console.log('No shared days - no conflict');
    return false;
  }

  // Convert times to minutes for comparison
  const start1 = timeToMinutes(section1.begin_time);
  const end1 = timeToMinutes(section1.end_time);
  const start2 = timeToMinutes(section2.begin_time);
  const end2 = timeToMinutes(section2.end_time);

  console.log('Time comparison:', {
    section1: { start: start1, end: end1, original: { begin: section1.begin_time, end: section1.end_time }},
    section2: { start: start2, end: end2, original: { begin: section2.begin_time, end: section2.end_time }}
  });

  const hasOverlap = !(end1 <= start2 || end2 <= start1);
  console.log('Time overlap result:', hasOverlap);
  
  return hasOverlap;
}

function timeToMinutes(timeString) {
  if (!timeString || timeString.includes('ARR') || timeString.includes('TBA')) {
    console.log('Invalid or arranged time:', timeString);
    return 0;
  }
  
  console.log('Converting time:', timeString);
  
  // Handle 12-hour format like "4:00PM", "10:10AM"
  const timeRegex = /^(\d{1,2}):(\d{2})(AM|PM)$/i;
  const match = timeString.trim().match(timeRegex);
  
  if (!match) {
    console.log('Invalid time format:', timeString);
    return 0;
  }
  
  let [, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  
  // Convert to 24-hour format
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  const result = hours * 60 + minutes;
  
  console.log(`Time conversion: ${timeString} -> ${hours}:${minutes.toString().padStart(2, '0')} -> ${result} minutes`);
  
  return result;
}

export const useCourses = () => useContext(CourseContext);