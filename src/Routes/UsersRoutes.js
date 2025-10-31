// src/Routes/UsersRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import MasterTemplate from "../User-panel/pages/MasterTemplate";
import Dashboard from "../User-panel/pages/Dashboard";
import Courses from "../User-panel/pages/courses/Courses";
import CourseDetails from "../User-panel/pages/courses/CourseDetails";
import NotFound from "../User-panel/pages/NotFound";
import Chapters from "../User-panel/pages/courses/chapters/Chapters";
import Learners from "../User-panel/pages/learners/Learners";
import ListLiveTest from "../User-panel/pages/livetest/ListLiveTest";
import Settings from "../User-panel/pages/setting/Settings";
import Packages from "../User-panel/pages/package/Packages";
import PackageCourses from "../User-panel/pages/package/package-courses/PackageCourses";
import VideoPage from "../User-panel/pages/courses/chapters/components/sectionmedia/VideoPage";
import QuizTest from "../User-panel/pages/courses/chapters/components/quiz/QuizTest";
import AllPackages from "../User-panel/pages/all-packages/AllPackages";
import QuizResult from "../User-panel/pages/courses/chapters/components/quiz/QuizResult";
import LiveTest from "../User-panel/pages/courses/chapters/components/livetest/LiveTest";

function UsersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MasterTemplate />}>
        <Route index element={<Dashboard />} />
        <Route path="/courses/my" element={<Courses />} />
        <Route path="/view-course/:id" element={<CourseDetails />} />
        <Route path="/courses/complete" element={<Courses />} />
        <Route path="/courses/incomplete" element={<Courses />} />
        <Route path="/courses" element={<Navigate to="/courses/my" />} />
        <Route path="learners" element={<Learners />} />
        <Route path="chapters/:course_id" element={<Chapters />} />
        <Route path="packages" element={<Packages />} />
        <Route path="package-courses/:package_id" element={<PackageCourses />} />
        <Route path="all-packages" element={<AllPackages />} />
        <Route path="/video/:video_id" element={<VideoPage />} />
        <Route path="/account" element={<Settings />} />
        <Route path="list-live-test" element ={<ListLiveTest />} />
        <Route path="/quiz-result/:chapter_id" element={<QuizResult />} />
  



        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path={"/live-test/:live_test_id"} element ={<LiveTest />} />
      <Route path="/quiz-test/:chapter_id" element={<QuizTest />} />
    </Routes>
  );
}

export default UsersRoutes;
