import { Button, Card, Col, Input, message, Modal, Pagination, Row, Select, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { COURSE_STATUS, DELETE_COURSE, LIST_PACKAGE_COURSES } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import CourseBox from "../../../components/CourseBox";
import AssignCourses from "./AssignCourses";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";

function PackageCourses() {
  const { package_id } = useParams();
  const navigate = useNavigate();
  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState(0);
  const [isPublished, setIsPublished] = useState({});
  const [search_paceholder, set_search_paceholder] = useState("Search by title");
  const [search_query_title, set_search_query_title] = useState("");
  const [search_query_tag, set_search_query_tag] = useState("");
  const [search_query_select, set_search_query_select] = useState("Title");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assignKey, setAssignKey] = useState(0);

  const location = useLocation();
  const from = location.state?.from || "/packages";

  const handleBack = () => {
    navigate(from);
  };

  const showModal = () => {
    setAssignKey((prev) => prev + 1);
    setIsModalVisible(true);
  };

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
      setLoading(false);
    }
  };

  const handleModalCancel = async () => {
    setIsModalVisible(false);
    setLoading(true);
    await LIST_API();
  };

  useEffect(() => {
    LIST_API();
  }, [package_id]);

  const selectBefore = (
    <Select
      defaultValue="Title"
      onChange={(value) => {
        if (value === "Title") {
          set_search_paceholder("Search by title");
          set_search_query_select(value);
          if (search_query_tag !== "") {
            set_search_query_title(search_query_tag);
            set_search_query_tag("");
            fetchResultsTitle(search_query_tag);
          }
        } else {
          set_search_paceholder("Search by tag");
          set_search_query_select(value);
          if (search_query_title !== "") {
            set_search_query_tag(search_query_title);
            set_search_query_title("");
            fetchResultsTag(search_query_title);
          }
        }
      }}
    >
      <Select.Option value="Title">Title</Select.Option>
      <Select.Option value="Tag">Tag</Select.Option>
    </Select>
  );

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("package_id", atob(package_id));
    FORM_DATA.append("page", page);
    FORM_DATA.append("title", search_query_title);
    FORM_DATA.append("tag", search_query_tag);
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
        FORM_DATA.append("tag", "");
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

  
  const fetchResultsTag = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_tag(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("package_id", atob(package_id));
        FORM_DATA.append("title", "");
        FORM_DATA.append("tag", value);
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
    if (search_query_select === "Title") {
      set_search_query_tag("");
      fetchResultsTitle(value);
    } else {
      set_search_query_title("");
      fetchResultsTag(value);
    }
  };

  const deleteCourse = async (course_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", course_id);

    try {
      const response = await DELETE_COURSE(FORM_DATA);
      if (response?.status) {
        message.success("Course deleted successfully");
        await LIST_API();
      } else {
        message.error(response?.message || "Failed to delete course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      message.error("Something went wrong");
    }
  };

  const publishCourse = async (course_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", course_id);

    try {
      const response = await COURSE_STATUS(FORM_DATA);
      if (response?.status) {
        message.success("Course published successfully!");
        setIsPublished((prev) => ({
          ...prev,
          [course_id]: true,
        }));
        await LIST_API();
      } else {
        message.error(response?.message || "Failed to publish course");
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      message.error("Something went wrong while publishing");
    }
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
          <Col xs={24} sm={24} md={18} lg={20}>
            <Input
              addonBefore={selectBefore}
              placeholder={search_paceholder}
              onChange={handleInput}
              size="large"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={24} md={6} lg={4}>
            <Button block type="primary" size="large" onClick={showModal}>
              Assign Courses
            </Button>
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
                    <Col lg={8} md={8} sm={12} xs={24} key={items?.id}>
                      <CourseBox
                        id={btoa(items?.id)}
                        course_title={items?.title}
                        course_image={items?.thumbnail}
                        course_ribbon={items?.ribbon}
                        course_status={items?.status}
                        chapters_count={items?.chapters_count}
                        users_count={items?.users_count}
                        publishCourse={() => publishCourse(items?.id)}
                        isPublished={isPublished[items?.id] === true}
                        deleteCourse={() => deleteCourse(items?.id)}
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
                      Data Empty
                    </p>
                  </Col>
                )}
              </Row>
            </div>

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

        <Modal
          title="Assign Course to Learners"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={1200}
        >
          <AssignCourses
            key={assignKey}
            onClose={handleModalCancel}
            package_id={package_id}
          />
        </Modal>
      </Card>
    </div>
  );
}
export default PackageCourses;
