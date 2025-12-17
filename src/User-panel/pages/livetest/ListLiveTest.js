import { Button, Card, Col, Input, Row, Space, Table, Pagination, Spin, Modal } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatToIST } from "../../../helper/CommonHelper";
import { LIST_LIVE_TESTS, VIEW_LIVE_TEST_DETAILS } from "../../apis/apis";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLiveTestId, setSelectedLiveTestId] = useState(null);
  const [loading, setLoading] = useState(false);

  // modal data states
  const [title, set_title] = useState("");
  const [quiz_title, set_quiz_title] = useState("");
  const [time_limit, set_time_limit] = useState(0);
  const [expired, set_expired] = useState(false);
  const [submitted, set_submitted] = useState(false);
  const [passing_percentage, set_passing_percentage] = useState(0);
  const [number_of_retake, set_number_of_retake] = useState(0);


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
              onClick={() => {
                setSelectedLiveTestId(record.live_test_id);
                setIsModalOpen(true);
              }}

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


  useEffect(() => {
    if (!selectedLiveTestId) return;

    const VIEW_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("live_test_id", selectedLiveTestId);

      const response = await VIEW_LIVE_TEST_DETAILS(FORM_DATA);

      if (response?.data?.status) {
        const data = response.data.data;

        set_title(data?.title);
        set_quiz_title(data?.title);
        set_time_limit(parseInt(data?.time_limit));
        set_expired(data?.expired);
        set_submitted(data?.test_submitted);
        set_passing_percentage(data?.passing_percentage);
        set_number_of_retake(data?.no_of_retake);
      }
      setLoading(false);
    };

    VIEW_API();
  }, [selectedLiveTestId]);


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
                        onClick={() => {
                          setSelectedLiveTestId(record.live_test_id);
                          setIsModalOpen(true);
                        }}
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

        <Modal
          title="Live Test Details"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLiveTestId(null);
          }}
          footer={null}
          width={600}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <p style={{ textAlign: "center", margin: "30px" }}>You can attempt this test a maximum of {number_of_retake} times. Currently, you are on your second attempt. The time limit for the test is {time_limit} minutes, and you must score at least {passing_percentage}% to pass. Once you pass, the test will be automatically submitted, and no further attempts will be required.</p>

              {!expired && !submitted && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate("/live-test/" + btoa(selectedLiveTestId))
                    }
                  >
                    Start Test
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal>


      </Card>
    </div>
  );
}

export default ListLiveTest;
