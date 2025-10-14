import { Avatar, Button, Card, Col, Progress, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { LEANER_WATCHTIME, LEARNER_DASHBOARD } from "../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../components/CulsightPageLoader";

const columns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => <Avatar src={avatar} />,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
];

function Dashboard() {
  const navigate = useNavigate();
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
      render: (_, record) => (
        <span>{record.course_data?.title}</span>
      ),
    },
    {
      title: "Current Chapter",
      dataIndex: "chapter",
      render: (_, record) => (
        <span>{record.chapter_data?.title}</span>
      ),
    },
       {
      title: "Progress",
      dataIndex: "progress",
      render: (_, record) => (
        <span>{record.course_data?.progress}</span>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={!record?.chapter_data?.course_id} // ✅ chapter_data na ho to disable
          onClick={() =>
            navigate("/chapters/" + btoa(record.chapter_data?.course_id))
          }
        >
          View
        </Button>
      ),
    }

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

    } else {
      console.log("error");

    }
  };

  const LEANER_WATCHTIME_API = async () => {
    const FORM_DATA = new FormData();
    try {
      const API_CALL = await LEANER_WATCHTIME(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_learner_watch(API_CALL?.data?.learners);
        set_single_learner_data(API_CALL?.data?.single_learner_data);
      } else {

      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LIST_API();
    LEANER_WATCHTIME_API()
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // round down

    const h = hrs > 0 ? `${String(hrs).padStart(2, "0")}h ` : "";
    const m = mins > 0 ? `${String(mins).padStart(2, "0")}m ` : "";
    const s = `${String(secs).padStart(2, "0")}s`;

    return h + m + s;
  };


  const columns_leader_board = [
    {
      title: "Rank",
      dataIndex: "rank",
      render: (text, record) => (
        <span>
          {record.rank}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Time Spent",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {formatTime(record.total_max_watched)}
        </span>
      ),
    },
  ];

  const getPercent = (value) =>
    all_courses > 0 ? (value / all_courses) * 100 : 0;


  
  return (
    <div className="lms-body">
      <Card>
        {Loading ? (
          <CulsightPageLoader />
        ) : (
          <>
            <Row gutter={[20, 20]}>
              <Col span={14}>
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <Card>

                      <Row className="circle-box">
                        <Col span={8} style={{ textAlign: "center" }}>
                          <Progress
                            type="circle"
                            percent={100}
                            format={() => <span style={{ color: "#1890ff" }}>
                              {all_courses}
                            </span>}
                            strokeColor="#1890ff"
                          />
                          <h3 style={{ marginTop: 10 }}>All Courses</h3>
                        </Col>
                        <Col span={8} style={{ textAlign: "center" }}>
                          <Progress
                            type="circle"
                            percent={getPercent(in_progress_courses)}
                            format={() =>
                              <span style={{ color: "#faad14" }}>
                                {in_progress_courses}
                              </span>
                            }
                            strokeColor="#faad14"

                          />
                          <h3 style={{ marginTop: 10 }}>In Progress</h3>
                        </Col>
                        <Col span={8} style={{ textAlign: "center" }}>
                          <Progress
                            type="circle"
                            percent={getPercent(complete_courses)}
                            format={() =>
                              <span style={{ color: "#52c41a" }}>
                                {complete_courses}
                              </span>
                            }
                            strokeColor="#52c41a"
                          />
                          <h3 style={{ marginTop: 10 }}>Completed</h3>
                        </Col>
                      </Row>

                    </Card>
                    
                  </Col>

                  <Col span={24}>
                    {/* <Table
                      columns={currentcolumns}
                      pagination={false}
                      dataSource={
                        current_course_chapter
                          ? [current_course_chapter]
                          : []
                      }
                    /> */}
                    <Table
                      columns={currentcolumns}
                      pagination={false}
                      rowKey={(record) => record.chapter_data?.course_id || record.id || Math.random()}
                      dataSource={
                        current_course_chapter
                          ? [current_course_chapter]
                          : []
                      }
                    />
                     {single_learner_data && <><br></br>
                 <Card>
                   <h2 style={{ marginTop: "-20px" }}>Your Rank</h2>
                   <p>Rank: <b>{single_learner_data?.rank}</b></p>
                   <p>Name: <b>{single_learner_data?.first_name} {single_learner_data?.last_name}</b></p>
                   <p>Time Spent : <b> {formatTime(single_learner_data?.total_max_watched)}</b></p>
                   </Card>
                  </>}
                
                  </Col>
                </Row>
              </Col>

              <Col span={10}>
                <Card>
                  <h2 style={{ marginTop: "-20px" }}>Leaderboard-Top 10 Learners</h2>
                  <Table
                    columns={columns_leader_board}
                    pagination={false}
                    dataSource={learner_watch}
                    style={{ marginTop: "15px" }}
                  />
                 
                 
                  
                </Card>
              </Col>
             

            </Row>
          </>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
