import { App, Button, Card, Col, Input, InputNumber, message, Modal, Progress, Row, Table } from 'antd'
import { LeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { UPDATE_CHAPTER_PROGRESS, VIEW_LEARNER_REPORT } from '../../../apis/apis';
import CulsightPageLoader from '../../../components/CulsightPageLoader';

function LearnerReport() {
  const Navigate = useNavigate();
  const { notification } = App.useApp();
  const { course_id, learner_id } = useParams();
  const [loader, setLoader] = useState(true);
  const [course_name, set_course_name] = useState("")
  const [start_date, set_start_date] = useState("")
  const [course_progress, set_course_progress] = useState("")
  const [time_taken, set_time_taken] = useState("")
  const [learner_row, set_learner_row] = useState("")
  const [table_data, set_table_data] = useState(false)
  const location = useLocation();
  const [chapterProgress, setChapterProgress] = useState({});
  const [admin_message, set_admin_message] = useState("");
  const [errors, set_errors] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);


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
      FORM_DATA.append("course_id", atob(course_id));
      FORM_DATA.append("learner_id", atob(learner_id));

      const API_CALL = await VIEW_LEARNER_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        const chapters = API_CALL.data.data.chapters;

        set_table_data(API_CALL.data.data.chapters);

        const progressObj = {};
        chapters.forEach(ch => {
          progressObj[ch.id] = ch.time_spend || 0;
        });
        setChapterProgress(progressObj);

        set_course_name(API_CALL.data.data.course_name)
        set_learner_row(API_CALL.data.data.learner_row)
        set_start_date(API_CALL.data.data.start_date)
        set_course_progress(API_CALL.data.data.course_progress)
        set_time_taken(formatDuration(Number(API_CALL.data.data.time_taken)));

      }
      setLoader(false);

    };


    LIST_API();
  }, [course_id, learner_id]);



  const columns = [
    {
      title: "Name",
      render: (text, record) => (
        <span>
          {record.name}
        </span>
      ),
    },
    {
      title: 'Chapter Status',
      dataIndex: 'chapter_status',
      key: 'chapter_status',
      render: (text, record) => <span>{record.chapter_status}</span>,
    },
    {
      title: 'Total Duration',
      render: (text, record) => (
        <span>
          {formatDuration(record.total_seconds)}
        </span>
      ),
    },
    {
      title: 'Time Spent',
      render: (text, record) => (
        <span>
          {formatDuration(record.time_spend)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {

        const chapter_id = record.id;
        const row_id = record.row_id;

        const watched_seconds = chapterProgress[chapter_id] ?? 0;
        const total_seconds = record.total_seconds ?? 0;

        const percent =
          total_seconds > 0
            ? Math.round((watched_seconds / total_seconds) * 100)
            : 0;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {
              row_id > 0 ? <>  <Progress
                percent={percent}
                size="small"
                status="active"
                style={{ width: "120px" }}
              />

                <InputNumber
                  min={0}
                  max={total_seconds}
                  value={watched_seconds}
                  parser={(value) => Number(value)}
                  onChange={(value) => handleProgressChange(chapter_id, value)}
                  style={{ width: "90px" }}
                />
              </> : <>
                <Progress
                  percent={percent}
                  size="small"
                  status="active"
                  style={{ width: "120px" }}
                  disabled
                />

                <InputNumber
                  min={0}
                  max={total_seconds}
                  value={watched_seconds}
                  parser={(value) => Number(value)}
                  onChange={(value) => handleProgressChange(chapter_id, value)}
                  style={{ width: "90px" }}
                  disabled
                />
              </>
            }



            {row_id > 0 ? <>
              <Button
                variant="solid"
                color="green"
                size="small"
                disabled={row_id <= 0}
                onClick={() => {
                  setSelectedChapter(chapter_id);
                  setSelectedRowId(row_id);
                  setIsModalOpen(true);
                }}
              >
                Update
              </Button>

            </> : <>
              <Button
                variant="solid"
                color="green"
                size="small"
                disabled
                title='The user has not started the chapter yet.'>
                Update
              </Button>
            </>}


          </div>
        );
      },
    }
  ];



  const updateProgressAPI = async (chapter_id, row_id) => {
    setLoader(true);
    const form = new FormData();
    // form.append("learner_id", atob(learner_id));
    // form.append("chapter_id", chapter_id);
    form.append("id", row_id);
    form.append("message", admin_message);
    form.append("watched_seconds", chapterProgress[chapter_id]);
    const response = await UPDATE_CHAPTER_PROGRESS(form);
    if (response?.data?.status) {
      notification.success({
        message: "Successful",
        description: response?.data?.message,
      });
      setLoader(false);
      setIsModalOpen(false);
      set_admin_message("");
      set_errors("");

    } else {
      setLoader(false);
      set_errors(response?.data?.errors);
      message.error("Failed to update");
    }
  };

  const handleProgressChange = (chapter_id, value) => {
    const chapter = table_data.find(ch => ch.id === chapter_id);

    const totalSeconds = Number(chapter?.total_seconds) || 0;
    const numericValue = Number(value);

    const safeValue = !isNaN(numericValue)
      ? Math.min(numericValue, totalSeconds)
      : 0;

    setChapterProgress(prev => ({
      ...prev,
      [chapter_id]: safeValue
    }));
  };


  return (
    <div className='lms-body'>
      <Card>

        {loader ? <>
          <CulsightPageLoader />  </> : <>

          <Row>
            <Col span={24}>
              <h2><span style={{ cursor: "pointer" }}
                onClick={handleBack}><LeftOutlined /></span><span style={{ color: "gold" }}>{course_name}</span> - Learner Report </h2>
            </Col>
          </Row>

          <Row gutter={[16, 16]} align="stretch">
            <Col span={12}>
              <Card style={{ textAlign: "left", marginBottom: "10px", height: "100%" }}>
                <h3 style={{ marginBottom: "10px" }}>Learner Details</h3>
                <p>Name: <b>{learner_row?.first_name} {learner_row?.last_name}</b></p>
                <p>Email: <b>{learner_row?.email}</b></p>
                <p>Phone: <b>{learner_row?.phone}</b></p>
                <p>Course: <b>{course_name}</b></p>
              </Card>
            </Col>

            <Col span={12}>
              <Card style={{ textAlign: "left", height: "100%" }}>
                <h3>Start Date</h3><span>{start_date}</span><br />
                <h3 style={{ marginTop: "15px" }}>Time Taken</h3> <span>{time_taken}</span><br />
                <h3 style={{ marginTop: "15px" }}>Course Progress</h3> <span>{course_progress}%</span>
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

      <Modal
        title="Update Chapter Progress"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          set_admin_message("");
        }}
        onOk={() => {
          updateProgressAPI(selectedChapter, selectedRowId);
        }}
        okText="Submit"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter admin message..."
          value={admin_message}
          onChange={(e) => set_admin_message(e.target.value)}
        />{errors?.message ? (
          <>
            <span style={{ color: "red" }}>
              {errors?.message}
            </span>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

export default LearnerReport
