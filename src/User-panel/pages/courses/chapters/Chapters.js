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
import { CheckCircleFilled, LeftOutlined, RightCircleFilled } from "@ant-design/icons";
import SectionVideos from "./components/sectionmedia/sectionVideos";
import PdfIframeViewer from "../../../components/PdfIframeViewer";
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
  // Single Progress
  const [single_progress, set_single_progress] = useState(0);
  const [description, set_description] = useState("");
  const [comments, set_comments] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_comments, set_total_comments] = useState(0);
  const [total_pages, set_total_pages] = useState(1);
  const [card_loader, set_card_loader] = useState(true);

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

  const fetchCommentList = useCallback(
    async (page = 1, chapter_id) => {

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
    },
    []
  );

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
    fetchCommentList(page, currentChapter.id);
  };


  const handleBack = () => {
    if (location.state?.from) {
      Navigate(location.state.from);
    } else {
      Navigate(-1);
    }
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


  const fetchEnabledChaptersNew = useCallback(async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_id", atob(course_id));
    try {
      setLoading(true);
      const API_CALL = await LIST_ENABLED_CHAPTER(FORM_DATA);
      if (API_CALL?.data?.status) {
        const data = API_CALL.data?.data || [];
        setEnabledChapters(data);

        if (data.length > 0) {
          set_last_chapter(data[data.length - 1].id);
          // अगर backend ने current chapter दिया है
          if (data[0].current_chapter_data) {
            const chapter = data.find(
              (item) =>
                item.id === data[0].current_chapter_data.chapter_id
            );
            if (chapter) {
              setCurrentChapter(chapter);
              set_single_progress(parseInt(chapter.progress) || 0);
              await UPDATE_CURRENT_CHAPTER_API(chapter.id, atob(course_id));
            }
          } else {
            setCurrentChapter(data[0]);
            set_single_progress(data[0].progress || 0);
            await UPDATE_CURRENT_CHAPTER_API(data[0].id, atob(course_id));
          }
        } else {
          setCurrentChapter(null);
        }
      } else {
        setEnabledChapters([]);
        setCurrentChapter(null);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  }, [course_id]);

  const UPDATE_CURRENT_CHAPTER_API = async (chapter_id, courseId) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_id", courseId);
    FORM_DATA.append("chapter_id", chapter_id);
    const res = await UPDATE_CURRENT_CHAPTER(FORM_DATA);
    return res?.data?.status || false;
  };


  const fetchEnabledChapters = useCallback(async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("course_id", atob(course_id));
    try {
      setLoading(true);
      const API_CALL = await LIST_ENABLED_CHAPTER(FORM_DATA);
      if (API_CALL?.data?.status) {
        const data = API_CALL.data?.data || [];
        setEnabledChapters(data);

        if (data.length > 0) {
          set_last_chapter(data[data.length - 1].id);
          // अगर backend ने current chapter दिया है
          if (data[0].current_chapter_data) {
            const chapter = data.find(
              (item) =>
                item.id === data[0].current_chapter_data.chapter_id
            );
            if (chapter) {
              setCurrentChapter(chapter);
              set_single_progress(parseInt(chapter.progress) || 0);
              await UPDATE_CURRENT_CHAPTER_API(chapter.id, atob(course_id));
            }
          } else {
            setCurrentChapter(data[0]);
            set_single_progress(data[0].progress || 0);
            await UPDATE_CURRENT_CHAPTER_API(data[0].id, atob(course_id));
          }
        } else {
          setCurrentChapter(null);
        }
      } else {
        setEnabledChapters([]);
        setCurrentChapter(null);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  }, [course_id]);

  useEffect(() => {
    fetchEnabledChapters();
    const local_theme = localStorage.getItem("dark_theme");
    parseInt(local_theme) === 0
      ? set_balck_theme(false)
      : set_balck_theme(true);
  }, [fetchEnabledChapters]);

  const handleChapterClick = async (chapter, index) => {
    // if (index !== 0 && !chapter.get_tracking_chapter_data) {
    //   message.warning("Please complete previous chapter first");
    //   return;
    // }

    const success = await UPDATE_CURRENT_CHAPTER_API(
      chapter.id,
      atob(course_id)
    );
    if (success) {
      fetchEnabledChaptersNew()
    }
  };

  const handleNext = async () => {
    if (!currentChapter) return;

    const currentIndex = enabledChapters.findIndex(
      (c) => c.id === currentChapter.id
    );

    if (currentChapter.id === last_chapter) {
      // last chapter → first chapter पर redirect
      const firstChapter = enabledChapters[0];
      const success = await UPDATE_CURRENT_CHAPTER_API(
        firstChapter.id,
        atob(course_id)
      );
      if (success) {
        fetchEnabledChaptersNew()
      }
    } else {
      // next chapter
      const nextChapter = enabledChapters[currentIndex + 1];
      const success = await UPDATE_CURRENT_CHAPTER_API(
        nextChapter.id,
        atob(course_id)
      );
      if (success) {
        fetchEnabledChaptersNew()
      }
    }
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
          <Col span={21}>
            <h2>
              <LeftOutlined onClick={handleBack} />{" "}
              <span>Chapters</span>
            </h2>
          </Col>
          <Col span={3}>
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


            <Col xs={24} sm={24} md={24} lg={5}>
              <div
                id="scrollableDiv"
                style={{
                  height: "70vh",
                  overflow: "auto",
                  padding: "0 8px",
                  borderRadius: "8px",
                  color: balck_theme ? "#fff" : "#000",
                  scrollbarColor: balck_theme ? "#555 #1f1f1f" : "#ccc #fafafa",
                }}
              >
                <InfiniteScroll
                  dataLength={enabledChapters?.length || 0}
                  hasMore={false}
                  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                  scrollableTarget="scrollableDiv"

                >
                  <List
                    header={<div>Chapter List</div>}
                    bordered
                    itemLayout="horizontal"
                    dataSource={enabledChapters}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id}
                        style={
                          currentChapter?.id === item?.id
                            ? {
                              cursor: "pointer",
                              backgroundColor: balck_theme
                                ? "rgb(46 46 46)"
                                : "rgb(208 208 208)",
                              padding: "12px",
                            }
                            : {
                              padding: "12px",
                              cursor: "pointer",
                              opacity:
                                index === 0 || item.get_tracking_chapter_data ? 1 : 0.5,
                            }
                        }
                        onClick={() => handleChapterClick(item, index)}
                      >
                        <List.Item.Meta
                          description={
                            <div>
                              <h5
                                style={{
                                  color: "#FFD700",
                                  marginBottom: 0,
                                }}
                              >

                                {item.title}
                              </h5>
                              <div style={{position:"relative"}}>
                              {item?.video_id ? (
                                <>
                                  {currentChapter?.id === item?.id ? (
                                    <>
                                      {single_progress >= 90 ? <><CheckCircleFilled  className="check-pro"  /> </> : ""}
                                      <Progress
                                        percent={single_progress}
                                        status="active"
                                        strokeColor="#FFD700"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {item?.progress >= 90 ? <><CheckCircleFilled className="check-pro" /> </> : ""}
                                      <Progress
                                        percent={item?.progress}
                                        status="active"
                                        strokeColor="#FFD700"
                                      />
                                    </>
                                  )}
                                  <span style={{ fontSize: "10px" }}>Video</span>
                                  {item.scorm && (
                                    <span style={{ fontSize: "10px" }}>, PDF</span>
                                  )}
                                  {item.quiz_available && (
                                    <span style={{ fontSize: "10px" }}>, Quiz</span>
                                  )}
                                  {item.test_available && (
                                    <span style={{ fontSize: "10px" }}>, Live Test</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {item.quiz_available && (
                                    <span style={{ fontSize: "10px" }}>Quiz</span>
                                  )}
                                  {item.scorm && (
                                    <span style={{ fontSize: "10px" }}>, PDF</span>
                                  )}
                                  {item.test_available && (
                                    <span style={{ fontSize: "10px" }}>, Live Test</span>
                                  )}
                                </>
                              )}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </Col>

            {/* RIGHT VIEW */}
            <Col xs={24} sm={24} md={24} lg={19}>
              {currentChapter ? (
                <Card>
                  <Row>
                    <Col span={12}>
                      <h3>{currentChapter.title}</h3>
                    </Col>
                    <Col span={12}>
                      <div style={{ float: "right" }}>
                        <Button
                          style={{ marginRight: "5px" }}
                          size="small"
                          variant="solid"
                          color="green"
                          disabled={
                            !(single_progress >= 90 || !currentChapter.video_id)
                          }
                        // onClick={handleNext}
                        >
                          {single_progress >= 90 || !currentChapter.video_id ? <><CheckCircleFilled /> Completed</> : "Uncomplete"}

                        </Button>

                        {currentChapter?.test_available && (
                          <>
                            {currentChapter.expired ? (
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  marginTop: "10px",
                                  marginRight: "5px",
                                }}
                                disabled
                              >
                                Live Test Expired
                              </Button>
                            ) : currentChapter?.test_submitted ? (
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  marginTop: "10px",
                                  marginRight: "5px",
                                }}
                                disabled
                              >
                                Attempted Live Test
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                style={{
                                  backgroundColor: "#ffc107",
                                  color: "#000",
                                  marginRight: "5px",
                                }}
                                size="small"
                                onClick={() =>
                                  openFullscreenWindow(
                                    "/live-test/" +
                                    btoa(currentChapter.id)
                                  )
                                }
                              >
                                Live Test
                              </Button>
                            )}
                          </>
                        )}

                        {single_progress >= 90 || !currentChapter.video_id ? (
                          <>
                            {currentChapter?.quiz_available ||
                              currentChapter?.quiz_submitted ? (
                              currentChapter?.quiz_submitted ? (
                                <Button
                                  type="primary"
                                  size="small"
                                  style={{ marginTop: "10px" }}
                                  disabled
                                >
                                  Attempted Quiz Test
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: "#ffc107",
                                    color: "#000",
                                  }}
                                  size="small"
                                  onClick={() =>
                                    openFullscreenWindow(
                                      "/quiz-test/" +
                                      btoa(currentChapter.id)
                                    )
                                  }
                                >
                                  Quiz Test
                                </Button>
                              )
                            ) : null}
                          </>
                        ) : <></>}
                      </div>
                    </Col>
                  </Row><br></br>

                  <SectionVideos
                    set_next_view={() => { }}
                    chapter_id={btoa(currentChapter.id)}
                    single_progress={single_progress}
                    video_row={currentChapter.video_row}
                    set_single_progress={set_single_progress}
                  />

                  {currentChapter.introduction &&
                    currentChapter.introduction !== "null" && (
                      <FixTruncatedHTMLList
                        html={currentChapter.introduction}
                      />
                    )}

                  {/* 🔹 Comment Section */}
                  <Card style={{ marginTop: "30px" }} loading={card_loader}>
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
                  </Card>

                  {currentChapter.scorm && (
                    <>
                      <br />
                      <PdfIframeViewer pdfUrl={currentChapter.scorm} />
                    </>
                  )}
                </Card>
              ) : (
                <p>No Chapter Selected</p>
              )}
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
}
