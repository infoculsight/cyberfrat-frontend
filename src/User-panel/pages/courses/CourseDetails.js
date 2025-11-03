import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  List,

  Pagination,
  Row,
  Spin,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LIST_COMMENT, ADD_COMMENT, VIEW_COURSE } from "../../apis/apis";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import CustomRichTextEditor from "../../components/CustomTextEditor";
import { FixTruncatedHTMLList } from "../../components/TruncatedHTML"

function CourseDetails(props) {
  const { id } = useParams();
  const { notification, message } = App.useApp();
  const Navigate = useNavigate();

  const [page_loader, set_page_loader] = useState(true);
  const [card_loader, set_card_loader] = useState(true);
  const [image_loader, set_image_loader] = useState(false)
  const [course_data, set_course_data] = useState({});
  const [description, set_description] = useState("");
  const [comments, set_comments] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_comments, set_total_comments] = useState(0);
  const [total_pages, set_total_pages] = useState(1);

  // 🔹 Format time (IST) + Relative time (under 4 hours)
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    // Convert server string "2025-10-14 10:41:40" → Date object in IST
    const createdTimeUTC = new Date(timestamp.replace(" ", "T") + "Z");
    const nowUTC = new Date();

    const diffMs = nowUTC - createdTimeUTC;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 4) {
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60)
        return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }

    // 🔸 Convert to IST
    const istDate = new Date(createdTimeUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const formatted = istDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    return formatted; // e.g., "14 Oct 2025, 3:41 PM"
  };

  // 🔹 Fetch course details
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

  // 🔹 Fetch comments list
  const fetchCommentList = useCallback(
    async (page = 1) => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("view_id", atob(id));
      FORM_DATA.append("page", page);
      FORM_DATA.append("comment_type", "course");

      try {
        const API_CALL = await LIST_COMMENT(FORM_DATA);
        if (API_CALL?.data?.status) {
          const data = API_CALL.data;
          set_comments(data.comments || []);
          set_current_page(data.page || 1);
          set_total_comments(data.total_comments || 0);
          set_total_pages(data.total_pages || 1);
        } else {
          set_comments([]);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        set_card_loader(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchCommentList();
  }, [fetchCommentList]);

  // 🔹 Add new comment
  const onFinish = async () => {
    if (!description.trim()) {
      message.warning("Please write a comment first.");
      return;
    }

    set_card_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("view_id", atob(id));
    FORM_DATA.append("description", description);
    FORM_DATA.append("comment_type", "course");

    try {
      const response = await ADD_COMMENT(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Success",
          description: response?.data?.message,
        });
        set_description("");
        fetchCommentList(1);
      } else {
        message.error(response?.data?.message || "Failed to add comment");
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    } finally {
      set_card_loader(false);
    }
  };

  // 🔹 Handle pagination
  const pagination_on_change = (page) => {
    set_card_loader(true);
    set_current_page(page);
    fetchCommentList(page);
  };

  return (
    <div className="lms-body">
      {page_loader ? (
        <CulsightPageLoader />
      ) : (
        <div>
          <Card>
            <Row>
              <Col span={12}>
                <h3
                  onClick={() => Navigate("/courses")}
                  style={{
                    marginTop: "-10px",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                >
                  <LeftOutlined /> Go Back
                </h3>
              </Col>
              <Col span={12}>
                <Button
                  style={{
                    float: "right",
                    marginTop: "-10px",
                    marginBottom: "10px",
                  }}
                  type="primary"
                  onClick={() => {
                    localStorage.setItem("course_title", props.course_title);
                    Navigate("/chapters/" + btoa(course_data.id), {
                      state: { title: course_data.course_title },
                      from: window.location.pathname,
                    });
                  }}
                >
                  Start Learning
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={14} style={{ paddingRight: "30px" }}>
                <div style={{ width: "100%", position: "relative", borderRadius: 8, overflow: "hidden" }}>
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
                        indicator={<LoadingOutlined style={{ fontSize: 28, color: "#e9c70a" }} spin />}
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
                <h2>{course_data.title}</h2>
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

            <h3 style={{ color: "#e9c70ada" }}>Description</h3>
             <div dangerouslySetInnerHTML={{ __html: course_data.description }} />
            <h3 style={{ color: "#e9c70ada" }}>How to use</h3>
             <div dangerouslySetInnerHTML={{ __html: course_data.how_to_use }} />

            {/* 🔹 Comment Section */}
            <div style={{ marginTop: "30px" }} >
              <CustomRichTextEditor
                editorLabel="Course Discussions"
                value={description}
                onChange={(val) => set_description(val)}
                placeholder="Write something..."
              />
              <Button
                type="primary"
                style={{ marginTop: "-20px" }}
                onClick={onFinish}
                loading={card_loader}
              >
                Submit
              </Button>

              <List
                itemLayout="horizontal"
                dataSource={comments}
                style={{ marginTop: "20px" }}
                locale={{ emptyText: "No discussions yet." }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{item.first_name?.[0]}</Avatar>}
                      title={<b>{item.first_name + " " + item.last_name}</b>}
                      description={
                        <>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <small style={{ color: "#888" }}>
                            {formatTime(item.created_at)}
                          </small>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />

              {total_pages > 1 && (
                <div style={{ float: "right", marginTop: "20px" }}>
                  <Pagination
                    current={current_page}
                    total={total_comments}
                    pageSize={10}
                    onChange={pagination_on_change}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
