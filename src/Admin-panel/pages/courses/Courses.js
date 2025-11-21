import {
  Button,
  Card,
  Col,
  Input,
  message,
  Pagination,
  Row,
  Select,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import CourseBox from "../../components/CourseBox";
import { useNavigate } from "react-router-dom";
import { COURSE_LIST, COURSE_STATUS, DELETE_COURSE } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function Courses() {
  const Navigate = useNavigate();
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");
  const [isPublished, setIsPublished] = useState({});

  const LIST_API = async () => {
    setLoading(true);
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
    FORM_DATA.append("title", search_query_title);
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

        FORM_DATA.append("title", value);
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
    }, 500)(); // Call debounce immediately
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };

  const selectBefore = (
    <Select defaultValue="Title" disabled>
      <Select.Option value="Title">Title</Select.Option>
    </Select>
  );

  const publishCourse = async (course_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", course_id);

    try {
      const response = await COURSE_STATUS(FORM_DATA);
      console.log("COURSE_STATUS response:", response);

      if (response?.status) {
        message.success("Course published successfully!");

        setIsPublished((prev) => ({
          ...prev,
          [course_id]: true,
        }));
        setLoading(true);
        await LIST_API();
      } else {
        message.error(response?.message || "Failed to publish course");
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      message.error("Something went wrong while publishing");
    }
  };


  const deleteCourse = async (course_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", course_id);

    try {
      const response = await DELETE_COURSE(FORM_DATA);
      if (response?.status) {
        message.success("Course deleted successfully");
        await LIST_API(); // Refresh course list
      } else {
        message.error(response?.message || "Failed to delete course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      message.error("Something went wrong");
    }
  };


  return (
    <div className="lms-body">
      <Card>
        <h2>Courses
          <Button
            type="primary"
            size="large"
            onClick={() => Navigate("/add-courses")}
            style={{ marginLeft: "10px", float: "right" }}
          >
            Create Course
          </Button>

        </h2><br></br>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={18} lg={12}>
            <Input
              addonBefore={selectBefore}
              placeholder="Search by title"
              onChange={handleInput}
              size="large"
              style={{ width: "100%" }}
            />
          </Col>


        </Row>

        {loading && pagination_loader ? (
          <CulsightPageLoader />
        ) : (
          <>

            <div className="courses-card" style={{ marginTop: "20px" }}>
              <Row gutter={[30, 40]}>
                {courses?.length > 0 ? (
                  <>
                    {courses?.map((items) => (
                      <Col lg={8} md={8} sm={12} xs={24} key={items?.id}>
                        <CourseBox
                          id={btoa(items?.id)}
                          course_title={items?.title}
                          course_image={items?.thumbnail}
                          course_ribbon={items?.ribbon}
                          course_status={items?.status}
                          chapters_count={items?.chapters_count}
                          users_count={items?.users_count}
                          publishCourse={(id) => publishCourse(items?.id)}
                          isPublished={isPublished[items?.id] === true}
                          deleteCourse={() => deleteCourse(items?.id)}
                        />
                      </Col>
                    ))}
                  </>
                ) : (
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        color: "red",
                        marginTop: "15px",
                      }}
                    >
                      Data Empty
                    </p>
                  </Col>
                )}
              </Row>
            </div>

            {total_pages > 0 ? (
              <>
                <div style={{ float: "right", marginTop: "20px" }}>
                  <Pagination
                    current={current_page}
                    total={total_courses}
                    pageSize={9}
                    onChange={pagination_on_change}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "red" }}>
                  <h2>No Courses Found</h2>
                </div>
              </>
            )}
          </>
        )}
      </Card>

    </div>
  );
}

export default Courses;
