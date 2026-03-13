import { Card, Col, Row, Table } from 'antd'
import { LeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {  VIEW_LEARNER_PACKAGE_REPORT } from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function LearnerPackageReport() {
  const Navigate = useNavigate();
  const { package_id, learner_id } = useParams();
  const [loader, setLoader] = useState(true);
  const [package_name, set_package_name] = useState("")
  const [start_date, set_start_date] = useState("")
  const [package_progress, set_package_progress] = useState("")
  const [time_taken, set_time_taken] = useState("")
  const [learner_row, set_learner_row] = useState("")
  const [table_data, set_table_data] = useState(false)
  const location = useLocation();


  const handleBack = () => {
    if (location.state?.from) {
      Navigate(location.state.from);
    } else {
      Navigate(-1);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "";

    seconds = Math.floor(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = [];
    if (hrs > 0) result.push(`${hrs} hr${hrs > 1 ? "s" : ""}`);
    if (mins > 0) result.push(`${mins} min${mins > 1 ? "s" : ""}`);
    if (secs > 0 || result.length === 0) result.push(`${secs} sec${secs > 1 ? "s" : ""}`);

    return result.join(" ");
  };


  useEffect(() => {
    const LIST_API = async () => {
      setLoader(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(package_id));
      FORM_DATA.append("learner_id", atob(learner_id));

      const API_CALL = await VIEW_LEARNER_PACKAGE_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data.data.courses);
        set_package_name(API_CALL.data.data.package_name)
        set_learner_row(API_CALL.data.data.learner_row)
        set_start_date(API_CALL.data.data.start_date)
        set_package_progress(API_CALL.data.data.package_progress)
        set_time_taken(formatDuration(Number(API_CALL.data.data.time_taken)));

      }
      setLoader(false);

    };


    LIST_API();
  }, [package_id, learner_id]);



  const columns = [
    {
      title: "Name",
      render: (text, record) => (
        <span>
          {record.course_name}
        </span>
      ),
    },
    {
      title: 'Chapter Status',
      dataIndex: 'course_status',
      key: 'chapter_status',
      render: (text, record) => <span>{record.course_status}</span>,
    },
    {
      title: 'Time Spent',
      render: (text, record) => (
        <span>
          {formatDuration(record.time_taken)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      // render: (_, record) => {
      //   const chapter_id = record.id;
      //   const percent = chapterProgress[chapter_id] ?? 0;

      //   return (
      //     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

      //       <Progress
      //         percent={percent}
      //         size="small"
      //         status="active"
      //         style={{ width: "120px" }}
      //       />

      //       <InputNumber
      //         min={0}
      //         max={100}
      //         value={percent}
      //         onChange={(value) => handleProgressChange(chapter_id, value)}
      //         style={{ width: "60px" }}
      //       />

      //       <Popconfirm
      //         title="Do you really want to change chapter progress !"
      //         onConfirm={() => updateProgressAPI(chapter_id)}
      //         okText="Yes"
      //         cancelText="No"
      //       >
      //         <Button
      //           variant='solid'
      //           color='green'
      //           size='small'
      //         >
      //           Update
      //         </Button>

      //       </Popconfirm>

      //     </div>
      //   );
      // },
    },
  ];



  return (
    <div className='lms-body'>
      <Card>

        {loader ? <>
          <CulsightPageLoader />  </> : <>

          <Row>
            <Col span={24}>
              <h2><span style={{ cursor: "pointer" }}
                onClick={handleBack}><LeftOutlined /></span><span style={{ color: "gold" }}>{package_name}</span> - Learner Report </h2>
            </Col>
          </Row>

          <Row gutter={[16, 16]} align="stretch">
            <Col span={12}>
              <Card style={{ textAlign: "left", marginBottom: "10px", height: "100%" }}>
                <h3 style={{ marginBottom: "10px" }}>Learner Details</h3>
                <p>Name: <b>{learner_row?.first_name} {learner_row?.last_name}</b></p>
                <p>Email: <b>{learner_row?.email}</b></p>
                <p>Phone: <b>{learner_row?.phone}</b></p>
                <p>Course: <b>{package_name}</b></p>
              </Card>
            </Col>

            <Col span={12}>
              <Card style={{ textAlign: "left", height: "100%" }}>
                <h3>Start Date</h3><span>{start_date}</span><br />
                <h3 style={{ marginTop: "15px" }}>Time Taken</h3> <span>{time_taken}</span><br />
                {/* <h3 style={{ marginTop: "15px" }}>Package Progress</h3> <span>{package_progress}%</span> */}
              </Card>
            </Col>
          </Row>


          <Row style={{ marginTop: "15px" }}>
            <Col span={24}>
              <Table columns={columns} dataSource={table_data} pagination={false} />
            </Col>
          </Row>

        </>}


      </Card>
    </div>
  )
}

export default LearnerPackageReport
