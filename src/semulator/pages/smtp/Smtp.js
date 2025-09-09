import { App, Button, Card, Col, Input, message, Pagination, Popconfirm, Row, Space, Spin, Table, Tag, } from "antd";
import { EyeFilled, LoadingOutlined, } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELETE_SMTP, LIST_SMTP, SMTP_STATUS } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";


function Smtp() {
  // STATES
  const { notification,modal } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_smtps, set_total_smtps] = useState("");
  const [onchange_call, set_onchange_call] = useState(true);
  const [search_query_name, set_search_query_name] = useState("");


  // LIST API
  const LIST_API = async () => {
    const FORM_DATA = new FormData();

    const API_CALL = await LIST_SMTP(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_smtps(API_CALL?.data?.total_smtps);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };


  useEffect(() => {
    LIST_API();
  }, [onchange_call]);


  // SEARCH API 
  const fetchResultsName = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_name(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("smtp_user", value);
        const API_CALL = await LIST_SMTP(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_smtps(API_CALL.data?.total_smtps);
        }
        set_pagination_loader(false);
      } catch (err) {
        console.error("API Error:", err);
      }
    }, 500)();
  }, []);


  // SEARCH INPUT
  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsName(value);
  };


    const change_status = async (id) => {
    setLoader(true)
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await SMTP_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        set_onchange_call(onchange_call ? false : true)

      } else {

      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
   } finally {
    setLoader(false); 
  }
  };

    const handleDelete = (id) => {
    
      modal.confirm({
        title: "Are you sure you want to delete this SMTP ?",
        okText: "Yes",
        cancelText: "No",
        onOk: async () => {
          setLoader(true)
          const FORM_DATA = new FormData();
          FORM_DATA.append("id", id);
          try {
            const response = await DELETE_SMTP(FORM_DATA);
            if (response?.data?.status) {
              message.success("Smtp  deleted successfully");
              
              LIST_API();
            } else {
              message.error("Failed to delete Smtp");
            
            }
          } catch (err) {
            message.error("Something went wrong");
          } finally {
        setLoader(false); 
      }
        }
      });
    };
  


  // TABLE COLUMNS
  const columns = [
    {
      title: "Smtp Server",
      dataIndex: "smtp_server",
      render: (text, record) => (
        <span>
          {record.smtp_server}
        </span>
      ),
    },
    {
      title: "Smtp User",
      dataIndex: "smtp_user",
      render: (text, record) => <span>{record.smtp_user}</span>,
    },
    {
      title: "Smtp Port",
      dataIndex: "smtp_port",
      render: (text, record) => <span>{record.smtp_port}</span>,
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
          <Button type="primary" size="small" onClick={() => navigate("/edit-smtp/" + btoa(record.id))}><EyeFilled /></Button>
             <Popconfirm
            title="Are you sure to Change Status this smtp?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="red" variant="solid" size="small">Change Status</Button>
          </Popconfirm>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },

  ];


  // PAGINATION API 
  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("name", search_query_name);
    const API_CALL = await LIST_SMTP(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_smtps(API_CALL?.data?.total_smtps);
    }
    set_pagination_loader(false);
  };



  return (
    <div className="lms-body">


      <Row>
        <Col span={12}>
          <h2>SMTP</h2>
        </Col>
        <Col span={12}>
          <div className="learner-buttons" style={{ float: "right" }}>
            <Button
              color="green"
              variant="solid"
              style={{ marginRight: "10px" }}
              onClick={() => navigate("/add-smtp")}
            >
              Add SMTP
            </Button>

          </div>
        </Col>
      </Row>
      <Card>
        <Row>
          <Col span={12}>
            <Input
              addonBefore={<span>Name</span>}
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
                    total={total_smtps}
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
      </Card>
    </div>
  );
}

export default Smtp;
