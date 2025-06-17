import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { crn } = useParams();
  return <div className="p-6 text-xl">Details for course: {crn}</div>;
}
