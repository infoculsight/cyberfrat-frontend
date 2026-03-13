import { Card, Col, Row, Tabs } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditChapterDetails from "./components/EditChapterDetails";
import { LeftOutlined } from "@ant-design/icons";
import QuizSetting from "./components/quiztest/QuizSetting";
import { VIEW_CHAPTER } from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import QuizQuestion from "./components/quiztest/QuizQuestion";

const { TabPane } = Tabs;

export default function EditChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const course_title =
    location.state?.title ||
    localStorage.getItem("course_title") ||
    "Course";

  const [course_id, set_course_id] = useState(null);
  const [chapter_details, set_chapter_details] = useState("");
  const [chapter_details_loader, set_chapter_details_loader] = useState(true);
  const [page_refresh, set_page_refresh] = useState(true);


   const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };
  
  // Get current tab from URL
  const getTabKeyFromPath = () => {
    const path = location.pathname;
    if (path.includes("/quiz-setting")) return "2";
    if (path.includes("/quiz-questions")) return "3";
    return "1"; // default tab = Chapter Details
  };

  const activeTabKey = getTabKeyFromPath();

  // Handle tab change (update route)
  const onTabChange = (key) => {
    if (key === "1") navigate(`/edit-chapter/${id}`);
    if (key === "2") navigate(`/edit-chapter/${id}/quiz-setting`);
    if (key === "3") navigate(`/edit-chapter/${id}/quiz-questions`);
  };

  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));
      const EDIT_API_RESPONSE = await VIEW_CHAPTER(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_chapter_details(response_data);
      }
      set_chapter_details_loader(false);
    };

    VIEW_API();
  }, [page_refresh, id]);

  return (
    <div className="lms-body">
      <Card>
        {chapter_details_loader ? (
          <CulsightPageLoader />
        ) : (
          <>
            <Row>
              <Col span={24}>
                <h2>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={handleBack}     
                  >
                    <LeftOutlined />
                  </span>{" "}
                  {course_title} - {chapter_details?.title} Details
                </h2>
              </Col>
            </Row>

            {/* ✅ Tab routing implementation */}
            <Tabs activeKey={activeTabKey} onChange={onTabChange}>
              <TabPane tab="Chapter Details" key="1">
                <div
                  style={{
                    backgroundColor: "#141414",
                    padding: "15px",
                    marginTop: "-16px",
                    marginLeft: "1px",
                  }}
                >
                  <EditChapterDetails
                    set_course_id={set_course_id}
                    chapter_details={chapter_details}
                    set_page_refresh={set_page_refresh}
                    page_refresh={page_refresh}
                  />
                </div>
              </TabPane>

              <TabPane tab="Quiz Setting" key="2">
                <div
                  style={{
                    backgroundColor: "#141414",
                    padding: "15px",
                    marginTop: "-16px",
                    marginLeft: "1px",
                  }}
                >
                  <QuizSetting chapter_id={id} course_id={course_id} />
                </div>
              </TabPane>

              <TabPane tab="Quiz Questions" key="3">
                <div
                  style={{
                    backgroundColor: "#141414",
                    padding: "15px",
                    marginTop: "-16px",
                    marginLeft: "1px",
                  }}
                >
                  <QuizQuestion chapter_id={id} course_id={course_id} />
                </div>
              </TabPane>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  );
}
