import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Row, Col, Input, Pagination, Spin, App } from "antd";
import { useNavigate } from "react-router-dom";
import { COURSE_REPORT, DOWNLOAD_REPORT } from "../../../apis/apis";
import moment from "moment";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { DownloadOutlined, EyeFilled, LoadingOutlined, } from "@ant-design/icons";



const CourseReport = () => {
const { notification } = App.useApp();

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState("");
  const [search_query_title, set_search_query_title] = useState("");
  const [download_button, set_download_button] = useState(true);


  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      const API_CALL = await COURSE_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_courses(API_CALL?.data?.total_courses);
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, []);


const DOWNLOAD_REPORT_ACTION = async (course_id) => {
      const FORM_DATA = new FormData();
       FORM_DATA.append("course_id", course_id);
      
      const API_CALL = await DOWNLOAD_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        notification.success({
                 message: "Successful",
                 description: "Check the Download tab for your report",
               });
      } else {
        console.log("error");
        setLoader(false);
      }
    };

    
    const pagination_on_change = async (data) => {
      set_pagination_loader(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("page", data);
      FORM_DATA.append("name", search_query_title);
      const API_CALL = await COURSE_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_courses(API_CALL?.data?.total_courses);
        set_pagination_loader(false);
      } else {
        set_pagination_loader(false);
      }
    };
  
    const fetchResultsTitle = useCallback((value) => {
      debounce(async () => {
        try {
          set_search_query_title(value);
          set_pagination_loader(true);
          const FORM_DATA = new FormData();
       
          FORM_DATA.append("name", value);
          const API_CALL = await COURSE_REPORT(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_table_data(API_CALL.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_courses(API_CALL?.data?.total_courses);
            set_pagination_loader(false);
          } else {
            set_pagination_loader(false);
          }
        } catch (err) {
          console.error("API Error:", err);
        }
      }, 500)(); // Call debounce immediately
    }, []);
  
    const handleInput = (e) => {
      const value = e.target.value;
      fetchResultsTitle(value);
    };

  const columns = [
    {
      title: "Created On",
      dataIndex: "created_on",
      render: (text, record) => (
        <span>
          {moment(record.created_on).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      render: (text, record) => <span>{record.course_name}</span>,
    },
        {
      title: "Completion Rate",
      render: (text, record) => <span>{record.completion_rate}</span>,
    },
    {
      title: "Total Learners",
      dataIndex: "total_learners",
      render: (text, record) => <span>{record.total_learners}</span>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
      <>
        <Button size="small" variant="solid" color="blue" onClick={() =>
          navigate(`/course-learners/${btoa(record.course_id)}`, {
            state: { title: record.course_name, from: "/report/course-report" },
          })
        }><EyeFilled /></Button>
        {download_button ? <>
        <Button  size="small" style={{marginLeft:"10px"}} variant="solid" color="green" onClick={() =>DOWNLOAD_REPORT_ACTION(record.course_id)}><DownloadOutlined /></Button>
        </> : <>
        <Button style={{marginLeft:"10px"}} size="small" variant="solid" color="green" disabled><DownloadOutlined /></Button>
        </>}
      </>

      ),
    },
  ];


  return (
    <div style={{ padding: 20 }}>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={<span>Name</span>}
            onChange={handleInput}
            placeholder="Search by course name"
            size="large"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

            {loader ? (
          <>
            <CulsightPageLoader />
          </>
        ) : (
          <>
            {pagination_loader ? (
              <>
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
              </>
            ) : (
              <>
                <Table
                  columns={columns}
                  pagination={false}
                  dataSource={table_data}
                  style={{ marginTop: "15px" }}
                />
              </>
            )}

            {total_pages > 0 ? (
              <>
                <div style={{ float: "right", marginTop: "20px" }}>
                  {" "}
                  <Pagination
                    onChange={pagination_on_change}
                    defaultCurrent={current_page}
                    total={total_courses}
                    pageSize={10}
                  />
                </div>
              </>
            ) : (
             ""
            )}
          </>
        )}

    </div>
  );
};

export default CourseReport;
