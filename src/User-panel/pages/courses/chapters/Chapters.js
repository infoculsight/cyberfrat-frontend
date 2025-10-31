import { Card, Col, Row, Button, List, Progress, App, Skeleton, Avatar, Pagination } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ADD_COMMENT,
  LIST_COMMENT,
  LIST_ENABLED_CHAPTER,
  UPDATE_CURRENT_CHAPTER,
} from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { FixTruncatedHTMLList } from "../../../components/TruncatedHTML";
import { CheckCircleFilled, DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import SectionVideos from "./components/sectionmedia/sectionVideos";
import CustomRichTextEditor from "../../../components/CustomTextEditor";

export default function Chapters() {
  const { message } = App.useApp();
  const Navigate = useNavigate();
  const location = useLocation();
  const { course_id } = useParams();
  const { notification } = App.useApp();

  const [enabledChapters, setEnabledChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [balck_theme, set_balck_theme] = useState(true);
  const [full_screen, set_full_screen] = useState(false);
  const [last_chapter, set_last_chapter] = useState(0);
  const [single_progress, set_single_progress] = useState(0);
  const [description, set_description] = useState("");
  const [comments, set_comments] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_comments, set_total_comments] = useState(0);
  const [total_pages, set_total_pages] = useState(1);
  const [card_loader, set_card_loader] = useState(true);
  const [course_watch_percent, set_course_watch_percent] = useState(0);
  const [course_status, set_course_status] = useState('');

  // ✅ Helper to detect quiz keyword in title
  function hasQuiz(title) {
    return /\bquiz\b/i.test(title);
  }

  // 🔹 Format time (IST) + Relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
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
    const istDate = new Date(createdTimeUTC.getTime() + 5.5 * 60 * 60 * 1000);
    return istDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  // 🔹 Fetch comments
  const fetchCommentList = useCallback(async (page = 1, chapter_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("view_id", chapter_id);
    FORM_DATA.append("page", page);
    FORM_DATA.append("comment_type", "chapter");
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
  }, []);

  useEffect(() => {
    if (currentChapter?.id) {
      fetchCommentList(1, currentChapter.id);
    }
  }, [currentChapter, fetchCommentList]);

  // 🔹 Add new comment
  const onFinish = async () => {
    if (!description.trim()) {
      message.warning("Please write a comment first.");
      return;
    }
    set_card_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("view_id", currentChapter?.id);
    FORM_DATA.append("description", description);
    FORM_DATA.append("comment_type", "chapter");
    try {
      const response = await ADD_COMMENT(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Success",
          description: response?.data?.message,
        });
        set_description("");
        fetchCommentList(1, currentChapter?.id);
      } else {
        message.error(response?.data?.message || "Failed to add comment");
      }
    } catch (error) {
      message.error("Server Error: " + (error?.response?.data?.message || "Unknown error"));
    } finally {
      set_card_loader(false);
    }
  };

  const pagination_on_change = (page) => {
    set_card_loader(true);
    set_current_page(page);
    fetchCommentList(page, currentChapter.id);
  };

  const handleBack = () => {
    if (location.state?.from) Navigate(location.state.from);
    else Navigate(-1);
  };

  const openFullscreenWindow = (url) => {
    if (typeof window !== "undefined") {
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      const windowFeatures = `width=${width},height=${height},top=0,left=0,resizable=yes,scrollbars=yes`;
      const newWindow = window.open(url, "_blank", windowFeatures);
      if (newWindow) newWindow.focus();
    }
  };

  const UPDATE_CURRENT_CHAPTER_API = async (chapter_id, courseId) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_id", courseId);
    FORM_DATA.append("chapter_id", chapter_id);
    const res = await UPDATE_CURRENT_CHAPTER(FORM_DATA);
    return res?.data?.status || false;
  };

  // ✅ Fetch enabled chapters
  const fetchEnabledChapters = useCallback(async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_id", atob(course_id));
    try {
      setLoading(true);
      const API_CALL = await LIST_ENABLED_CHAPTER(FORM_DATA);
      if (API_CALL?.data?.status) {
        let data = API_CALL.data?.data || [];
        set_course_watch_percent(API_CALL.data?.course_watch_percent);
        console.log('sdsds', API_CALL.data?.course_status)
        set_course_status(API_CALL.data?.course_status)
        const normal = data.filter((ch) => !hasQuiz(ch.title));
        const quiz = data.filter((ch) => hasQuiz(ch.title));
        data = [...normal, ...quiz];
        setEnabledChapters(data);
        if (data.length > 0) {
          set_last_chapter(data[data.length - 1].id);
          const chapter =
            data.find((i) => i.id === data[0]?.current_chapter_data?.chapter_id) || data[0];
          setCurrentChapter(chapter);
          set_single_progress(parseInt(chapter.progress) || 0);
          await UPDATE_CURRENT_CHAPTER_API(chapter.id, atob(course_id));
        }
      } else {
        setEnabledChapters([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [course_id]);

  useEffect(() => {
    fetchEnabledChapters();
    const local_theme = localStorage.getItem("dark_theme");
    parseInt(local_theme) === 0 ? set_balck_theme(false) : set_balck_theme(true);
  }, [fetchEnabledChapters]);

  const handleChapterClick = async (chapter, index) => {
    if (hasQuiz(chapter.title) && course_watch_percent < 90) {
      message.warning("Please complete at least 90% of the course before attempting the quiz.");
      return;
    }
    const success = await UPDATE_CURRENT_CHAPTER_API(chapter.id, atob(course_id));
    if (success) fetchEnabledChapters();
  };
  const handleDownload = () => {
    const url = course_status;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${course_status}_Certificate.pdf`;
    link.click();
  };

  return (
    <div
      className="lms-body"
      style={
        full_screen
          ? {
            position: "fixed",
            width: "100%",
            height: "100%",
            zIndex: 1000,
            left: 0,
            top: 0,
            backgroundColor: balck_theme ? "rgb(46 46 46)" : "#fff",
            margin: 0,
            padding: 0,
            overflow: "auto",
          }
          : {}
      }
    >
      <Card>
        <Row>
          <Col span={14}>
            <h2>
              <LeftOutlined onClick={handleBack} /> Chapters
            </h2>
          </Col>
          <Col span={10}>
            <div style={{ float: "right", marginLeft: "15px" }}>
              {course_status ? <Button
                type="primary"
                size="small"
                disabled={false}
                onClick={handleDownload}
              >

                Certificate <DownloadOutlined />
              </Button> : <Button
                variant="solid"
                size="small"
                color="green"
                disabled={true}
              >

                Certificate <DownloadOutlined />
              </Button>}

            </div>

            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={() => set_full_screen(!full_screen)}
              size="small"
            >
              {full_screen ? "Normal View" : "Full Screen"}
            </Button>
          </Col>
        </Row>

        {loading ? (
          <CulsightPageLoader />
        ) : (
          <Row gutter={10}>
            {/* ✅ LEFT PANEL */}
            <Col xs={24} sm={24} md={24} lg={5}>
              <List
                header={<div>Chapter List</div>}
                bordered
                itemLayout="horizontal"
                dataSource={enabledChapters}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    style={{
                      padding: "12px",
                      cursor:
                        hasQuiz(item.title) && course_watch_percent < 90
                          ? "not-allowed"
                          : "pointer",
                      backgroundColor:
                        currentChapter?.id === item?.id
                          ? balck_theme
                            ? "rgb(46 46 46)"
                            : "rgb(243 242 242)"
                          : "transparent",
                      opacity:
                        hasQuiz(item.title) && course_watch_percent < 90
                          ? 0.4
                          : index === 0 || item.get_tracking_chapter_data
                            ? 1
                            : 0.5,
                    }}
                    onClick={() => handleChapterClick(item, index)}
                  >
                    <List.Item.Meta
                      description={
                        <div>
                          <h5 style={{ color: "#FFD700", marginBottom: 0 }}>
                            {item.title}
                          </h5>
                          <div style={{ position: "relative" }}>
                            {currentChapter?.id === item?.id ? (
                              <>
                                {item?.title?.toLowerCase().includes("quiz") ? <>
                                  {!course_status ? <>
                                    <Progress
                                      percent={0}
                                      status="active"
                                      strokeColor="#FFD700"
                                    />

                                  </> : <>
                                    <CheckCircleFilled className="check-pro" />
                                    <Progress
                                      percent={100}
                                      status="active"
                                      strokeColor="#FFD700"
                                    />
                                  </>}
                                </> : <>
                                  {single_progress >= 90 && (
                                    <CheckCircleFilled className="check-pro" />
                                  )}
                                  <Progress
                                    percent={single_progress}
                                    status="active"
                                    strokeColor="#FFD700"
                                  />
                                </>}




                              </>
                            ) : (
                              <>
                                {item.get_tracking_chapter_data ? <>
                                  {item?.video_id ? <>
                                    {item.progress >= 90 && (
                                      <CheckCircleFilled className="check-pro" />
                                    )}
                                    <Progress
                                      percent={item?.progress}
                                      status="active"
                                      strokeColor="#FFD700"
                                    />
                                  </> : <>

                                    {item?.title?.toLowerCase().includes("quiz") ? <>
                                      {!course_status ? <>
                                        <Progress
                                          percent={0}
                                          status="active"
                                          strokeColor="#FFD700"
                                        />

                                      </> : <>
                                        <CheckCircleFilled className="check-pro" />
                                        <Progress
                                          percent={100}
                                          status="active"
                                          strokeColor="#FFD700"
                                        />
                                      </>}
                                    </> : <>
                                      <CheckCircleFilled className="check-pro" />
                                      <Progress
                                        percent={100}
                                        status="active"
                                        strokeColor="#FFD700"
                                      />
                                    </>}

                                  </>}


                                </> : <>

                                  <Progress
                                    percent={0}
                                    status="active"
                                    strokeColor="#FFD700"
                                  />

                                </>}
                              </>
                            )}
                            <span style={{ fontSize: "10px" }}>
                              {item.video_id && "Video"}
                              {item.scorm && " PDF"}
                              {item.quiz_available && " Quiz"}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>

            {/* ✅ RIGHT PANEL */}
            <Col xs={24} sm={24} md={24} lg={19}>
              {currentChapter ? (
                <Card>
                  <Row>
                    <Col span={12}>
                      <h3 style={{ fontSize: "24px" }}>{currentChapter.title}</h3>
                    </Col>
                    <Col span={12}>
                      <div style={{ float: "right" }}>
                        {/* ✅ Completion Tag */}
                        {!currentChapter?.quiz_row && <>
                          <Button
                            size="small"
                            disabled={!(single_progress >= 90 || !currentChapter.video_id)}
                          >

                            {single_progress >= 90 || !currentChapter.video_id ? (
                              <>
                                <CheckCircleFilled /> Completed
                              </>
                            ) : (
                              "Incomplete"
                            )}
                          </Button>
                        </>}



                        {/* ✅ Quiz Buttons (All Conditions Preserved) */}
                        {(single_progress >= 90 || !currentChapter.video_id) && (
                          <>
                            {currentChapter?.quiz_available && (
                              currentChapter?.quiz_submitted ? (
                                <Button disabled size="small" style={{ marginLeft: 5 }}>
                                  Attempted Quiz Test
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: "#ffc107",
                                    color: "#000",
                                    marginLeft: 5,
                                  }}
                                  size="small"
                                  onClick={() =>
                                    openFullscreenWindow("/quiz-test/" + btoa(currentChapter.id))
                                  }
                                >
                                  Quiz Test
                                </Button>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <br />
                  {currentChapter?.quiz_row && currentChapter?.title?.toLowerCase().includes("quiz") ? <>
                    {currentChapter?.quiz_row?.time_limit > 0 ? (
                      <div
                        className="section-details section-details-right-padding"
                        style={{ minHeight: "auto" }}
                      >
                        <Row>
                          <Col span={12}>

                            <p>
                              <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                                Time Limit :-{" "}
                              </span>
                              {currentChapter?.quiz_row?.time_limit} min
                              <br />
                              <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                                Passing percentage :-{" "}
                              </span>
                              {currentChapter?.quiz_row?.passing_percentage}%  <br />

                            </p>
                          </Col>

                          <Col span={12}>
                            <div style={{ float: "right" }}>


                              <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                                Number of retake :-{" "}
                              </span>
                              {currentChapter?.quiz_row?.no_of_retake} <br />

                              <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                                Number of questions :-{" "}
                              </span>
                              {currentChapter?.quiz_row?.display_question}
                              <br />


                            </div>
                          </Col>
                          <p style={{ textAlign: "center", margin: "30px" }}>You can attempt this test a maximum of {currentChapter?.quiz_row?.number_of_retake} times. Currently, you are on your <b>{currentChapter?.quiz_row?.current_attempt} attempt</b>. The time limit for the test is {currentChapter?.quiz_row?.time_limit} minutes, and you must score at least {currentChapter?.quiz_row?.passing_percentage}% to pass. Once you pass, the test will be automatically submitted, and no further attempts will be required.</p>
                        </Row>


                      </div>
                    ) : (
                      <h3
                        style={{
                          padding: "50px",
                          textAlign: "center",
                          color: "red",
                          fontSize: "42px",
                        }}
                      >
                        Data Empty

                      </h3>
                    )}















                  </> : <>
                    <SectionVideos
                      set_next_view={() => { }}
                      chapter_id={btoa(currentChapter.id)}
                      single_progress={single_progress}
                      video_row={currentChapter.video_row}
                      set_single_progress={set_single_progress}
                    />

                    {currentChapter.introduction &&
                      currentChapter.introduction !== "null" && (
                        <FixTruncatedHTMLList html={currentChapter.introduction} />
                      )}

                    {/* ✅ Comments Section */}
                    <div style={{ marginTop: "30px" }}>
                      <CustomRichTextEditor
                        editorLabel="Course Discussions"
                        value={description}
                        onChange={(val) => set_description(val)}
                        placeholder="Write something..."
                      />
                      <Button
                        type="primary"
                        style={{ marginTop: "-20px", marginBottom: "20px" }}
                        onClick={onFinish}
                      >
                        Add Comment
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
                    </div>
                  </>}

                </Card>
              ) : (
                <p>No chapters found.</p>
              )}
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
}
