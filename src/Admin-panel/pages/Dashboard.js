
import {  Card, Col, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { LEANER_WATCHTIME, USER_INFO } from "../apis/apis";
import CulsightPageLoader from "../components/CulsightPageLoader";


function Dashboard() {
  const [loader, setLoader] = useState(false);
  const [user_info, set_user_info] = useState({});
  const [learner_watch, set_learner_watch] = useState([]);
  useEffect(() => {
    const LIST_API = async () => {
      setLoader(true);
      const FORM_DATA = new FormData();
      try {
        const API_CALL = await USER_INFO(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_user_info(API_CALL?.data);
        } else {

        }
      } catch (error) {

      } finally {
      }
    };
    const LEANER_WATCHTIME_API = async () => {
      const FORM_DATA = new FormData();
      try {
        const API_CALL = await LEANER_WATCHTIME(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_learner_watch(API_CALL?.data?.learners);
        } else {

        }
      } catch (error) {

      } finally {
        setLoader(false);
      }
    };


    LIST_API();
    LEANER_WATCHTIME_API()
  }, []);


  const columns = [
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
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // round down

    const h = hrs > 0 ? `${String(hrs).padStart(2, "0")}h ` : "";
    const m = mins > 0 ? `${String(mins).padStart(2, "0")}m ` : "";
    const s = `${String(secs).padStart(2, "0")}s`;

    return h + m + s;
  };


  return (
    <div className="lms-body">
      <Card>
        {loader ? <>
          <CulsightPageLoader />
        </> : <>
          <h2>Dashboard</h2>

          <Row gutter={[10, 10]} style={{ marginBottom: "10px" }}>
            {/* Total Users */}
            <Col lg={8} md={12} sm={24} xs={24}>
              <Card>
                <h3>
                  Total Users{" "}
                  <span style={{ float: "right" }}>
                    <Tag
                      color="processing"
                      style={{ fontSize: "24px", padding: "15px" }}
                    >
                      {user_info?.total_users ?? 0}
                    </Tag>
                  </span>
                </h3>
                <p>Number of users in system</p>
              </Card>
            </Col>

            {/* Active Users */}
            <Col lg={8} md={12} sm={24} xs={24}>
              <Card>
                <h3>
                  Total Active Users{" "}
                  <span style={{ float: "right" }}>
                    <Tag
                      color="success"
                      style={{ fontSize: "24px", padding: "15px" }}
                    >
                      {user_info?.active_users ?? 0}
                    </Tag>
                  </span>
                </h3>
                <p>Number of active users in system</p>
              </Card>
            </Col>

            {/* Inactive Users */}
            <Col lg={8} md={12} sm={24} xs={24}>
              <Card>
                <h3>
                  Total Inactive Users{" "}
                  <span style={{ float: "right" }}>
                    <Tag
                      color="processing"
                      style={{ fontSize: "24px", padding: "15px" }}
                    >
                      {user_info?.inactive_users ?? 0}
                    </Tag>
                  </span>
                </h3>
                <p>Number of inactive users in system</p>
              </Card>
            </Col>

            {/* Bar Chart */}
            <Col xs={24} lg={12}>
              <Card>
                <h2 style={{ marginTop: "-20px" }}>Leaderboard-Top 10 Learners</h2>
                <Table
                  columns={columns}
                  pagination={false}
                  dataSource={learner_watch}
                  style={{ marginTop: "15px" }}
                />
              </Card>
            </Col>


            {/* Pie Chart */}
            <Col xs={24} lg={12}>
              {/* <Button onClick={() => UPDATE_QUIZE_SETTING_DATA()}>UPDATE_QUIZE_SETTING_DATA</Button> */}
            </Col>
          </Row>
        </>}


      </Card>
    </div>
  );
}

export default Dashboard;
