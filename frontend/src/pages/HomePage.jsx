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
    selectedSections,
    generatedSchedules,
    generatePossibleSchedules
  } = useCourses();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSchedules = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Selected sections:', selectedSections);
      
      // Check if we have sections for at least 2 courses
      const coursesWithSections = Object.entries(selectedSections)
        .filter(([courseId, sections]) => sections && sections.length > 0);
      
      if (coursesWithSections.length < 2) {
        alert('Please select sections for at least 2 courses before generating schedules.');
        return;
      }
      
      const result = generatePossibleSchedules();
      
      if (result.length === 0) {
        alert('No valid schedules found. There may be time conflicts between your selected sections.');
      }
      
    } catch (error) {
      console.error('Error generating schedules:', error);
      alert('Error generating schedules. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Check how many courses have selected sections
  const coursesWithSections = Object.entries(selectedSections)
    .filter(([courseId, sections]) => sections && sections.length > 0).length;

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        {/* Header */}
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
                const hasSections = selectedSections[courseId] && selectedSections[courseId].length > 0;
                
                return (
                  <div 
                    key={courseId}
                    className="flex justify-between items-center p-4 rounded-xl border border-[#dde0e3]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[#121416] text-lg font-bold">
                          {course.subject} {course.course_number}
                        </span>
                        <span className="text-[#121416] text-sm">
                          {course.title}
                        </span>
                        <span className={`text-xs ${hasSections ? 'text-green-600' : 'text-orange-600'}`}>
                          {hasSections 
                            ? `${selectedSections[courseId].length} section(s) selected`
                            : 'No sections selected'
                          }
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
          {coursesWithSections < 2 ? (
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  No schedules generated
                </p>
                <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                  {selectedCourses.length === 0 
                    ? "Add courses and select sections to generate schedules"
                    : coursesWithSections === 0
                      ? "Select sections for your courses to generate schedules"
                      : "Select sections for at least 2 courses to generate schedules"}
                </p>
              </div>
              <button
                onClick={() => selectedCourses.length === 0 ? navigate('/search') : null}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                {selectedCourses.length === 0 ? 'Add Courses' : 'Select More Sections'}
              </button>
            </div>
          ) : generatedSchedules.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  Ready to generate schedules
                </p>
                <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                  You have {coursesWithSections} courses with selected sections
                </p>
              </div>
              <button
                onClick={handleGenerateSchedules}
                disabled={isGenerating}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Schedules'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-[#121416] text-sm">
                  Found {generatedSchedules.length} possible schedule(s)
                </p>
                <button
                  onClick={handleGenerateSchedules}
                  disabled={isGenerating}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-8 px-3 bg-[#f1f2f4] text-[#121416] text-xs font-bold"
                >
                  Regenerate
                </button>
              </div>
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
                        `${section.subject} ${section.course_number}`
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