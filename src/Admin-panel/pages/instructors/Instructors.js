import { App, Button, Card, Col, Input, message, Pagination, Row, Select, Space, Spin, Table, Tag, } from "antd";
import { Option } from "antd/es/mentions";
import { EyeFilled, LoadingOutlined, } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { INSTRUCTOR_LIST, LEARNER_STATUS } from "../../apis/apis";
import moment from "moment";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function Instructors(props) {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState('');
  const [total_pages, set_total_pages] = useState('');
  const [total_instructors, set_total_instructors] = useState('');
  const [onchange_call, set_onchange_call] = useState(true);

  // fillter state
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');



  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("token", localStorage.getItem("token"));
        FORM_DATA.append(search_key, search_value);
        const API_CALL = await INSTRUCTOR_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_instructors(API_CALL?.data?.total_instructors);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        set_pagination_loader(false);
      }
    }, 500)(); // Call debounce immediately
  }, []);


  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("token", localStorage.getItem("token"));
    const API_CALL = await INSTRUCTOR_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_instructors(API_CALL?.data?.total_instructors);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, [onchange_call]);


  const change_status = async (id) => {
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await LEARNER_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: "Learner status succefully Changed",
        });
        set_onchange_call(onchange_call ? false : true)

      } else {
        // setLoader(false);

      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  const selectBefore = (
    <Select defaultValue="Name" onChange={(value) => {
      if (value === 'Name') {
        set_search_query_key('name')
        fetchResults('name', search_query_value)
      }
      if (value === 'Email') {
        set_search_query_key('email')
        fetchResults('email', search_query_value)
      }
      if (value === 'Phone') {
        set_search_query_key('contact_no')
        fetchResults('contact_no', search_query_value)
      }
    }}>
      <Option value="Name">Name</Option>
      <Option value="Email">Email</Option>
      <Option value="Phone">Phone</Option>
    </Select>
  );

  const columns = [
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
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: "Phone",
      dataIndex: "contact_no",
      render: (text, record) => <span>{record.contact_no}</span>,
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      render: (text, record) => (
        <div>
          {record.last_login ? <>
            <div>{moment(record.last_login).format("YYYY-MM-DD")}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {moment(record.last_login).format("hh:mm A")}
            </div>
          </> : <><small style={{ color: "#5bede7" }}>Not login yet</small></>}

        </div>
      ),
    },
    {
      title: "Joined On",
      key: "joining_on",
      render: (text, record) => (
        <div>
          <div>{moment(record.joining_on).format("YYYY-MM-DD")}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {moment(record.joining_on).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <span>
          {record.status ? (
            <>
              <Tag color="success">Active</Tag>
            </>
          ) : (
            <>
              <Tag color="error">Inactive</Tag>
            </>
          )}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => navigate("/edit-learner/" + btoa(record.id))}><EyeFilled /></Button>
          <Button variant="solid" color="danger" onClick={() => change_status(record?.id)} size="small"> Change Status</Button>

        </Space>
      ),
    },
  ];

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("token", localStorage.getItem("token"));
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await INSTRUCTOR_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_instructors(API_CALL?.data?.total_instructors);
      set_pagination_loader(false);
    } else {
      set_pagination_loader(false);
    }
  }
  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value)
    if (search_query_key === 'name') {
      fetchResults('name', value)
    }
    if (search_query_key === 'email') {
      fetchResults('email', value)
    }
    if (search_query_key === 'contact_no') {
      fetchResults('contact_no', value)
    }
  };

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2>Instructors</h2>
          </Col>
          <Col span={12}>
            <div className="learner-buttons" style={{ float: "right" }}>
              <Button
                color="green"
                variant="solid"
                style={{ marginRight: "10px" }}
                onClick={() => navigate("/add-instructor")}
              >
                Add Instructor
              </Button>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={() => navigate("/import-learner")}
              >
                Import Instructor
              </Button>
              <Button
                color="danger"
                variant="solid"
                style={{ marginRight: "3px" }}
              >
                Export Instructor
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder={'Search by name'}
              onChange={handleInput}
              size="large"
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
                    total={total_instructors}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "red" }}>
                  <h2>No Instructor Found</h2>
                </div>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default Instructors;
