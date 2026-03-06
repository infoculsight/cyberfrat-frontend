import { App, Button, Card, Col, Input, Modal, Pagination, Row, Select, Space, Spin, Table, Tag } from "antd";
import { EyeInvisibleFilled, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LOGS_LIST } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { formatToIST } from "../../../helper/CommonHelper";

function LogsView() {
  const { page } = useParams();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_courses, set_total_courses] = useState("");
  const [onchange_call, set_onchange_call] = useState(true);

  const [placeholder, set_placeholder] = useState("Search by name");
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');

  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);





  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append(search_key, search_value);
        FORM_DATA.append("page", 1);
        const API_CALL = await LOGS_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_courses(API_CALL?.data?.total_courses);
        }
      } finally {
        set_pagination_loader(false);
      }
    }, 500)();
  }, [ navigate]);

  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LOGS_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
    }
    setLoader(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoader(true);
      if (page) {
        await pagination_on_change(Number(page));
      } else {
        await LIST_API();
      }
      setLoader(false);
    };
    loadData();
  }, [page, onchange_call]);

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

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await LOGS_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_courses(API_CALL?.data?.total_courses);
    }
    set_pagination_loader(false);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value);
    fetchResults(search_query_key, value);
  };


  const columns = [
    {
      title: "Created At ",
      dataIndex: "created_at",
      render: (text, record) => (
        <span>
          {formatToIST(record.created_at)}
        </span>
      ),
    },

{
  title: "Logs Type",
  dataIndex: "logs_type",
  render: (_, record) => {
    const value = record?.meta?.logs_type;
    const formatted = value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "-";

    return <span>{formatted}</span>;
  },
},
    {
      title: "Message ",
      dataIndex: "message",
      render: (text, record) => (
        <span>
          {record?.meta?.message}
        </span>
      ),
    },

        {
      title: "Permission Code ",
      dataIndex: "permission_codename",
      render: (text, record) => (
        <span>
          {record.permission_codename}
        </span>
      ),
    },



    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">

          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLog(record);
              setShowModal(true);
            }}
          />



        </Space>
      ),
    },
  ];

  return (
    <div className="lms-body">
      <Card>

        {/* Heading */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <h2 style={{ marginBottom: 0 }}>
              Logs View
            </h2>
          </Col>
        </Row>

        {/* Search */}
        {/* <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col xs={24} sm={24} md={12}>
            <Input
              addonBefore={selectBefore}
              placeholder={placeholder}
              onChange={handleInput}
              size="large"
            />
          </Col>
        </Row> */}

        {/* Loader */}
        {loader ? (
          <CulsightPageLoader />
        ) : (
          <>
            {pagination_loader ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  pagination={false}
                  dataSource={table_data}
                  style={{ marginTop: "15px", minWidth: "900px" }}
                  rowKey="id"
                />
              </div>
            )}

            {total_pages > 0 ? (
              <div
                className="pagination-wrapper"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Pagination
                  current={current_page}
                  total={total_courses}
                  pageSize={10}
                 
                   onChange={pagination_on_change}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "red" }}>
                <h2>No Logs Found</h2>
              </div>
            )}
          </>
        )}

        

      </Card>
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
        title="Request Meta Details"
      >
        {selectedLog && (
          <>
            <p><strong>IP:</strong> {selectedLog.request_meta?.ip}</p>
            <p><strong>Method:</strong> {selectedLog.request_meta?.method}</p>
            <p><strong>Path:</strong> {selectedLog.request_meta?.path}</p>
            <p><strong>User Agent:</strong> {selectedLog.request_meta?.user_agent}</p>

            <hr />
            <h4>Body:</h4>
               <pre
              style={{

                padding: 10,
                maxHeight: 250,
                overflow: "auto",
              }}
            >
              {JSON.stringify(selectedLog.request_meta?.body, null, 2)}
            </pre>

            <h4>Headers:</h4>
            <pre
              style={{

                padding: 10,
                maxHeight: 250,
                overflow: "auto",
              }}
            >
              {JSON.stringify(selectedLog.request_meta?.headers, null, 2)}
            </pre>
          </>
        )}
      </Modal>

    </div>
  );
}

export default LogsView;