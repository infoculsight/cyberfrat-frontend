import { Button, Card, Col, Input, Row, Space, Table, Pagination } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatToIST } from "../../../helper/CommonHelper";
import { LIST_LIVE_TESTS } from "../../apis/apis";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function LiveTest() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [total_live_test, set_total_live_test] = useState(0);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [search_query_value, set_search_query_value] = useState("");

  // Fetch List API
  const LIST_API = async () => {
    setLoader(true);
    try {
      const FORM_DATA = new FormData();
      const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data.data);
        set_current_page(API_CALL.data.current_page);
        set_total_pages(API_CALL.data.total_pages);
        set_total_live_test(API_CALL.data.total_live_test);
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


  // create a debounced function once
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
      FORM_DATA.append("page", page);
      FORM_DATA.append("title", search_query_value || "");
      const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data.data);
        set_current_page(API_CALL.data.current_page);
        set_total_pages(API_CALL.data.total_pages);
      }
    } catch (err) {
      console.error("Pagination API Error:", err);
    } finally {
      set_pagination_loader(false);
    }
  };


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => <span>{record.title}</span>,
    },
    {
      title: "Created On",
      key: "created_at",
      render: (text, record) => (
        <div style={{ fontSize: "12px" }}>{formatToIST(record.created_at)}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate("/edit-live-test/" + btoa(record.id))}
          >
            <EyeFilled />
          </Button>
          <Button color="green" variant="solid"
            onClick={() => navigate("/live-test-questions/" + btoa(record.id))}
          >Questions</Button>
          <Button
            color="red"
            variant="solid"
            onClick={() =>
              navigate("/assign-learner-live-test/" + btoa(record.id), {
                state: { title: record.title },
              })
            }
          >
            learners
          </Button>

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
          <Col span={12}>
            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={() => navigate("/add-live-test")}
            >
              Add Live Test
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: "15px" }}>
          <Col span={16}>
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
        {loader ? <><CulsightPageLoader /></> : <>
          <Table
            columns={columns}
            dataSource={table_data}
            style={{ marginTop: "15px" }}
            loading={loader || pagination_loader}
            pagination={false}
            rowKey="id"
          />
          <div style={{ float: "right", marginTop: "20px" }}>
            <Pagination
              current={current_page}
              total={total_pages}
              pageSize={10}
              onChange={pagination_on_change}
            />
          </div>
        </>}


      </Card>
    </div>
  );
}

export default LiveTest;
