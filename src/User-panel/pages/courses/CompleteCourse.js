import { Col, Input, Pagination, Row, Spin, Select } from "antd";
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
  const [search_query, set_search_query] = useState("");


  const [search_by, set_search_by] = useState("title");

  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_status", "Completed");

    const API_CALL = await COURSE_LIST(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_total_courses(API_CALL.data?.total_courses);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);

    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("course_status", "Completed");
    FORM_DATA.append(search_by, search_query);

    const API_CALL = await COURSE_LIST(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
    }

    set_pagination_loader(false);
  };


  const debouncedSearch = useCallback(
    debounce(async (value) => {
      set_pagination_loader(true);

      const FORM_DATA = new FormData();
      FORM_DATA.append("course_status", "Completed");
      FORM_DATA.append(search_by, value);

      const API_CALL = await COURSE_LIST(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_courses(API_CALL.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_courses(API_CALL?.data?.total_courses);
      }

      set_pagination_loader(false);
    }, 500),
    [search_by]
  );

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query(value);
    debouncedSearch(value);
  };

  return (
    <>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 10 }}>
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={
              <Select
                value={search_by}
                onChange={(value) => set_search_by(value)}
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
                      expired={items?.expired}
                      validity={items?.valid_till}
                      show_validity={items?.show_validity_to_learner}
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
  );
}

export default CompleteCourse;
