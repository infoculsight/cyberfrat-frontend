import { Card, Col, Input, Pagination, Row, Select, Spin, Tabs } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import CourseBox from "../../components/CourseBox";
import { COURSE_LIST } from "../../apis/apis";
import debounce from "lodash.debounce";
import { LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import CompleteCourse from "./CompleteCourse";
import IncompleteCouse from "./IncompleteCouse";

function Courses() {
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");
  const [search_by, set_search_by] = useState("title");

  const navigate = useNavigate();
  const location = useLocation();

  // Get tab key from URL path
  const getTabKeyFromPath = () => {
    const path = location.pathname;
    if (path.includes("/complete")) return "2";
    if (path.includes("/incomplete")) return "3";
    return "1";
  };

  const activeTabKey = getTabKeyFromPath();
  const onTabChange = (key) => {
    if (key === "1") navigate("/courses/my");
    if (key === "2") navigate("/courses/complete");
    if (key === "3") navigate("/courses/incomplete");
  };

  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await COURSE_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_total_courses(API_CALL.data?.total_courses);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      setLoading(false);
    } else {
      console.log("error");
      setLoading(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append(search_by, search_query_title);
    const API_CALL = await COURSE_LIST(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
      set_pagination_loader(false);
    } else {
      set_pagination_loader(false);
    }
  };

  const fetchResultsTitle = useCallback(
    (value) => {
      debounce(async () => {
        try {
          set_search_query_title(value);
          set_pagination_loader(true);
          const FORM_DATA = new FormData();
          FORM_DATA.append(search_by, value);

          const API_CALL = await COURSE_LIST(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_courses(API_CALL.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_courses(API_CALL?.data?.total_courses);
            set_pagination_loader(false);
          } else {
            set_pagination_loader(false);
          }
        } catch (err) {
          console.error("API Error:", err);
        }
      }, 500)();
    },
    [search_by] // 🔥 RE-RUN WHEN SELECT CHANGES
  );

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };

  return (
    <div className="lms-body">
      <Card>
        <h2>Courses</h2>

        {loading ? (
          <CulsightPageLoader />
        ) : (
          <Tabs
            activeKey={activeTabKey}
            onChange={onTabChange}
            items={[
              {
                key: "1",
                label: "All Courses",
                children: (
                  <>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={24} md={18} lg={20}>
                        <Input
                          addonBefore={


                            <Select
                              value={search_by}
                              onChange={(value) => set_search_by(value)}
                              style={{ width: 120 }}
                            >
                              <Select.Option value="title">Title</Select.Option>
                              <Select.Option value="tag">Tags</Select.Option>
                            </Select>
                          }
                          placeholder={`Search by ${search_by}`}
                          onChange={handleInput}
                          size="large"
                          style={{ width: "100%" }}
                        />


                      </Col>
                    </Row>

                    {pagination_loader ? (
                      <div style={{ textAlign: "center", padding: "60px" }}>
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                      </div>
                    ) : (
                      <>
                        <div className="courses-card" style={{ marginTop: "20px" }}>
                          <Row gutter={[20, 30]}>
                            {courses?.length > 0 ? (
                              courses.map((items) => (
                                <Col key={items?.id} lg={8} md={8} sm={12} xs={24}>
                                  <CourseBox
                                    id={btoa(items?.id)}
                                    course_title={items?.title}
                                    course_image={items?.thumbnail}
                                    progress={items.progress}
                                    course_ribbon={items.ribbon}
                                    certificate={items?.certificate}
                                  />
                                </Col>
                              ))
                            ) : (
                              <Col span={24}>
                                <p
                                  style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    color: "red",
                                    marginTop: "15px",
                                  }}
                                >
                                  No Result
                                </p>
                              </Col>
                            )}
                          </Row>
                        </div>
                        <div style={{ float: "right", marginTop: "20px" }}>
                          {total_pages > 0 && (
                            <Pagination
                              current={current_page}
                              total={total_courses}
                              pageSize={9}
                              onChange={pagination_on_change}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                ),
              },
              {
                key: "3",
                label: "In Progress",
                children: <IncompleteCouse />,
              },
              {
                key: "2",
                label: "Completed Courses",
                children: <CompleteCourse />,
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}

export default Courses;
