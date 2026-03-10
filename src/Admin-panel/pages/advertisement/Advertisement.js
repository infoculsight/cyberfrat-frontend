import { message, App, Button, Card, Col, Input, Pagination, Popconfirm, Row, Select, Space, Spin, Table, Tag, Tooltip } from "antd";
import { ADS_LIST, ADS_STATUS, Delete_ADS } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteFilled, EyeFilled, LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { formatToIST } from "../../../helper/CommonHelper";
import debounce from "lodash.debounce";



function Advertisement() {

  const { notification } = App.useApp();

  //USE STATE FOR PAGINATION AND LOADER
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_count, set_total_count] = useState("");
  const [placeholder, set_placeholder] = useState("Search by name");
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');
  const [onchange_call, set_onchange_call] = useState(true);




  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    // FORM_DATA.append("per_page", page_size);
    const API_CALL = await ADS_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_count(API_CALL?.data?.total_count);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };
  useEffect(() => {
    LIST_API();
  }, [onchange_call]);

  const debouncedFetchResults = useCallback(
    debounce(async (value) => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();

        FORM_DATA.append("ads_type", value);

        const API_CALL = await ADS_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_count(API_CALL?.data?.total_count);
          set_pagination_loader(false);
        } else {
          set_pagination_loader(false);
        }
      } catch (err) {
        console.error("API Error:", err);
        set_pagination_loader(false);
      }
    }, 500),
    []
  );




  const change_status = async (id) => {
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await ADS_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        set_onchange_call(onchange_call ? false : true)

      } else {
        //setLoader(false);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  const columns = [
    {
      title: "Create At",
      dataIndex: "created_at",
      render: (text, record) => (
        <span>
          {record.created_at}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "ads_type",
      render: (text, record) => (
        <span>
          {record.ads_type}
        </span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (text, record) => (
        <span>
          {formatToIST(record?.meta?.start_date)}
        </span>
      ),
    },

    {
      title: "End Date",
      dataIndex: "end_date",
      render: (text, record) => (
        <span>
          {formatToIST(record?.meta?.end_date)}
        </span>
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

          <Tooltip title="Edit Advertisement">
            <Button type="primary" size="small" onClick={() => navigate("/edit-advertisement/" + btoa(record.id))}><EyeFilled /></Button>
          </Tooltip>

          <Popconfirm
            title="Do you really want to change the status ?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Change Status">
              {record.status ? (
                <Button
                  variant="solid" color="green" size="small">

                  <CheckCircleOutlined />
                </Button>

              ) : (
                <Button color="red" variant="solid" size="small">
                  <CloseCircleOutlined />
                </Button>
              )}
            </Tooltip>
          </Popconfirm>

          <Popconfirm
            title="Do you really want to delete this Advertisement?"
            onConfirm={() => delete_news(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size='small' variant='solid' color='red' style={{ marginLeft: "10px" }}><DeleteFilled /></Button>
          </Popconfirm>


        </Space>
      ),
    },


  ];



  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append(search_query_key, search_query_value);

    const API_CALL = await ADS_LIST(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_count(API_CALL?.data?.total_count);
    }

    set_pagination_loader(false);
  };


  const selectBefore = (
    <Select
      defaultValue="Type"
    >
      <Select.Option value="Type">Name</Select.Option>
    </Select>
  );

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value);
    debouncedFetchResults(value);
  };


  const delete_news = async (id) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await Delete_ADS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Deleted Successfully",
          description: response?.data?.message,
        });
        // Refresh the table after deletion
        LIST_API();
      } else {
        message.error(response?.data?.message || "Failed to delete");
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    } finally {
      set_pagination_loader(false);
    }
  };

  return (
    <div className="lms-body">


      <Card>
        <Row>
          <Col span={12}>
            <h2>Advertisement</h2>
          </Col>
          <Col span={12}>
            <div className="learner-buttons" style={{ float: "right" }}>

              <Button
                type="primary"
                color="green"
                variant="solid"
                style={{ marginRight: "10px" }}
                onClick={() => navigate("/add-advertisement")}
              >
                Add Advertisement
              </Button>

            </div>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder={"search by type"}
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
                    total={total_count}
                    pageSize={10}
                    onChange={pagination_on_change}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "red" }}>
                  <h2>No Ads Found</h2>
                </div>
              </>
            )}
          </>
        )}




      </Card>
    </div>
  );
}

export default Advertisement;