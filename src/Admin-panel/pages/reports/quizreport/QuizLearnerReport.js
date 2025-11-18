
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CulsightPageLoader from '../../../components/CulsightPageLoader';
import { LEARNER_QUIZ_REPORT } from '../../../apis/apis';
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Spin, Table } from 'antd';

function QuizLearnerReport() {
const { learner_id } = useParams();

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [learner, set_learner] = useState('');
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_records, set_total_records] = useState(0);
  const [page_size, set_page_size] = useState(10);

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
       FORM_DATA.append("learner_id", atob(learner_id));
      const API_CALL = await LEARNER_QUIZ_REPORT(FORM_DATA);
     
      if (API_CALL?.data?.status) {
        set_learner(API_CALL?.data?.data?.learner)
        set_table_data(API_CALL?.data?.data?.chapters?.results || []);
        set_current_page(Number(API_CALL?.data?.data?.chapters?.current_page || 1));
        set_total_records(Number(API_CALL?.data?.data?.chapters?.total_pages || 0));
        set_page_size(Number(API_CALL?.data?.data?.chapters?.page_size || 10));
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, [learner_id]);

  // Pagination change
  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
     FORM_DATA.append("page", page);
    FORM_DATA.append("learner_id", atob(learner_id));
    const API_CALL = await LEARNER_QUIZ_REPORT(FORM_DATA);
    
    if (API_CALL?.data?.status) {
      set_learner(API_CALL?.data?.data?.learner)
      set_table_data(API_CALL?.data?.data?.chapters?.results || []);
      set_current_page(Number(API_CALL?.data?.data?.chapters?.current_page || 1));
      set_total_records(Number(API_CALL?.data?.data?.chapters?.total_pages || 0));
      set_page_size(Number(API_CALL?.data?.data?.chapters?.page_size || 10));
    } else {
      console.log("error");
      setLoader(false);
    }
    set_pagination_loader(false);
  };

    const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // round down

    const h = hrs > 0 ? `${String(hrs).padStart(2, "0")}h ` : "";
    const m = mins > 0 ? `${String(mins).padStart(2, "0")}m ` : "";
    const s = `${String(secs).padStart(2, "0")}s`;

    return h + m + s;
  };

  const columns = [
    {
      title: "Chapter Name",
      render: (text, record) => (
        <span>
          {record.chapter_id_title} 
        </span>
      ),
    },
    {
      title: "Attempts",
      render: (text, record) => <span>{record.attempts}</span>,
    },
    {
      title: "Time Spent",
      render: (text, record) => <span>{formatTime(record.time_spend)}</span>,
    },
     {
      title: "Quiz Status",
      render: (text, record) => <span>{record.get_learner_pass_quiz}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <><Button type="link"  onClick={() => navigate(`/report/quiz-report-details/${learner_id}/${btoa(record.chapter_id)}`)}>View Details</Button></>,
    },
  ];
  
  return (
    <>
      {loader ? (
        <CulsightPageLoader />
      ) : pagination_loader ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <>
         <Row>
            <Col span={12}>
              <h2><span style={{ cursor: "pointer" }} onClick={() => window.history.back()}><LeftOutlined /></span><span>{learner?.learner_id__first_name} {learner?.learner_id__last_name} ({learner?.learner_id__email})</span> </h2>
            </Col>
          </Row>
          <Table
            columns={columns}
            pagination={false}
            dataSource={table_data}
            style={{ marginTop: "15px" }}
            rowKey={(record, index) => index}
          />

          {total_records > 0 && (
            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                current={current_page}
                total={total_records}
                pageSize={page_size}
                onChange={pagination_on_change}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default QuizLearnerReport
