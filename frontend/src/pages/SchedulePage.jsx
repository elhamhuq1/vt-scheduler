import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import ScheduleCalendar from '../components/ScheduleCalendar';

export default function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { generatedSchedules } = useCourses();
  const [scheduleData, setScheduleData] = useState([]);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  useEffect(() => {
    // Get schedule index from navigation state or default to 0
    const scheduleIndex = location.state?.scheduleIndex || 0;
    setCurrentScheduleIndex(scheduleIndex);

    if (generatedSchedules.length > 0 && generatedSchedules[scheduleIndex]) {
      const transformedData = transformSectionsToSchedule(generatedSchedules[scheduleIndex]);
      setScheduleData(transformedData);
    }
  }, [generatedSchedules, location.state]);

  const transformSectionsToSchedule = (sections) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-red-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];

    return sections.map((section, index) => ({
      id: section.crn,
      name: `${section.subject} ${section.course_number}`,
      title: section.title || 'Course Title',
      instructor: section.instructor || 'TBA',
      location: section.location || 'TBA',
      days: parseDays(section.days),
      startTime: formatTime(section.begin_time),
      endTime: formatTime(section.end_time),
      color: colors[index % colors.length],
      credits: section.credits || 3,
    }));
  };

const parseDays = (daysString) => {
  if (!daysString || daysString.includes('ARR')) return [];
  
  const dayMap = {
    'M': 'Monday',
    'T': 'Tuesday', 
    'W': 'Wednesday',
    'R': 'Thursday',
    'F': 'Friday'
  };

  // Handle space-separated format like "M W" or "T R"
  return daysString.trim().split(/\s+/).map(day => dayMap[day]).filter(Boolean);
};

const formatTime = (timeString) => {
  if (!timeString || timeString.includes('ARR') || timeString.includes('TBA')) {
    return '00:00';
  }
  
  // Convert 12-hour format to 24-hour format for the calendar
  const timeRegex = /^(\d{1,2}):(\d{2})(AM|PM)$/i;
  const match = timeString.trim().match(timeRegex);
  
  if (!match) return '00:00';
  
  let [, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  
  // Convert to 24-hour format
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

  if (generatedSchedules.length === 0) {
    return (
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                No schedules generated
              </p>
              <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                Generate schedules from the home page to view them here
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-3 pt-5">
          <div>
            <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Schedule {currentScheduleIndex + 1}
            </h2>
            <p className="text-[#637488] text-sm">
              {generatedSchedules.length} schedule(s) available
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Schedule Navigation */}
        {generatedSchedules.length > 1 && (
          <div className="flex justify-center items-center gap-2 mb-4">
            <button
              onClick={() => {
                if (currentScheduleIndex > 0) {
                  setCurrentScheduleIndex(currentScheduleIndex - 1);
                  const transformedData = transformSectionsToSchedule(generatedSchedules[currentScheduleIndex - 1]);
                  setScheduleData(transformedData);
                }
              }}
              disabled={currentScheduleIndex === 0}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-[#f1f2f4] text-[#121416] hover:bg-[#e1e3e6] disabled:opacity-50"
            >
              Previous
            </button>
            {/* Show up to 2 before and 2 after the current index */}
            {generatedSchedules.map((_, index) => {
              if (
                index === 0 ||
                index === generatedSchedules.length - 1 ||
                (index >= currentScheduleIndex - 2 && index <= currentScheduleIndex + 2)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentScheduleIndex(index);
                      const transformedData = transformSectionsToSchedule(generatedSchedules[index]);
                      setScheduleData(transformedData);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      index === currentScheduleIndex
                        ? 'bg-[#1978e5] text-white'
                        : 'bg-[#f1f2f4] text-[#121416] hover:bg-[#e1e3e6]'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }
              // Show ellipsis if needed
              if (
                (index === currentScheduleIndex - 3 && index > 1) ||
                (index === currentScheduleIndex + 3 && index < generatedSchedules.length - 2)
              ) {
                return (
                  <span key={index} className="px-2 text-[#637488]">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => {
                if (currentScheduleIndex < generatedSchedules.length - 1) {
                  setCurrentScheduleIndex(currentScheduleIndex + 1);
                  const transformedData = transformSectionsToSchedule(generatedSchedules[currentScheduleIndex + 1]);
                  setScheduleData(transformedData);
                }
              }}
              disabled={currentScheduleIndex === generatedSchedules.length - 1}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-[#f1f2f4] text-[#121416] hover:bg-[#e1e3e6] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Schedule Calendar */}
        <div className="bg-white rounded-xl border border-[#dde0e3] overflow-hidden">
          <ScheduleCalendar courses={scheduleData} />
        </div>

        {/* Schedule Summary */}
        {scheduleData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#dde0e3]">
              <h3 className="text-[#121416] text-lg font-bold mb-2">Total Credits</h3>
              <div className="text-3xl font-bold text-[#1978e5]">
                {scheduleData.reduce((sum, course) => sum + course.credits, 0)}
              </div>
              <p className="text-sm text-[#637488]">Credit hours this semester</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dde0e3]">
              <h3 className="text-[#121416] text-lg font-bold mb-2">Course Count</h3>
              <div className="text-3xl font-bold text-green-600">{scheduleData.length}</div>
              <p className="text-sm text-[#637488]">Total courses enrolled</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dde0e3]">
              <h3 className="text-[#121416] text-lg font-bold mb-2">Schedule Options</h3>
              <div className="text-3xl font-bold text-orange-600">{generatedSchedules.length}</div>
              <p className="text-sm text-[#637488]">Valid combinations found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}