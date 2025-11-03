import { Button, Card, Col, Input, Pagination, Row, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LIST_NOTIFICATION, NOTIFICATION_DROPDOWN } from '../../apis/apis';
import debounce from 'lodash.debounce';
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { EyeFilled } from "@ant-design/icons";

function AdminNotification() {
  const Navigate = useNavigate();
  const [notifications, set_notifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search_query_title, set_search_query_title] = useState("");
  const [current_page, set_current_page] = useState(1);
  const [total_notifications, set_total_notifications] = useState(0);
  const [total_pages, set_total_pages] = useState(1);
  const [available_dropdown, set_available_dropdown] = useState('');
  useEffect(() => {
    const LIST_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      const API_CALL = await LIST_NOTIFICATION(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_notifications(API_CALL.data?.data);
        set_total_notifications(API_CALL.data?.total_notifications);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);

      } else {
        console.log("error");

      }
    };
    
    const NOTIFICATION_DROPDOWN_API = async () => {
      const FORM_DATA = new FormData();
      const API_CALL = await NOTIFICATION_DROPDOWN(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_available_dropdown(API_CALL?.data?.available_dropdown)
        setLoading(false);
      } else {
        console.log("error");
        setLoading(false);
      }
    };


    LIST_API();
    NOTIFICATION_DROPDOWN_API();
  }, []);



  const pagination_on_change = async (data) => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("title", search_query_title);
    const API_CALL = await LIST_NOTIFICATION(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_notifications(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_notifications(API_CALL?.data?.total_notifications);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const fetchResultsTitle = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_title(value);
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("title", value);
        const API_CALL = await LIST_NOTIFICATION(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_notifications(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_notifications(API_CALL?.data?.total_notifications);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    }, 500)();
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };


  const columns = [
    {
      title: "Title",
      render: (text, record) => (
        <span>
          {record.title}
        </span>
      ),
    },
    {
      title: "Notification From",
      render: (text, record) => <span>{record.notification_from}</span>,
    },
    {
      title: "Notification Type",
      render: (text, record) => <span>
        {record.notification_type === 'course_assign' && 'Course Assign'}
        {record.notification_type === 'package_assign' && 'Package Assign'}
        {record.notification_type === 'add_course_in_package' && 'Add Course in Package'}
        {record.notification_type === 'course_update' && 'Course Update'}
        {record.notification_type === 'test_expire' && 'Test Expire'}
        {record.notification_type === 'result_declaration' && 'Result Declaration'}
        {record.notification_type === 'course_completion' && 'Course Completion'}
        {record.notification_type === 'test_submit' && 'Test Submit'}
        {record.notification_type === 'course_expire' && 'Course Expire'}
      </span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => Navigate("/edit-notification/" + btoa(record.id))}><EyeFilled /></Button>

      ),
    },
  ];



  return (
    <div className='lms-body'>
      <Card>
        <h2>Notifications
          {available_dropdown?.length > 0 && <Button
            size="large"
            variant='solid'
            color="green"
            style={{ marginLeft: "10px", float: "right" }}
            onClick={() => Navigate("/add-notification")}
          >
            Add Notification
          </Button>}

        </h2><br></br>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={18} lg={12}>
            <Input
              addonBefore={<span>Title</span>}
              onChange={handleInput}
              placeholder="Search by title"
              size="large"
              style={{ width: "100%" }}
            />
          </Col>

        </Row>


        {loading ? <>
          <CulsightPageLoader />
        </> : <>
          <Table
            columns={columns}
            pagination={false}
            dataSource={notifications}
            style={{ marginTop: "25px" }}
          />


          {total_pages > 0 ? (
            <>
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  current={current_page}
                  total={total_notifications}
                  pageSize={10}
                  onChange={pagination_on_change}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", color: "red" }}>
                <h2>No Notification Found</h2>
              </div>
            </>
          )}
        </>}




      </Card>
    </div>
  )
}

export default AdminNotification
