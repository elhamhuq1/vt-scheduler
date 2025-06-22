import { useState, useEffect } from 'react';
import { useCourses } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const { addCourse } = useCourses();
  const navigate = useNavigate();
  const selectedCourseData = courses.find(c => c.course_number === selectedCourse);

  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await await fetch(`${API_BASE_URL}/api/courses/subjects`);;
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSubject) {
        setCourses([]);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/numbers?subject=${selectedSubject}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [selectedSubject]);

  const handleAddCourse = () => {
    if (selectedCourseData) {
      addCourse(selectedCourseData);
      setSelectedSubject('');
      setSelectedCourse('');
    }
  };

  const handleDone = () => {
    navigate('/');
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
        {/* Page Title */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Add Courses
          </p>
        </div>

        {/* Subject Select */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedCourse('');
              }}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 bg-[image:var(--select-button-svg)] placeholder:text-[#637488] p-[15px] text-base font-normal leading-normal"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Course Select */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!selectedSubject}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 bg-[image:var(--select-button-svg)] placeholder:text-[#637488] p-[15px] text-base font-normal leading-normal"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={`${course.subject}-${course.course_number}`} value={course.course_number}>
                  {`${course.subject} ${course.course_number} - ${course.title}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-stretch">
          <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
            <button
              onClick={handleAddCourse}
              disabled={!selectedCourse}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
            >
              <span className="truncate">Add Course</span>
            </button>
            <button
              onClick={handleDone}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
