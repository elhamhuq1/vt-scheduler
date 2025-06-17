import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CourseProvider } from "./context/CourseContext";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CourseDetail from "./pages/CourseDetail";
import SchedulePage from "./pages/SchedulePage";
import SectionsPage from "./pages/SectionsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CourseProvider>
        <RootLayout />
      </CourseProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "course/:crn", element: <CourseDetail /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "sections/:subject/:courseNumber", element: <SectionsPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
