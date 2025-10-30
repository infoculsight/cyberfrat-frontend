import { Card, Col, Row, Tabs } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditChapterDetails from "./components/EditChapterDetails";

import {
  LeftOutlined,
} from "@ant-design/icons";
import LiveTest from "./components/livetest/LiveTest";
import QuizSetting from "./components/quiztest/QuizSetting";
import { VIEW_CHAPTER } from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import QuizQuestion from "./components/quiztest/QuizQuestion";

const { TabPane } = Tabs;

export default function EditChapter(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const course_title =
    location.state?.title ||
    localStorage.getItem("course_title") ||
    "Course";
  const [course_id, set_course_id] = useState(null);
  const [chapter_details, set_chapter_details] = useState('');
  const [chapter_details_loader, set_chapter_details_loader] = useState(true);
  const [page_refresh, set_page_refresh] = useState(true);

  

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
  }, [page_refresh, id]); // id bhi dependency me add kiya, because used inside VIEW_API


  return (
    <div className="lms-body">
      <Card>
        {chapter_details_loader ? (
          <CulsightPageLoader />
        ) : (
          <>
            <Row>
              <Col span={12}>
                <h2> <span  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/chapters/" + btoa(course_id))}><LeftOutlined /></span>{course_title} - {chapter_details?.title} Details</h2>
              </Col>
            </Row>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Chapter Details" key="1">
                <div style={{ backgroundColor: "#141414", padding: "15px", marginTop: "-16px", marginLeft: "1px" }}>
                  <EditChapterDetails
                    set_course_id={set_course_id}
                    chapter_details={chapter_details}
                    set_page_refresh={set_page_refresh}
                    page_refresh={page_refresh}

                  />
                </div>
              </TabPane>
             
              {/* <TabPane tab="Live Test Setting" key="4">
                <div style={{ backgroundColor: "#141414", padding: "15px", marginTop: "-16px", marginLeft: "1px" }}>
                  <LiveTest chapter_id={id} course_id={course_id} />
                </div>
              </TabPane>
              <TabPane tab="Live Test Questions" key="5">
                <div style={{ backgroundColor: "#141414", padding: "15px", marginTop: "-16px", marginLeft: "1px" }}>
                  <LiveTestQuestion chapter_id={id} course_id={course_id} />
                </div>
              </TabPane> */}

              <TabPane tab="Quiz Setting" key="6">
                <div style={{ backgroundColor: "#141414", padding: "15px", marginTop: "-16px", marginLeft: "1px" }}>
                  <QuizSetting chapter_id={id} course_id={course_id} />
                </div>
              </TabPane>


              <TabPane tab="Quiz Questions" key="7">
                <div style={{ backgroundColor: "#141414", padding: "15px", marginTop: "-16px", marginLeft: "1px" }}>
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
