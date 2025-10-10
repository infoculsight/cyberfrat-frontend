import { Col, Input, Pagination, Row, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import CourseBox from "../../components/CourseBox";
import { COURSE_LIST } from "../../apis/apis";
import debounce from "lodash.debounce";
import { LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function CompleteCourse() {
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");



  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_status", 'Completed');
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
    FORM_DATA.append("title", search_query_title);
    FORM_DATA.append("course_status", 'Completed');
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

  const fetchResultsTitle = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_title(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("token", localStorage.getItem("token"));
        FORM_DATA.append("title", value);
        FORM_DATA.append("course_status", 'Completed');
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
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };

  return (
    <>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={<span>Title</span>}
            placeholder="Search by title"
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
                      certificate={items.certificate}
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
                onChange={pagination_on_change}
              />
            )}
          </div>
        </>
      )}

    </>
  );
}

export default CompleteCourse;
