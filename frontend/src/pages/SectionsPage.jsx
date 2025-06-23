import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';

export default function SectionsPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, courseNumber } = useParams();
  const { selectedSections, updateSelectedSections } = useCourses();
  const [sections, setSections] = useState([]);
  const [selectedCRNs, setSelectedCRNs] = useState(() => {
    const courseId = `${subject}-${courseNumber}`;
    return (selectedSections[courseId] || []).map(section => section.crn);
  });

  // Refetch data when route changes
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses?subject=${subject}`);
        if (!response.ok) throw new Error('Failed to fetch sections');
        const data = await response.json();
        setSections(data.filter(section => section.course_number === courseNumber));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSections();
  }, [subject, courseNumber, location]);

  const handleBackToHome = () => {
    const courseId = `${subject}-${courseNumber}`;
    const selectedSectionData = sections.filter(section => 
      selectedCRNs.includes(section.crn)
    );
    updateSelectedSections(courseId, selectedSectionData);
    navigate('/', { state: { from: location.pathname } });
  };

  const handleCheckboxChange = (crn) => {
    setSelectedCRNs(prev => {
      if (prev.includes(crn)) {
        return prev.filter(x => x !== crn);
      } else {
        return [...prev, crn];
      }
    });
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
          Sections for {subject} {courseNumber}
        </h2>
        
        <div className="w-fulloverflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#f0f2f4]">
                <th className="sticky left-0 bg-white px-4 py-2 text-left font-bold text-sm">Select</th>
                <th className="px-4 py-2 text-left font-bold text-sm">CRN</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Subject</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Course</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Modality</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Instructor</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Days</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Begin Time</th>
                <th className="px-4 py-2 text-left font-bold text-sm">End Time</th>
                <th className="px-4 py-2 text-left font-bold text-sm">Location</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr 
                  key={section.crn}
                  className="border-b border-[#dde0e3] hover:bg-[#f8f9fa]"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedCRNs.includes(section.crn)}
                      onChange={() => handleCheckboxChange(section.crn)}
                      className="rounded border-gray-300 text-[#1978e5] focus:ring-[#1978e5]"
                    />
                  </td>
                  <td className="px-4 py-2">{section.crn}</td>
                  <td className="px-4 py-2">{section.subject}</td>
                  <td className="px-4 py-2">{section.course_number}</td>
                  <td className="px-4 py-2">{section.modality}</td>
                  <td className="px-4 py-2">{section.instructor}</td>
                  <td className="px-4 py-2">{section.days}</td>
                  <td className="px-4 py-2">{section.begin_time}</td>
                  <td className="px-4 py-2">{section.end_time}</td>
                  <td className="px-4 py-2">{section.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6 px-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#1978e5] hover:bg-[#1461b4] rounded-xl transition-colors cursor-pointer"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}