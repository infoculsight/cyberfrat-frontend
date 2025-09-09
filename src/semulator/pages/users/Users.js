import { App, Button, Card, Col, Input, message, Modal, Pagination, Popconfirm, Row, Select, Space, Spin, Table, Tag, Upload, } from "antd";
import { Option } from "antd/es/mentions";
import { EyeFilled, LoadingOutlined, UploadOutlined, } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BULK_ADD_USER, LIST_USER, USER_STATUS } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";


function Users() {
  const { notification } = App.useApp();
  //USE STATE FOR PAGINATION AND LOADER
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_users, set_total_users] = useState("");
  const [onchange_call, set_onchange_call] = useState(true);
  const [errors, set_errors] = useState("");

  // fillter state
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');

  const [file, set_file] = useState([]);
  const [is_model_open, set_is_model_open] = useState(false);

  const showModal = () => {
    set_is_model_open(true);
  };


  const handleCancel = () => {
    set_is_model_open(false);
  };

  const beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv';
    if (!isCSV) {
    
      return Upload.LIST_IGNORE;
    }

    set_file([file]);
    message.success(` ${file.name}`);
    return false;
  };




  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append(search_key, search_value);
        const API_CALL = await LIST_USER(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_users(API_CALL?.data?.total_users);
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

    const API_CALL = await LIST_USER(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_users(API_CALL?.data?.total_users);
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
      const response = await USER_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
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
          {record.name}
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
      render: (text, record) => <span>{record.contact_no || "No Data"}</span>,
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
          <Button type="primary" size="small" onClick={() => navigate("/edit-user/" + btoa(record.id))}><EyeFilled /></Button>
          <Popconfirm
            title="Are you sure to Change Status this user?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="red" variant="solid" size="small">Change Status</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await LIST_USER(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_users(API_CALL?.data?.total_users);
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



  const handleBulkUpload = async () => {

    const formData = new FormData();
    formData.append("file", file[0]);

    try {
      const response = await BULK_ADD_USER(formData);
      if (response?.data?.status) {
        const tracking_id = response?.data?.import_tracking_id;
        set_is_model_open(false);
        if (tracking_id) {
        navigate("/imported-users/" +btoa(tracking_id));
        }

      } else {
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };


  return (
    <div className="lms-body">

      <Row>
        <Col span={12}>
          <h2>Users</h2>
        </Col>
        <Col span={12}>
          <div className="user-b-buttons" style={{ float: "right", display: "flex" }}>
            <Button
              color="green"
              variant="solid"
              style={{ marginRight: "5px" }}
              onClick={() => navigate("/add-user")}
            >
              Add User
            </Button>


            <Button type="primary" onClick={showModal} onCancel={handleCancel}>Import Users</Button>

            {/* <Button
              color="danger"
              variant="solid"
              style={{ marginLeft: "5px" }}
            >
              Export Users             </Button> */}
          </div>
        </Col>
      </Row>


      <Card>
        <Row>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder="Search by name"
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
                    total={total_users}
                    pageSize={10}
                  />
                </div>
              </>
            ) : (
              <>

              </>
            )}
          </>
        )}

        <Modal
          title="Import Users"
          open={is_model_open}
          onCancel={handleCancel}
          footer={[
            <Button color="green" variant="solid" onClick={handleBulkUpload} style={{ width: "100%" }}>
              Add
            </Button>,
          ]}
          width={400}
        >
          <div style={{ width: "100%" }}>
            <Upload
              beforeUpload={beforeUpload}
              file={file}
              onRemove={() => set_file([])}
              accept=".csv"
              style={{ width: "100%" }} // optional
            >
              <div style={{ width: "100%" }}>
                <Button icon={<UploadOutlined />} block>
                  Upload File
                </Button>
              </div>
            </Upload>
            {errors?.file ? (
              <>
                <span style={{ color: "red" }}>
                  {errors?.file}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </Modal>

      </Card>
    </div>
  );
}

export default Users;
