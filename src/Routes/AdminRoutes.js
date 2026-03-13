// src/Routes/AdminRoutes.js
import { Routes, Route } from "react-router-dom";
import MasterTemplate from "../Admin-panel/pages/MasterTemplate";
import Dashboard from "../Admin-panel/pages/Dashboard";
import Learners from "../Admin-panel/pages/learners/Learners";
import AddLearners from "../Admin-panel/pages/learners/AddLearners";
import EditLearner from "../Admin-panel/pages/learners/EditLearner";
import Instructors from "../Admin-panel/pages/instructors/Instructors";
import AddInstructor from "../Admin-panel/pages/instructors/AddInstructor";
import EditInstructor from "../Admin-panel/pages/instructors/EditInstructor";
import Courses from "../Admin-panel/pages/courses/Courses";
import DeletedCourses from "../Admin-panel/pages/courses/DeletedCourses";
import AddCourses from "../Admin-panel/pages/courses/AddCourses";
import EditCourse from "../Admin-panel/pages/courses/EditCourse";
import Chapters from "../Admin-panel/pages/courses/chapters/Chapters";
import AddChapter from "../Admin-panel/pages/courses/chapters/AddChapter";
import EditChapter from "../Admin-panel/pages/courses/chapters/EditChapter";
import ThemeMedia from "../Admin-panel/pages/media/ThemeMedia";
import NotFound from "../Admin-panel/pages/NotFound";
import CourseLearners from "../Admin-panel/pages/courses/course-learners/CourseLeaners";
import Packages from "../Admin-panel/pages/packages/Packages";
import AddPackages from "../Admin-panel/pages/packages/AddPackages";
import EditPackages from "../Admin-panel/pages/packages/EditPackages";
import PackageLeaners from "../Admin-panel/pages/packages/PackageLeaners";
import PackageCourses from "../Admin-panel/pages/packages/packagecourses/PackageCourses";
import Reports from "../Admin-panel/pages/reports/Reports";
import LearnerReport from "../Admin-panel/pages/courses/course-learners/LearnerReport";
import Downloads from "../Admin-panel/pages/downloads/Downloads";
import CourseReport from "../Admin-panel/pages/reports/coursereport/CourseReport";
import PackageReport from "../Admin-panel/pages/reports/packagereport/PackageReport";
import LiveTestList from "../Admin-panel/pages/reports/livetestreport/LiveTestList";
import LmsLearnersGroup from "../Admin-panel/pages/learners-group/LmsLearnersGroup";
import AssignLmsLearners from "../Admin-panel/pages/learners-group/AssignLmsLearners";
import AdminNotification from "../Admin-panel/pages/notification/AdminNotification";
import AddNotification from "../Admin-panel/pages/notification/AddNotification";
import EditNotification from "../Admin-panel/pages/notification/EditNotification";
import QuizReport from "../Admin-panel/pages/reports/quizreport/QuizReport";
import QuizLearnerReport from "../Admin-panel/pages/reports/quizreport/QuizLearnerReport";
import QuizLearnerReportDetails from "../Admin-panel/pages/reports/quizreport/QuizLearnerReportDetails";
import LiveTest from "../Admin-panel/pages/livetest/LiveTest";
import AddLiveTest from "../Admin-panel/pages/livetest/AddLiveTest";
import EditLiveTest from "../Admin-panel/pages/livetest/EditLiveTest";
import LiveTestQuestion from "../Admin-panel/pages/livetest/LiveTestQuestions";
import LiveTestLearners from "../Admin-panel/pages/livetest/LiveTestLearners";
import LearnerCourses from "../Admin-panel/pages/learners/LearnerCourses";
import Announcment from "../Admin-panel/pages/announcment/Announcment";
import AddAnnouncment from "../Admin-panel/pages/announcment/AddAnnouncment";
import EditAnnouncment from "../Admin-panel/pages/announcment/EditAnnouncment";
import Smtp from "../Admin-panel/pages/smtp/Smtp";
import AddSmtp from "../Admin-panel/pages/smtp/AddSmtp";
import EditSmtp from "../Admin-panel/pages/smtp/EditSmtp"
import CourseDownload from "../Admin-panel/pages/downloads/CourseDownload";
import PackageDownload from "../Admin-panel/pages/downloads/PackageDownload";
import QuizDownload from "../Admin-panel/pages/downloads/QuizDownload";
import LiveTestDownload from "../Admin-panel/pages/downloads/LiveTestDownload";
import UpcommingTrainings from "../Admin-panel/pages/upcomingtrainings/UpcommingTrainings";
import AddUpcommingTrainings from "../Admin-panel/pages/upcomingtrainings/AddUpcommingTrainings";
import EditUpcomingTrainings from "../Admin-panel/pages/upcomingtrainings/EditUpcommingTraings";
import ListDiscussion from "../Admin-panel/pages/disccusionform/ListDiscussion";
import ListCity from "../Admin-panel/pages/disccusionform/city/ListCity";
import ListTopic from "../Admin-panel/pages/disccusionform/topic/ListTopic";
import AppSetting from "../Admin-panel/pages/appsetting/AppSetting";
import LearnerPackages from "../Admin-panel/pages/learners/LearnerPackages";
import AppUsers from "../Admin-panel/pages/AppUsers/AppUsers";
import LearnerPackageReport from "../Admin-panel/pages/packages/LearnerPackageReport";
import LearnerQuizTest from "../Admin-panel/pages/learners/LearnersQuizTest";
import UserReport from "../Admin-panel/pages/reports/userreport/UserReport";
import UserDownload from "../Admin-panel/pages/downloads/UserDownload";
import LmsSetting from "../Admin-panel/pages/lmssetting/LmsSetting";
import LogsView from "../Admin-panel/pages/logs/LogsView";
import Advertisement from "../Admin-panel/pages/advertisement/Advertisement"
import AddAdvertisement from "../Admin-panel/pages/advertisement/AddAdvertisement"
import EditAdvertisement from "../Admin-panel/pages/advertisement/EditAdvertisement"
import CommentDiscussion from "../Admin-panel/pages/commentdiscussion/CommentDiscussion";
import DiscussionReplies from "../Admin-panel/pages/commentdiscussion/DiscussionReplies";
import LmsComment from "../Admin-panel/pages/comments/LmsComment";


