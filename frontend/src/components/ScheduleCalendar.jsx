export default function ScheduleCalendar({ courses = [] }) {
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "1:00", "1:30",
    "2:00", "2:30", "3:00", "3:30", "4:00", "4:30",
    "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function getTimeSlotPosition(startTime, endTime) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const baseMinutes = timeToMinutes("08:00");

    const top = ((startMinutes - baseMinutes) / 30) * 3; // 3rem per 30min slot
    const height = ((endMinutes - startMinutes) / 30) * 3;

    return { top: `${top}rem`, height: `${height}rem` };
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] bg-white">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-[#dde0e3]">
          <div className="p-4 bg-[#f1f2f4] border-r border-[#dde0e3]">
            <span className="text-sm font-bold text-[#121416]">Time</span>
          </div>
          {weekDays.map((day) => (
            <div key={day} className="p-4 bg-[#f1f2f4] border-r border-[#dde0e3] last:border-r-0 text-center">
              <span className="text-sm font-bold text-[#121416]">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="relative">
          <div className="grid grid-cols-6">
            {/* Time Column */}
            <div className="border-r border-[#dde0e3]">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className={`h-12 px-4 py-2 text-xs text-[#637488] border-b border-[#dde0e3] flex items-center ${
                    index % 2 === 0 ? "bg-[#f8f9fa]" : "bg-white"
                  }`}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day) => (
              <div key={day} className="relative border-r border-[#dde0e3] last:border-r-0">
                {timeSlots.map((time, index) => (
                  <div 
                    key={time} 
                    className={`h-12 border-b border-[#dde0e3] ${
                      index % 2 === 0 ? "bg-[#f8f9fa]" : "bg-white"
                    }`} 
                  />
                ))}

                {/* Course Blocks */}
                {courses
                  .filter((course) => course.days.includes(day))
                  .map((course) => {
                    const position = getTimeSlotPosition(course.startTime, course.endTime);
                    return (
                      <div
                        key={`${course.id}-${day}`}
                        className={`absolute left-1 right-1 rounded-lg p-2 text-white text-xs shadow-sm z-10 ${course.color}`}
                        style={{
                          top: position.top,
                          height: position.height,
                        }}
                      >
                        <div className="font-bold truncate">{course.name}</div>
                        <div className="truncate opacity-90 text-xs">{course.title}</div>
                        <div className="truncate opacity-75 mt-1 text-xs">{course.location}</div>
                        <div className="truncate opacity-75 text-xs">{course.instructor}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}