import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import ScheduleCalendar from '../components/ScheduleCalendar';

export default function SchedulePage() {
  const navigate = useNavigate();
  const { selectedCourses } = useCourses();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateScheduleData = async () => {
      setLoading(true);
      try {
        // Transform your course data to match the calendar format
        const transformedData = await transformCoursesToSchedule(selectedCourses);
        setScheduleData(transformedData);
      } catch (error) {
        console.error('Error generating schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCourses.length > 0) {
      generateScheduleData();
    } else {
      setLoading(false);
    }
  }, [selectedCourses]);

  const transformCoursesToSchedule = async (courses) => {
    const scheduleItems = [];
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-red-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      
      // Fetch sections for each course
      try {
        const response = await fetch(`http://localhost:5000/api/courses?subject=${course.subject}`);
        if (response.ok) {
          const sections = await response.json();
          const courseSections = sections.filter(section => 
            section.course_number === course.course_number
          );

          // For now, take the first section (you can enhance this to let users choose)
          if (courseSections.length > 0) {
            const section = courseSections[0];
            
            scheduleItems.push({
              id: section.crn,
              name: `${course.subject} ${course.course_number}`,
              title: course.title,
              instructor: section.instructor || 'TBA',
              location: section.location || 'TBA',
              days: parseDays(section.days),
              startTime: formatTime(section.begin_time),
              endTime: formatTime(section.end_time),
              color: colors[i % colors.length],
              credits: course.credits || 3,
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching sections for ${course.subject} ${course.course_number}:`, error);
      }
    }

    return scheduleItems;
  };

  const parseDays = (daysString) => {
    if (!daysString) return [];
    
    const dayMap = {
      'M': 'Monday',
      'T': 'Tuesday', 
      'W': 'Wednesday',
      'R': 'Thursday',
      'F': 'Friday'
    };

    return daysString.split('').map(day => dayMap[day]).filter(Boolean);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '00:00';
    
    // Convert from your backend format to HH:MM format
    // Adjust this based on your actual time format
    if (timeString.includes(':')) {
      return timeString.substring(0, 5); // Take first 5 characters (HH:MM)
    }
    
    return timeString;
  };

  if (selectedCourses.length === 0) {
    return (
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dde0e3] px-6 py-14">
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                No courses selected
              </p>
              <p className="text-[#121416] text-sm font-normal leading-normal max-w-[480px] text-center">
                Add courses to generate and view your schedule
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
          <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Generated Schedule
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.print()}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Export Schedule
            </button>
          </div>
        </div>

        {/* Schedule Calendar */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#121416] text-lg">Loading schedule...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#dde0e3] overflow-hidden">
            <ScheduleCalendar courses={scheduleData} />
          </div>
        )}

        {/* Schedule Summary */}
        {!loading && scheduleData.length > 0 && (
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
              <h3 className="text-[#121416] text-lg font-bold mb-2">Schedule Density</h3>
              <div className="text-3xl font-bold text-orange-600">
                {Math.round((scheduleData.length * 3) / 5 * 10) / 10}
              </div>
              <p className="text-sm text-[#637488]">Hours per day average</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}