function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MasterTemplate />}>
        <Route index element={<Dashboard />} />
        <Route path="learners/:page?" element={<Learners />} />
        <Route path="add-learner" element={<AddLearners />} />
        <Route path="edit-learner/:id" element={<EditLearner />} />
        <Route path="learner-courses/:learner_id" element={<LearnerCourses />} />
        <Route path="learner-packages/:learner_id" element={<LearnerPackages />} />
        <Route path="learner-quiz-test/:learner_id" element={<LearnerQuizTest />} />
        <Route path="learners-group" element={<LmsLearnersGroup />} />
        <Route path="assign-learner/:id" element={<AssignLmsLearners />} />
        <Route path="app-users/:page?" element={<AppUsers />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="add-instructor" element={<AddInstructor />} />
        <Route path="edit-instructor/:id" element={<EditInstructor />} />
        <Route path="courses" element={<Courses />} />
        <Route path="deleted-courses" element={<DeletedCourses />} />
        <Route path="add-courses" element={<AddCourses />} />
        <Route path="edit-course/:id" element={<EditCourse />} />
        <Route path="course-learners/:course_id" element={<CourseLearners />} />
        <Route path="learner-report/:course_id/:learner_id" element={<LearnerReport />} />
        <Route path="chapters/:course_id" element={<Chapters />} />
        <Route path="add-chapter/:course_id" element={<AddChapter />} />
        <Route path="/edit-chapter/:id" element={<EditChapter />} />
        <Route path="/edit-chapter/:id/quiz-setting" element={<EditChapter />} />
        <Route path="/edit-chapter/:id/quiz-questions" element={<EditChapter />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="add-packages" element={<AddPackages />} />
        <Route path="edit-package/:id" element={<EditPackages />} />
        <Route path="package-learners/:package_id" element={<PackageLeaners />} />
        <Route path="package-courses/:package_id" element={<PackageCourses />} />
        <Route path="package-learner-report/:package_id/:learner_id" element={<LearnerPackageReport />} />

        <Route path="live-test" element={<LiveTest />} />
        <Route path="/add-live-test" element={<AddLiveTest />} />
        <Route path="edit-live-test/:id" element={<EditLiveTest />} />
        <Route path="live-test-questions/:live_test_id" element={<LiveTestQuestion />} />
        <Route path="/assign-learner-live-test/:live_test_id" element={<LiveTestLearners />} />
        <Route path="upcoming-trainings" element={<UpcommingTrainings />} />
        <Route path="add-trainings" element={<AddUpcommingTrainings />} />
        <Route path="edit-trainings/:id" element={<EditUpcomingTrainings />} />

        <Route path="report" element={<Reports />}>
          <Route path="course-report" element={<CourseReport />} />
          <Route path="package-report" element={<PackageReport />} />
          <Route path="livetest-report" element={<LiveTestList />} />
          <Route path="quiz-report" element={<QuizReport />} />
          <Route path="quiz-report/:learner_id" element={<QuizLearnerReport />} />
          <Route path="quiz-report-details/:learner_id/:chapter_id" element={<QuizLearnerReportDetails />} />
          <Route path="user-report" element={<UserReport />} />
        </Route>

        <Route path="download" element={<Downloads />} >
          <Route path="course-download" element={<CourseDownload />} />
          <Route path="package-download" element={<PackageDownload />} />
          <Route path="livetest-download" element={<LiveTestDownload />} />
          <Route path="quiz-download" element={<QuizDownload />} />
          <Route path="user-download" element={<UserDownload />} />
        </Route> 

        <Route path="lms-setting" element={<LmsSetting />} />
        <Route path="logs-view" element={<LogsView />} />
        <Route path="announcment/:page?" element={<Announcment />} />
        <Route path="add-announcment/" element={<AddAnnouncment />} />
        <Route path="edit-announcment/:id" element={<EditAnnouncment />} />
        <Route path="smtp" element={<Smtp />} />
        <Route path="add-smtp" element={<AddSmtp />} />
        <Route path="edit-smtp/:id" element={<EditSmtp />} />
        <Route path="media" element={<ThemeMedia />} />
        <Route path="report" element={<Reports />} />
        <Route path="notification" element={<AdminNotification />} />
        <Route path="add-notification" element={<AddNotification />} />
        <Route path="edit-notification/:id" element={<EditNotification />} />
        <Route path="discussion" element={<ListDiscussion />}>
          <Route index element={<ListCity />} />
          <Route path="city" element={<ListCity />} />
          <Route path="topic" element={<ListTopic />} />
        </Route>
        <Route path="app-setting" element={<AppSetting />}/>
        <Route path="advertisement" element={<Advertisement />}/>
        <Route path="add-advertisement" element={<AddAdvertisement />}/>
        <Route path="edit-advertisement/:id" element={<EditAdvertisement />}/>
        <Route path="comment-discussion" element={<CommentDiscussion />}/>
        <Route path="discussion-replies/:id" element={<DiscussionReplies />}/>
        <Route path="lms-comments" element={<LmsComment />}/>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
