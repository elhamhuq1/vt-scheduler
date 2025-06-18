import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import DeleteIcon from '../components/icons/DeleteIcon';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    selectedCourses, 
    removeCourse, 
    checkedCourses, 
    updateCheckedCourses,
    generatedSchedules,
    generatePossibleSchedules 
  } = useCourses();
  const [selectedItems, setSelectedItems] = useState(checkedCourses);

  // Force re-render when location changes
  useEffect(() => {
    setSelectedItems(checkedCourses);
  }, [location, checkedCourses]);

  const handleSelectAll = (e) => {
    const allCourseIds = selectedCourses.map(course => `${course.subject}-${course.course_number}`);
    const newSelected = e.target.checked ? allCourseIds : [];
    setSelectedItems(newSelected);
    updateCheckedCourses(newSelected);
  };

  const handleSelectCourse = (courseId) => {
    const newSelected = selectedItems.includes(courseId)
      ? selectedItems.filter(id => id !== courseId)
      : [...selectedItems, courseId];
    
    setSelectedItems(newSelected);
    updateCheckedCourses(newSelected);
  };

  const handleGenerateSchedules = () => {
    generatePossibleSchedules();
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        {/* Modified header section with Add Course button */}
        <div className="flex justify-between items-center px-4 pb-3 pt-5">
          <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Courses
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Add Course
          </button>
        </div>

        {selectedCourses.length > 0 && (
          <div className="flex items-center px-4 py-2">
            <label className="flex items-center gap-2 text-sm text-[#121416]">
              <input
                type="checkbox"
                checked={selectedItems.length === selectedCourses.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-[#1978e5] focus:ring-[#1978e5]"
              />
              Select All
            </label>
          </div>
        )}

        {/* Courses Section */}
        <div className="flex flex-col gap-4 p-4">
          {selectedCourses.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  No courses added
                </p>
                <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                  Search for courses to add them to your schedule
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Search Courses</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {selectedCourses.map((course) => {
                const courseId = `${course.subject}-${course.course_number}`;
                return (
                  <div 
                    key={courseId}
                    className="flex justify-between items-center p-4 rounded-xl border border-[#dde0e3]"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(courseId)}
                        onChange={() => handleSelectCourse(courseId)}
                        className="rounded border-gray-300 text-[#1978e5] focus:ring-[#1978e5]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[#121416] text-lg font-bold">
                          {course.subject} {course.course_number}
                        </span>
                        <span className="text-[#121416] text-sm">
                          {course.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/sections/${course.subject}/${course.course_number}`)}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
                      >
                        Sections
                      </button>
                      <button
                        onClick={() => removeCourse(course)}
                        className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-[#f1f2f4] hover:text-red-500 text-[#121416] transition-colors ml-1 cursor-pointer"
                        aria-label="Remove course"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Schedules Section */}
        <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Schedules
        </h2>
        <div className="flex flex-col p-4">
          {selectedCourses.length <= 1 ? (
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  No schedules generated
                </p>
                <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                  {selectedCourses.length === 0 
                    ? "Add courses to generate schedules"
                    : "Add more courses to generate schedules"}
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                Add Courses
              </button>
            </div>
          ) : generatedSchedules.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
              <button
                onClick={handleGenerateSchedules}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                Generate Schedules
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {generatedSchedules.map((schedule, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl border border-[#dde0e3] hover:bg-[#f8f9fa] cursor-pointer"
                  onClick={() => navigate('/schedule', { state: { scheduleIndex: index }})}
                >
                  <div className="flex flex-col">
                    <span className="text-[#121416] text-lg font-bold">
                      Schedule {index + 1}
                    </span>
                    <span className="text-[#121416] text-sm">
                      {schedule.map(section => 
                        `${section.course_number}-${section.subject}-${section.crn}`
                      ).join(', ')}
                    </span>
                  </div>
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
