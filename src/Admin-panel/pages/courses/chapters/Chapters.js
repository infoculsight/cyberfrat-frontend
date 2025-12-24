import { Card, Col, Input, Row, Select, Button, Pagination, App, Popconfirm } from "antd";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CHAPTER_LIST, CHAPTER_STATUS } from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
// import TruncatedHTML from "../../../components/TruncatedHTML";
import { GlobalOutlined, LeftOutlined, LockOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";

const { Option } = Select;

export default function Chapters() {
   const { notification } = App.useApp();
  const Navigate = useNavigate();
  const location = useLocation();
  const course_title =
    location.state?.title || localStorage.getItem("course_title") || "Course";

  const { course_id } = useParams();
  const [chapters, set_chapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search_query_title, set_search_query_title] = useState("");
  const [current_page, set_current_page] = useState(1);
  const [total_chapters, set_total_chapters] = useState(0);
  const [total_pages, set_total_pages] = useState(1);

  const handleBack = () => {
    if (location.state?.from) {
      Navigate(location.state.from);
    } else {
      Navigate(-1);
    }
  };

  const fetchChapterList = useCallback(
    async (title = "", page = 1) => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("course_id", atob(course_id));
      FORM_DATA.append("page", page);
      if (title) FORM_DATA.append("title", title);

      try {
        const API_CALL = await CHAPTER_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_chapters(API_CALL.data?.data || []);
          set_current_page(API_CALL.data?.current_page || 1);
          set_total_chapters(API_CALL.data?.total_chapters || 0);
          set_total_pages(API_CALL.data?.total_pages || 1);
        } else {
          set_chapters([]);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    },
    [course_id]
  );

  const debouncedSearch = useRef(
    debounce((value) => {
      setLoading(true);
      fetchChapterList(value, 1);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_title(value);
    debouncedSearch(value);
  };

  const pagination_on_change = (page) => {
    setLoading(true);
    fetchChapterList(search_query_title, page);
  };

  useEffect(() => {
    fetchChapterList();
  }, [fetchChapterList]);

  const selectBefore = (
    <Select defaultValue="Title">
      <Option value="Title">Title</Option>
    </Select>
  );

 const change_status = async (id) => {
  setLoading(true)
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await CHAPTER_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
       setLoading(false);
       fetchChapterList();
      } else {
        //  setLoading(false);
      }
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="lms-body">
      <Card>
        <h2>
          <span style={{ cursor: "pointer" }} onClick={handleBack}>
            <LeftOutlined />
          </span>
          {course_title} - Chapters
        </h2>
      
        <br />

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={18} lg={20}>
            <Input
              addonBefore={selectBefore}
              placeholder="Search by title"
              onChange={handleInput}
              size="large"
              style={{ width: "100%" }}
              value={search_query_title}
            />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4}>
            <Button
            variant="solid"
            color="green"
            size="large"
            style={{ marginLeft: "10px", float: "right" }}
            onClick={() => Navigate("/add-chapter/" + course_id)}
          >
            Create Chapter
          </Button>
          </Col>
        </Row>

        {loading ? (
          <CulsightPageLoader />
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
              {chapters?.length > 0 ? (
                chapters.map((item) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    key={item?.id}
                    style={{ display: "flex" }}
                  >
                    <Card
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      // cover={
                      //   item?.image ? (
                      //     <img
                      //       alt={item?.title || "chapter-image"}
                      //       src={item.image}
                      //       style={{ height: "200px", objectFit: "cover" }}
                      //     />
                      //   ) : null
                      // }
                      actions={[
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            localStorage.setItem("course_title", course_title);
                            Navigate("/edit-chapter/" + btoa(item?.id), {
                              state: { title: course_title },
                              from: window.location.pathname,
                            });
                          }}
                        >
                          View
                        </Button>,
                        <Popconfirm
                          title={
                            item?.status
                              ? "Are you sure you want to Unpublish this chapter ?"
                              : " Are you sure you want to publish this chapter ?"
                          }
                          onConfirm={() => change_status(item?.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            size="small"
                            type="primary"
                            style={{
                              backgroundColor: item?.status 
                                ? "#52c41a"
                                : "#faad14",
                              borderColor: item?.status 
                                ? "#52c41a"
                                : "#faad14",
                            }}
                          >
                            {item?.status ? (
                             <> Published <GlobalOutlined /></>
                            ) : (
                             <> UnPublished <LockOutlined /> </>
                            )}
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div style={{ width: "100%", textAlign: "center" }}>
                            <span>{item?.title}</span>
                          </div>
                        }
                        // description={
                        //   item?.introduction ? (
                        //     <TruncatedHTML html={item.introduction} />
                        //   ) : null
                        // }
                      />
                      {/* agar content add karna ho to neeche space fill kare */}
                      <div style={{ flexGrow: 1 }}></div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p style={{ textAlign: "center", color: "red" }}>
                    No chapters found
                  </p>
                </Col>
              )}
            </Row>

            {total_pages > 0 && (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  current={current_page}
                  total={total_chapters}
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
