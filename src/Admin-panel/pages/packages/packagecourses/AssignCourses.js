import { App, Card, Col, Input, Modal, Pagination, Row, Select } from "antd";
import { Option } from "antd/es/mentions";

import React, { useCallback, useEffect, useState } from "react";
import { ASSIGN_PACKAGE_COURSES } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import AssignCourseBox from "./AssignCourseBox";

function PackageCourses(props) {
  const { notification } = App.useApp();

  const [courses, set_courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState(0);

  const [search_paceholder, set_search_paceholder] =
    useState("Search by title");
  const [search_query_title, set_search_query_title] = useState("");
  const [search_query_tag, set_search_query_tag] = useState("");
  const [search_query_select, set_search_query_select] = useState("Name");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(props.package_id));

      const API_CALL = await ASSIGN_PACKAGE_COURSES(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_courses(API_CALL.data?.courses);
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
  }, [props.package_id]);

  const handleCheckboxChange = async (e, record) => {
    const isChecked = e.target.checked;
    if (isChecked) {
  
      setSelectedCourse(record);
      setIsModalVisible(true);
    }
  };

  const selectBefore = (
    <Select
      defaultValue="Title"
      onChange={(value) => {
        if (value === "Title") {
          set_search_paceholder("Search by title");
          set_search_query_select(value);
          if (search_query_title !== "") {
            fetchResultsTitle(search_query_title);
          }
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
          if (search_query_tag !== "") {
            fetchResultsTag(search_query_tag);
          }
        }
      }}
    >
      <Option value="Title">Title</Option>
      <Option value="Tag">Tag</Option>
    </Select>
  );

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("title", search_query_title);
    FORM_DATA.append("tag", search_query_tag);
    FORM_DATA.append("package_id", atob(props.package_id));

    const API_CALL = await ASSIGN_PACKAGE_COURSES(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_courses(API_CALL.data?.courses);
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
          FORM_DATA.append("token", localStorage.getItem("token"));
          FORM_DATA.append("title", value);
          FORM_DATA.append("tag", "");
          FORM_DATA.append("package_id", atob(props.package_id));

          const API_CALL = await ASSIGN_PACKAGE_COURSES(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_courses(API_CALL.data?.courses);
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
    },
    [props.package_id]
  );

  const fetchResultsTag = useCallback(
    (value) => {
      debounce(async () => {
        try {
          set_search_query_title(value);
          set_pagination_loader(true);
          const FORM_DATA = new FormData();
          FORM_DATA.append("token", localStorage.getItem("token"));
          FORM_DATA.append("title", value);
          FORM_DATA.append("tag", "");
          FORM_DATA.append("package_id", atob(props.package_id));

          const API_CALL = await ASSIGN_PACKAGE_COURSES(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_courses(API_CALL.data?.courses);
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
    },
    [props.package_id]
  );

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

  return (
    <div className="lms-body">
      <Card>
        <h2>Courses</h2>
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
        </Row>

        {loading && pagination_loader ? (
          <>
            <CulsightPageLoader />
          </>
        ) : (
          <>
         
                <Row gutter={[20, 30]} style={{marginTop:"15px"}}>
                  {courses?.length > 0 ? (
                    <>
                      {courses?.map((items) => (
                        <>
                          <Col lg={4} md={8} sm={12} xs={24}>
                            <AssignCourseBox
                              id={btoa(items?.id)}
                              course_title={items?.title}
                              course_image={items?.thumbnail}
                              onAssignCourse={handleCheckboxChange}
                            />
                          </Col>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </Row>
           
                <div className="courses-card" style={{ marginTop: "20px" }}>
                  <div style={{ float: "right", marginTop: "20px" }}>
                    {" "}
                    <Pagination
                      current={current_page}
                      total={total_courses}
                      pageSize={12}
                      onChange={pagination_on_change}
                      total_pages={total_pages}
                    />
                  </div>
                </div>
              </>
          
        )}

        <Modal
          title="Confirm Assignment"
          open={isModalVisible}
          onOk={async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("package_id", atob(props.package_id));
            FORM_DATA.append("course_id", selectedCourse?.id);

            try {
              const API_CALL = await ASSIGN_PACKAGE_COURSES(FORM_DATA);
              if (API_CALL?.data?.status) {
                notification.success({
                  message: "Learner Assigned",
                  description: `${selectedCourse.title} has been assigned successfully.`,
                  placement: "topRight",
                });
              } else {
                notification.error({
                  message: "Assignment Failed",
                  description: `Could not assign ${selectedCourse.title}.`,
                  placement: "topRight",
                });
              }
            } catch (error) {
              notification.error({
                message: "API Error",
                description:
                  "Something went wrong while assigning the learner.",
                placement: "topRight",
              });
              console.error("API error:", error);
            }
            setIsModalVisible(false);
            setSelectedCourse(null);
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedCourse(null);
          }}
          okText="Assign"
          cancelText="Cancel"
        >
          <p>
            Do you really want to assign{" "}
            <strong>{selectedCourse?.title}</strong> to this package?
          </p>
        </Modal>
      </Card>
    </div>
  );
}
export default PackageCourses;
