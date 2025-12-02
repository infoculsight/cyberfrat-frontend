import { Button, Card, Col, Progress, Row, Table, Grid } from "antd";
import { useEffect, useState } from "react";
import { LEANER_WATCHTIME, LEARNER_DASHBOARD } from "../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../components/CulsightPageLoader";
import "./Dashboard.css";

const { useBreakpoint } = Grid;

function Dashboard() {
  const screens = useBreakpoint(); // AntD hook for responsive
  const navigate = useNavigate();
  const isLg = screens?.lg;
  const [Loading, setLoading] = useState(false);
  const [all_courses, set_all_courses] = useState(0);
  const [complete_courses, set_complete_courses] = useState(0);
  const [in_progress_courses, set_in_progress_courses] = useState(0);
  const [current_course_chapter, set_current_course_chapter] = useState(null);
  const [learner_watch, set_learner_watch] = useState([]);
  const [single_learner_data, set_single_learner_data] = useState({});

  const currentcolumns = [
    {
      title: "Current Course",
      dataIndex: "course",
      render: (_, record) => <span>{record.course_data?.title}</span>,
    },
    {
      title: "Current Chapter",
      dataIndex: "chapter",
      render: (_, record) => <span>{record.chapter_data?.title}</span>,
    },
    {
      title: "Progress",
      dataIndex: "progress",
      render: (_, record) => <span>{record.course_data?.progress}%</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          disabled={!record?.chapter_data?.course_id}
          onClick={() =>
            navigate("/chapters/" + btoa(record.chapter_data?.course_id))
          }
        >
          View
        </Button>
      ),
    },
  ];

  const LIST_API = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    const API_CALL = await LEARNER_DASHBOARD(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_all_courses(API_CALL.data?.all_course || 0);
      set_complete_courses(API_CALL.data?.complete_course || 0);
      set_in_progress_courses(API_CALL?.data?.progress_course || 0);
      set_current_course_chapter(API_CALL?.data?.current_course_chapter);
    }
  };

  const LEANER_WATCHTIME_API = async () => {
    const FORM_DATA = new FormData();
    try {
      const API_CALL = await LEANER_WATCHTIME(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_learner_watch(API_CALL?.data?.learners);
        set_single_learner_data(API_CALL?.data?.single_learner_data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LIST_API();
    LEANER_WATCHTIME_API();
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const h = hrs > 0 ? `${String(hrs).padStart(2, "0")}h ` : "";
    const m = mins > 0 ? `${String(mins).padStart(2, "0")}m ` : "";
    const s = `${String(secs).padStart(2, "0")}s`;
    return h + m + s;
  };

  const columns_leader_board = [
    {
      title: "Rank",
      dataIndex: "rank",
      render: (_, record) => <span>{record.rank}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <span style={{ textTransform: "capitalize" }}>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Time Spent",
      dataIndex: "time",
      render: (_, record) => <span>{formatTime(record.total_max_watched)}</span>,
    },
  ];

  const getPercent = (value) =>
    all_courses > 0 ? (value / all_courses) * 100 : 0;

  return (
    <div className="lms-body">
      {screens.lg ? <>
        <Card className="dashboard-card">
          {Loading ? (
            <CulsightPageLoader />
          ) : (
            <Row gutter={[16, 16]} className="dashboard-row">
              {/* Left Column */}
              <Col xs={24} sm={24} md={24} lg={14}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    {/* Responsive Progress Section */}
                    {screens.lg ? (
                      // Desktop: Circular Progress
                      <Card className="progress-card">
                        <Row gutter={[16, 16]} justify="center">
                          <Col xs={8} sm={8} md={8} className="circle-col">
                            <Progress
                              type="circle"
                              percent={100}
                              format={() => (
                                <span style={{ color: "#1890ff" }}>{all_courses}</span>
                              )}
                              strokeColor="#1890ff"
                            />
                            <h4>All Courses</h4>
                          </Col>
                          <Col xs={8} sm={8} md={8} className="circle-col">
                            <Progress
                              type="circle"
                              percent={getPercent(in_progress_courses)}
                              format={() => (
                                <span style={{ color: "#faad14" }}>
                                  {in_progress_courses}
                                </span>
                              )}
                              strokeColor="#faad14"
                            />
                            <h4>In Progress</h4>
                          </Col>
                          <Col xs={8} sm={8} md={8} className="circle-col">
                            <Progress
                              type="circle"
                              percent={getPercent(complete_courses)}
                              format={() => (
                                <span style={{ color: "#52c41a" }}>
                                  {complete_courses}
                                </span>
                              )}
                              strokeColor="#52c41a"
                            />
                            <h4>Completed</h4>
                          </Col>
                        </Row>
                      </Card>
                    ) : (
                      // Mobile: Box Layout

                      <Row gutter={[16, 16]}>
                        <Col span={8} className="mobile-progress-box">
                          <div className="progress-box all-courses" style={{ textAlign: "center" }}>
                            <h3 style={{ color: "#1890ff" }}>{all_courses}</h3>
                            <p style={{ color: "#1890ff" }}>All Courses</p>
                          </div>

                        </Col>

                        <Col span={8} className="mobile-progress-box">

                          <div className="progress-box in-progress" style={{ textAlign: "center" }}>
                            <h3 style={{ color: "#faad14" }}>{in_progress_courses}</h3>
                            <p style={{ color: "#faad14" }}>In Progress</p>
                          </div>

                        </Col>
                        <Col span={8} className="mobile-progress-box"  >

                          <div className="progress-box completed" style={{ textAlign: "center" }}>
                            <h3 style={{ color: "#52c41a" }}>{complete_courses}</h3>
                            <p style={{ color: "#52c41a" }}>Completed</p>
                          </div>

                        </Col>
                      </Row>

                    )}
                  </Col>

                  {/*  Current Course Section */}
                  <Col span={24}>
                    {screens.lg ? (
                      <Table
                        columns={currentcolumns}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                        rowKey={(record) =>
                          record.chapter_data?.course_id || record.id || Math.random()
                        }
                        dataSource={
                          current_course_chapter ? [current_course_chapter] : []
                        }
                      />
                    ) : (
                      // Mobile: Tile/Card Layout
                      current_course_chapter && (
                        <Row gutter={[16, 16]}>
                          <Col span={24}>
                            <Card className="course-tile">
                              <h4>{current_course_chapter.course_data?.title}</h4>
                              <p>
                                <b>Chapter:</b>{" "}
                                {current_course_chapter.chapter_data?.title}
                              </p>
                              <p>
                                <b>Progress:</b>{" "}
                                {current_course_chapter.course_data?.progress}%
                              </p>
                              <Button
                                type="primary"
                                size="small"
                                style={{ display: "inline-block", float: "right", marginTop: "-45px", marginLeft: "15px" }}
                                disabled={!current_course_chapter?.chapter_data?.course_id}
                                onClick={() =>
                                  navigate(
                                    "/chapters/" +
                                    btoa(current_course_chapter.chapter_data?.course_id)
                                  )
                                }
                              >
                                View
                              </Button>
                            </Card>
                          </Col>
                        </Row>
                      )
                    )}

                    {single_learner_data && (
                      <Card className="rank-card">
                        <h3>Your Rank</h3>
                        <p>
                          Rank: <b>{single_learner_data?.rank}</b>
                        </p>
                        <p>
                          Name:{" "}
                          <b style={{ textTransform: "capitalize" }}>
                            {single_learner_data?.first_name}{" "}
                            {single_learner_data?.last_name}
                          </b>
                        </p>
                        <p>
                          Time Spent:{" "}
                          <b>{formatTime(single_learner_data?.total_max_watched)}</b>
                        </p>
                      </Card>
                    )}
                  </Col>
                </Row>
              </Col>

              {/* Right Column */}
              <Col xs={24} sm={24} md={24} lg={10}>
                {screens.lg ? (
                  <Card>
                    <h3 style={{ marginTop: "-15px" }}>Leaderboard - Top 10 Learners</h3>
                    <Table
                      columns={columns_leader_board}
                      pagination={false}
                      scroll={{ x: "max-content" }}
                      dataSource={learner_watch}
                    />
                  </Card>
                ) : (
                  <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
                    {learner_watch?.map((learner, index) => (
                      <Col span={24} key={learner.id || index}>
                        <Card className="leader-tile">
                          <p><b>Rank:</b> {learner.rank}</p>
                          <p>
                            <b>Name:</b>{" "}
                            <span style={{ textTransform: "capitalize" }}>
                              {learner.first_name} {learner.last_name}
                            </span>
                          </p>
                          <p><b>Time Spent:</b> {formatTime(learner.total_max_watched)}</p>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>




            </Row>
          )}

        </Card>
      </> : <>

        {Loading ? (
          <CulsightPageLoader />
        ) : (
          <Row gutter={[16, 16]} className="dashboard-row">
            {/* Left Column */}
            <Col xs={24} sm={24} md={24} lg={14}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  {/* Responsive Progress Section */}
                  {screens.lg ? (
                    // Desktop: Circular Progress
                    <Card className="progress-card">
                      <Row gutter={[16, 16]} justify="center">
                        <Col xs={8} sm={8} md={8} className="circle-col">
                          <Progress
                            type="circle"
                            percent={100}
                            format={() => (
                              <span style={{ color: "#1890ff" }}>{all_courses}</span>
                            )}
                            strokeColor="#1890ff"
                          />
                          <h4>All Courses</h4>
                        </Col>
                        <Col xs={8} sm={8} md={8} className="circle-col">
                          <Progress
                            type="circle"
                            percent={getPercent(in_progress_courses)}
                            format={() => (
                              <span style={{ color: "#faad14" }}>
                                {in_progress_courses}
                              </span>
                            )}
                            strokeColor="#faad14"
                          />
                          <h4>In Progress</h4>
                        </Col>
                        <Col xs={8} sm={8} md={8} className="circle-col">
                          <Progress
                            type="circle"
                            percent={getPercent(complete_courses)}
                            format={() => (
                              <span style={{ color: "#52c41a" }}>
                                {complete_courses}
                              </span>
                            )}
                            strokeColor="#52c41a"
                          />
                          <h4>Completed</h4>
                        </Col>
                      </Row>
                    </Card>
                  ) : (
                    // Mobile: Box Layout

                    <Row gutter={[16, 16]}>
                      <Col span={8} className="mobile-progress-box">
                        <div className="progress-box all-courses" style={{ textAlign: "center" }}>
                          <h3 style={{ color: "#1890ff" }}>{all_courses}</h3>
                          <p style={{ color: "#1890ff" }}>All Courses</p>
                        </div>

                      </Col>

                      <Col span={8} className="mobile-progress-box">

                        <div className="progress-box in-progress" style={{ textAlign: "center" }}>
                          <h3 style={{ color: "#faad14" }}>{in_progress_courses}</h3>
                          <p style={{ color: "#faad14" }}>In Progress</p>
                        </div>

                      </Col>
                      <Col span={8} className="mobile-progress-box"  >

                        <div className="progress-box completed" style={{ textAlign: "center" }}>
                          <h3 style={{ color: "#52c41a" }}>{complete_courses}</h3>
                          <p style={{ color: "#52c41a" }}>Completed</p>
                        </div>

                      </Col>
                    </Row>

                  )}
                </Col>

                {/*  Current Course Section */}
                <Col span={24}>
                  {screens.lg ? (
                    <Table
                      columns={currentcolumns}
                      pagination={false}
                      scroll={{ x: "max-content" }}
                      rowKey={(record) =>
                        record.chapter_data?.course_id || record.id || Math.random()
                      }
                      dataSource={
                        current_course_chapter ? [current_course_chapter] : []
                      }
                    />
                  ) : (
                    // Mobile: Tile/Card Layout
                    current_course_chapter && (
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Card className="course-tile">
                            <h4>{current_course_chapter.course_data?.title}</h4>
                            <p>
                              <b>Chapter:</b>{" "}
                              {current_course_chapter.chapter_data?.title}
                            </p>
                            <p>
                              <b>Progress:</b>{" "}
                              {current_course_chapter.course_data?.progress}%
                            </p>
                            <Button
                              type="primary"
                              size="small"
                              style={{ display: "inline-block", float: "right", marginTop: "-45px", marginLeft: "15px" }}
                              disabled={!current_course_chapter?.chapter_data?.course_id}
                              onClick={() =>
                                navigate(
                                  "/chapters/" +
                                  btoa(current_course_chapter.chapter_data?.course_id)
                                )
                              }
                            >
                              View
                            </Button>
                          </Card>
                        </Col>
                      </Row>
                    )
                  )}

                  {single_learner_data && (
                    <Card className="rank-card">
                      <h3>Your Rank</h3>
                      <p>
                        Rank: <b>{single_learner_data?.rank}</b>
                      </p>
                      <p>
                        Name:{" "}
                        <b style={{ textTransform: "capitalize" }}>
                          {single_learner_data?.first_name}{" "}
                          {single_learner_data?.last_name}
                        </b>
                      </p>
                      <p>
                        Time Spent:{" "}
                        <b>{formatTime(single_learner_data?.total_max_watched)}</b>
                      </p>
                    </Card>
                  )}
                </Col>
              </Row>
            </Col>


            {/* Right Column */}
            <Col xs={24} sm={24} md={24} lg={10}>
              {screens.lg ? (
                <Card>
                  <h3 style={{ marginTop: "-15px" }}>Leaderboard - Top 10 Learners</h3>
                  <Table
                    columns={columns_leader_board}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    dataSource={learner_watch}
                  />
                </Card>
              ) : (
                <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
                  <Col span={24}>
                    <h2 style={{margin:"0" }}>Leaderboard - Top 10 Learners</h2>
                  </Col>
                  {learner_watch?.map((learner, index) => (
                    <Col span={24} key={learner.id || index} style={{marginTop:"-10px"}}>
                      <Card className="leader-tile">
                        <p><b>Rank:</b> {learner.rank}</p>
                        <p>
                          <b>Name:</b>{" "}
                          <span style={{ textTransform: "capitalize" }}>
                            {learner.first_name} {learner.last_name}
                          </span>
                        </p>
                        <p><b>Time Spent:</b> {formatTime(learner.total_max_watched)}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>

              )}
            </Col>


          </Row>
        )}


      </>}

    </div>
  );
}

export default Dashboard;
