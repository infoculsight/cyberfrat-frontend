import {
  App,
  Button,
  Card,
  Col,
  Row,
  Spin,
  List
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UNASSIGN_PACKAGE_CHAPTER_LIST, VIEW_COURSE } from "../../apis/apis";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function UnAssignCourseDetails(props) {
  const { id } = useParams();
  const location = useLocation();
  const Navigate = useNavigate();
  const [page_loader, set_page_loader] = useState(true);
  const [image_loader, set_image_loader] = useState(false);
  const [course_data, set_course_data] = useState({});
  const [chapter_data, set_chapter_data] = useState([]);

  const handleBack = () => {
    if (location.state?.from) Navigate(location.state.from);
    else Navigate(-1);
  };

  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));
      const res = await VIEW_COURSE(FORM_DATA);
      if (res?.data?.status) {
        set_course_data(res.data.data);
      }
      set_page_loader(false);
    };
    VIEW_API();
  }, [id]);

  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("course_id", atob(id));
      const res = await UNASSIGN_PACKAGE_CHAPTER_LIST(FORM_DATA);
      if (res?.data?.status) {
        set_chapter_data(res.data.data);
      }
      set_page_loader(false);
    };
    VIEW_API();
  }, [id]);

  return (
    <div className="lms-body">
      {page_loader ? (
        <CulsightPageLoader />
      ) : (
        <div>
          <Card>
            {/* Header Section */}
            <Row>
              <Col span={12}>
                <h3
                  onClick={handleBack}
                  style={{
                    marginTop: "-10px",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                >
                  <LeftOutlined /> Go Back
                </h3>
              </Col>
            </Row>

            {/* Course Image and Info */}
            <Row>
              <Col span={14} style={{ paddingRight: "30px" }}>
                <div
                  style={{
                    width: "100%",
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 400,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                    }}
                  >
                    {!image_loader && (
                      <Spin
                        indicator={
                          <LoadingOutlined
                            style={{ fontSize: 28, color: "#e9c70a" }}
                            spin
                          />
                        }
                      />
                    )}

                    <img
                      src={course_data.thumbnail}
                      alt="Course Thumbnail"
                      onLoad={() => set_image_loader(true)}
                      onError={() => set_image_loader(false)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                        display: image_loader ? "block" : "none",
                      }}
                    />
                  </div>
                </div>
              </Col>

              <Col span={10}>
                <h2 style={{ textTransform: "capitalize" }}>
                  {course_data.title}
                </h2>
                <p>
                  <b style={{ color: "#e9c70ada" }}>Instructor:</b>{" "}
                  {course_data.instructor_display_name}
                </p>
                <p>
                  <b style={{ color: "#e9c70ada" }}>Language:</b>{" "}
                  {course_data.language}
                </p>
                <p>
                  <b style={{ color: "#e9c70ada" }}>Duration:</b>{" "}
                  {course_data.course_duration}
                </p>
              </Col>
            </Row>

            {/* Description */}
            <h3 style={{ color: "#e9c70ada" }}>Description</h3>
            <div
              dangerouslySetInnerHTML={{ __html: course_data.description }}
            />

            <h3 style={{ color: "#e9c70ada", marginTop: "20px" }}>Chapters</h3>
            {Array.isArray(chapter_data) && chapter_data.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={chapter_data}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <span style={{ fontWeight: 600 }}>
                          {index + 1}. {item.title}
                        </span>
                      }
                      description={
                        <span>
                          <b>Duration:</b> {item.chapter_duration}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>No chapters available</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default UnAssignCourseDetails;
