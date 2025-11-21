import { App, Button, Card, Col, Input, message, Modal, Upload, Pagination, Row, Select, Space, Spin, Table, Tag, Popconfirm, Tooltip, Form } from "antd";
import { EyeFilled, LoadingOutlined, UploadOutlined, BookOutlined, LockOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BULD_ADD_LEARNERS, CHANGE_LEARNER_PASSWORD, LEARNER_LIST, LEARNER_STATUS } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { formatToIST } from "../../../helper/CommonHelper";


function Learners() {
  const { notification } = App.useApp();
  const { page } = useParams();


  //USE STATE FOR PAGINATION AND LOADER
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_learners, set_total_learners] = useState("");
  const [onchange_call, set_onchange_call] = useState(true);
  const [errors, set_errors] = useState("");
  // fillter state
  const [placeholder, set_placeholder] = useState("Search by name");
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');
  const [file, set_file] = useState([]);
  const [is_model_open, set_is_model_open] = useState(false);
  const [page_size, set_page_size] = useState(10);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [new_password, set_new_password] = useState("");
  const [confirm_password, set_confirm_password] = useState("");
  const [selectedLearner, setSelectedLearner] = useState(null);


  const [error, set_error] = useState({
    new_password: "",
    confirm_password: ""
  });

  const handlePasswordSubmit = async () => {
    // Clear previous errors
    set_error({ current_password: "", new_password: "", confirm_password: "" });

    if (new_password !== confirm_password) {
      const msg = "New password and Confirm password do not match!";
      set_error({ ...error, confirm_password: msg });

      notification.error({
        message: "Error",
        description: msg,
      });
      return;
    }

    setPasswordLoading(true);

    const FORM_DATA = new FormData();
    FORM_DATA.append("email", selectedLearner.email);
    FORM_DATA.append("new_password", new_password);
    FORM_DATA.append("confirm_password", confirm_password);

    try {
      const response = await CHANGE_LEARNER_PASSWORD(FORM_DATA);
 
      if (response?.data?.status) {
        notification.success({
          message: "Password Updated Successfully",
        });

        setIsModalOpen(false);

        set_new_password("");
        set_confirm_password("");
        set_error({ new_password: "", confirm_password: "" });

      } else {
        const errors = response?.data?.errors;
        if (errors) {
          set_error({
            new_password: errors.new_password || "",
            confirm_password: errors.confirm_password || "",
          });

          const errorMsg = Object.values(errors).join(" | ");
          notification.error({
            message: "Error",
            description: errorMsg,
          });
        } else {
          const backendError = response?.data?.message;
          notification.error({
            message: "Error",
            description: backendError,
          });
        }
      }
    } catch (err) {
      const backendError =
        err?.response?.data?.message ;

      notification.error({
        message: "Error",
        description: backendError,
      });
    }

    setPasswordLoading(false);
  };

  const showModal = () => {
    set_is_model_open(true);
  };

  const handleCancel = () => {
    set_is_model_open(false);
    set_file([])
  };

  const beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv';
    if (!isCSV) {
      set_errors({ file: "Only CSV files are allowed!" });
      message.error("Please upload a valid CSV file.");
      return Upload.LIST_IGNORE;
    }

    set_file([file]);
    set_errors("");
    message.success(` ${file.name}`);
    return false;
  };

  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        navigate("/learners/1");
        const FORM_DATA = new FormData();
        FORM_DATA.append(search_key, search_value);
        FORM_DATA.append("per_page", page_size);
        FORM_DATA.append("page", 1);
        const API_CALL = await LEARNER_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_learners(API_CALL?.data?.total_learners);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        set_pagination_loader(false);
      }
    }, 500)(); // Call debounce immediately
  }, [page_size, navigate]);

  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("per_page", page_size);
    const API_CALL = await LEARNER_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_learners(API_CALL?.data?.total_learners);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoader(true);
      try {
        if (page) {
          await pagination_on_change(Number(page), page_size, true);
        } else {
          await LIST_API();
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoader(false);
      }
    };

    loadData();
  }, [page, page_size, onchange_call]);


  const change_status = async (id) => {
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await LEARNER_STATUS(FORM_DATA);
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
    <Select
      defaultValue="Name"
      onChange={(value) => {
        if (value === 'Name') {
          set_search_query_key('name');
          set_placeholder("Search by name");
        }
        if (value === 'Email') {
          set_search_query_key('email');
          set_placeholder("Search by email");
        }
        if (value === 'Phone') {
          set_search_query_key('contact_no');
          set_placeholder("Search by contact no.");
        }
      }}
    >
      <Select.Option value="Name">Name</Select.Option>
      <Select.Option value="Email">Email</Select.Option>
      <Select.Option value="Phone">Phone</Select.Option>
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
            <div style={{ fontSize: "12px", }}>{formatToIST(record.last_login)}</div>

          </> : <><div style={{ color: "#5bede7" }}>Not login yet</div></>}

        </div>
      ),
    },
    {
      title: "Joined On",
      key: "joining_on",
      render: (text, record) => (
        <div>
          <div style={{ fontSize: "12px" }}>{formatToIST(record.joining_on)}</div>

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
          <Tooltip title=" Learner Courses">
            <Button type="primary" size="small" onClick={() => navigate(`/learner-courses/ ${record.id}`)}><BookOutlined /></Button></Tooltip>
          <Button
            variant="solid"
            color="green"
            size="small"
            onClick={() => {
              setSelectedLearner(record);
              setIsModalOpen(true);
            }}
          >
            <LockOutlined />
          </Button>

          <Popconfirm
            title="Do you really want to change the status ?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button variant="solid" color="danger" size="small"> Change Status</Button>

          </Popconfirm>


        </Space>
      ),
    },
  ];

  const pagination_on_change = async (data, size) => {
    navigate(`/learners/${data}`);
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("per_page", size);
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await LEARNER_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_learners(API_CALL?.data?.total_learners);
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
    setLoader(true)
    const formData = new FormData();
    formData.append("file", file[0]);

    try {
      const response = await BULD_ADD_LEARNERS(formData);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        set_is_model_open(false);
        setLoader(false)

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
      <Card>
        <Row>
          <Col span={12}>
            <h2>Learners {page ? `(Page ${page})` : ""}</h2>
          </Col>
          <Col span={12}>
            <div className="learner-buttons" style={{ float: "right" }}>
              <Button
                type="primary"
                color="green"
                variant="solid"
                style={{ marginRight: "10px" }}
                onClick={() => navigate("/add-learner")}
              >
                Add Learners
              </Button>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={showModal} onCancel={handleCancel}
              >
                Import Learner
              </Button>
              {/* <Button
                color="danger"
                variant="solid"
                style={{ marginRight: "3px" }}
              >
                Export Learner
              </Button> */}
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder={placeholder}
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
                  rowKey="id"
                />
              </>
            )}

            {total_pages > 0 ? (
              <>
                <div style={{ float: "right", marginTop: "20px" }}>
                  {" "}
                  <Pagination
                    current={current_page}
                    total={total_learners}
                    pageSize={page_size}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={pagination_on_change}
                    onShowSizeChange={(current, size) => {
                      set_page_size(size);
                      pagination_on_change(1, size);
                    }}
                    style={{ display: 'inline-block' }}
                    className="no-search-pagination"
                  />
                  <style>
                    {`
    .no-search-pagination .ant-select-selection-search-input {
      display: none !important;
    }
  `}
                  </style>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "red" }}>
                  <h2>No Learner Found</h2>
                </div>
              </>
            )}
          </>
        )}


        <Modal
          title={<span>Import Learners</span>}
          open={is_model_open}
          onCancel={handleCancel}
          footer={[
            <Button color="green" variant="solid" onClick={handleBulkUpload} style={{ width: "100%" }}>
              Add
            </Button>,
          ]}
          width={400}
          destroyOnClose
        >
          <div style={{ width: "100%" }}>
            <Upload
              beforeUpload={beforeUpload}
              fileList={file}
              onRemove={() => set_file([])}
              accept=".csv"
              multiple={false}
              maxCount={1}
              style={{ width: "100%" }}
            >
              <Button type="primary" icon={<UploadOutlined />} block>
                Upload File
              </Button>
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

        <Modal
          title="Reset Password"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLearner(null);
            set_error({ current_password: "", new_password: "", confirm_password: "" });
            set_new_password("");
            set_confirm_password("");
          }}
          footer={null}
        >
          <Form layout="vertical" onFinish={handlePasswordSubmit}>

            <Form.Item label="New Password">
              <Input.Password value={new_password} onChange={(e) => set_new_password(e.target.value)} />
              {error.new_password && <p style={{ color: "red" }}>{error.new_password}</p>}
            </Form.Item>

            <Form.Item label="Confirm Password">
              <Input.Password value={confirm_password} onChange={(e) => set_confirm_password(e.target.value)} />
              {error.confirm_password && <p style={{ color: "red" }}>{error.confirm_password}</p>}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={passwordLoading} style={{ width: "100%" }}>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default Learners;
