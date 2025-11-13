import { Card, Col, Input, List, Pagination, Row, Spin, Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UNASSIGN_PACKAGE_COURSE_LIST } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";

function UnAssignCourses() {
  const Navigate = useNavigate();
  const location = useLocation();
  const { package_id } = useParams();
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [total_courses, set_total_courses] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");

  const handleBack = () => {
    if (location.state?.from) Navigate(location.state.from);
    else Navigate(-1);
  };

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(package_id));
      const API_CALL = await UNASSIGN_PACKAGE_COURSE_LIST(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_courses(API_CALL.data?.data);
        set_total_courses(API_CALL.data?.total_courses);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
      }
      setLoading(false);
    };

    LIST_API();
  }, [package_id]);

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("package_id", atob(package_id));
    FORM_DATA.append("page", page);
    FORM_DATA.append("title", search_query_title);

    const API_CALL = await UNASSIGN_PACKAGE_COURSE_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
    }
    set_pagination_loader(false);
  };

  const fetchResultsTitle = useCallback(
    debounce(async (value) => {
      try {
        set_search_query_title(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("package_id", atob(package_id));
        FORM_DATA.append("title", value);

        const API_CALL = await UNASSIGN_PACKAGE_COURSE_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_courses(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_courses(API_CALL?.data?.total_courses);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
      set_pagination_loader(false);
    }, 500),
    [package_id]
  );

  const handleInput = (e) => {
    fetchResultsTitle(e.target.value);
  };

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2>
              <span style={{ cursor: "pointer" }} onClick={handleBack}>
                <LeftOutlined />
              </span>{" "}
              Packages Courses
            </h2>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="middle">
          <Col span={24}>
            <Input
              placeholder="Search by title"
              addonBefore={<span>Title</span>}
              onChange={handleInput}
              size="large"
              style={{ width: "100%" }}
            />
          </Col>
        </Row>

        {loading ? (
          <CulsightPageLoader />
        ) : pagination_loader ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={courses}
              style={{ marginTop: "20px" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => Navigate("/unassign-course-details/" + btoa(item.id))}
                    >
                      View Details
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="thumbnail"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            objectFit: "cover",
                          }}
                        />
                      ) : null
                    }
                    title={<b>{item.title || "Untitled Course"}</b>}
                    description={
                      <>
                        <p>
                          <b>Instructor:</b> {item.instructor_display_name || "N/A"}
                        </p>
                        <p>
                          <b>Duration:</b> {item.course_duration || "N/A"}
                        </p>
                      </>
                    }
                  />
                </List.Item>
              )}
            />

            {total_pages > 0 && (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  current={current_page}
                  total={total_courses}
                  pageSize={9}
                  onChange={pagination_on_change}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default UnAssignCourses;
