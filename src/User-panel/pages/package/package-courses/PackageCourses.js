import { Card, Col, Input, Pagination, Row, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LIST_PACKAGE_COURSES } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import CourseBox from "../../../components/CourseBox";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";

function PackageCourses() {
  
  const { package_id } = useParams();
  const navigate = useNavigate();
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [total_courses, set_total_courses] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(package_id));

      const API_CALL = await LIST_PACKAGE_COURSES(FORM_DATA);
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

    LIST_API();
  }, [package_id]);

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("package_id", atob(package_id));
    FORM_DATA.append("page", page);
    FORM_DATA.append("title", search_query_title);

    const API_CALL = await LIST_PACKAGE_COURSES(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
    }
    set_pagination_loader(false);
  };

  const fetchResultsTitle = useCallback((value) => {
      debounce(async () => {
      try {
        set_search_query_title(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("package_id", atob(package_id));
        FORM_DATA.append("title", value);

        const API_CALL = await LIST_PACKAGE_COURSES(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_courses(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_courses(API_CALL?.data?.total_courses);
        }
        set_pagination_loader(false);
      } catch (err) {
        console.error("API Error:", err);
        set_pagination_loader(false);
      }
   }, 500)();
  }, [package_id]);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2><span style={{ cursor: "pointer" }} onClick={() => navigate("/packages")}><LeftOutlined /></span>Packages Courses</h2>
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
        ) : (
          <>
            {pagination_loader ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              </div>
            ) : (
              <div className="courses-card" style={{ marginTop: "20px" }}>
                <Row gutter={[20, 30]}>
                  {courses?.length > 0 ? (
                    courses.map((items) => (
                      <Col lg={8} md={8} sm={12} xs={24} key={items?.id}>
                        <CourseBox
                          id={btoa(items?.id)}
                          course_title={items?.title}
                          course_image={items?.thumbnail}
                          progress={items?.progress}
                          certificate ={items?.certificate}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col span={24}>
                      <p style={{ textAlign: "center", fontSize: "20px", color: "red", marginTop: "15px" }}>
                        Data Empty
                      </p>
                    </Col>
                  )}
                </Row>
              </div>
            )}

            {total_pages > 0 && (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  current={current_page}
                  total={total_courses}
                  pageSize={10}
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

export default PackageCourses;
