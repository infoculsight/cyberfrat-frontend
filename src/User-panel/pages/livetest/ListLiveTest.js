import { Button, Card, Col, Input, Row, Space, Table, Pagination, Spin } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatToIST } from "../../../helper/CommonHelper";
import { LIST_LIVE_TESTS } from "../../apis/apis";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

function ListLiveTest() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [total_items, set_total_items] = useState(0);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [search_query_value, set_search_query_value] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch List API
  const LIST_API = async () => {
    setLoader(true);
    try {
      const FORM_DATA = new FormData();
      const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_current_page(API_CALL.data.page);
        set_table_data(API_CALL.data.data);
        set_total_items(API_CALL.data.total_items);
        set_total_pages(API_CALL.data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching live tests:", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (search_value) => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("title", search_value);
        const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data.data);
          set_current_page(API_CALL.data.current_page);
          set_total_pages(API_CALL.data.total_pages);
        }
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        set_pagination_loader(false);
      }
    }, 500),
    []
  );

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value);
    debouncedSearch(value);
  };

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    try {
      const FORM_DATA = new FormData();
      FORM_DATA.append("page", page); // confirm API expects "page"
      FORM_DATA.append("title", search_query_value || "");
      const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data.data);
        set_current_page(API_CALL.data.page || page);
        set_total_pages(API_CALL.data.total_pages);
      }
    } catch (err) {
      console.error("Pagination API Error:", err);
    } finally {
      set_pagination_loader(false);
    }
  };

  const openFullscreenWindow = (url) => {
    if (typeof window !== "undefined") {
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      const windowFeatures = `width=${width},height=${height},top=0,left=0,resizable=yes,scrollbars=yes`;
      const newWindow = window.open(url, "_blank", windowFeatures);
      if (newWindow) newWindow.focus();
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => <span>{record.title}</span>,
    },
    {
      title: "Available From",
      key: "available_from",
      render: (text, record) => (
        <div style={{ fontSize: "12px" }}>{formatToIST(record.available_from)}</div>
      ),
    },
    {
      title: "Available Till",
      key: "available_till",
      render: (text, record) => (
        <div style={{ fontSize: "12px" }}>{formatToIST(record.available_till)}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record?.test_submitted ? (
            <Button type="primary" size="small" disabled>
              Test Submitted
            </Button>
          ) : record?.expired ? (
            <Button type="primary" size="small" disabled>
              Test Expired
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              onClick={() =>
                openFullscreenWindow("/live-test/" + btoa(record.live_test_id))
              }
            >
              <EyeFilled />
            </Button>
          )}
          {record?.test_result && (
            <Button
              size="small"
              type="primary"
              onClick={() =>
                navigate("/live-test-result/" + btoa(record.live_test_id))
              }
            >
              View Result
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2>Live Test</h2>
          </Col>
        </Row>

        <Row style={{ marginTop: "15px" }}>
          <Col span={24}>
            <Input
              placeholder="Search by title"
              value={search_query_value}
              addonBefore="Title"
              onChange={handleInput}
              size="large"
              allowClear
            />
          </Col>
        </Row>


        {/* Render Table for Desktop, Tiles for Mobile */}
        {!isMobile ? (
          loader ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={table_data}
              style={{ marginTop: "15px" }}
              loading={pagination_loader}
              pagination={false}
              rowKey="assign_id"
            />
          )
        ) : loader ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
            {table_data.map((record) => (
              <Col span={24} key={record.assign_id}>
                <Card
                  size="small"
                  title={record.title}
                  extra={
                    record?.test_result ? (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          navigate("/live-test-result/" + btoa(record.live_test_id))
                        }
                      >
                        View Result
                      </Button>
                    ) : null
                  }
                >
                  <p>
                    <strong>Available From:</strong> {formatToIST(record.available_from)}
                  </p>
                  <p>
                    <strong>Available Till:</strong> {formatToIST(record.available_till)}
                  </p>
                  <div>
                    {record?.test_submitted ? (
                      <Button type="primary" size="small" disabled style={{ marginTop: "10px" }}>
                        Test Submitted
                      </Button>
                    ) : record?.expired ? (
                      <Button type="primary" size="small" disabled style={{ marginTop: "10px" }}>
                        Test Expired
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          openFullscreenWindow("/live-test/" + btoa(record.live_test_id))
                        }
                        style={{ marginTop: "10px" }}
                      >
                        <EyeFilled />
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}


        {total_pages > 0 && (
          <div style={{ float: "right", marginTop: "20px" }}>
            <Pagination
              current={current_page}
              total={total_items}
              pageSize={10}
              onChange={pagination_on_change}
            />
          </div>
        )}



      </Card>
    </div>
  );
}

export default ListLiveTest;
