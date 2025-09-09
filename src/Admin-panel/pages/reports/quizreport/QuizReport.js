import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Row, Col, Input, Pagination, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { QUIZ_REPORT } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { LoadingOutlined } from "@ant-design/icons";

const QuizReport = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_records, set_total_records] = useState(0);
  const [page_size, set_page_size] = useState(10);
  const [search_query_title, set_search_query_title] = useState("");

  // Initial load
  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      const API_CALL = await QUIZ_REPORT(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data?.results || []);
        set_current_page(Number(API_CALL?.data?.data?.current_page || 1));
        set_total_records(Number(API_CALL?.data?.data?.total_records || 0)); // ✅ total_records
        set_page_size(Number(API_CALL?.data?.data?.page_size || 10));
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, []);

  // Pagination change
  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("search", search_query_title);

    const API_CALL = await QUIZ_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data?.results || []);
      set_current_page(Number(API_CALL?.data?.data?.current_page || page));
      set_total_records(Number(API_CALL?.data?.data?.total_records || 0));
      set_page_size(Number(API_CALL?.data?.data?.page_size || 10));
    }
    set_pagination_loader(false);
  };

  // Search with debounce
  const fetchResultsTitle = useCallback(
    debounce(async (value) => {
      try {
        set_search_query_title(value);
        set_pagination_loader(true);

        const FORM_DATA = new FormData();
        FORM_DATA.append("search", value);

        const API_CALL = await QUIZ_REPORT(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data?.results || []);
          set_current_page(Number(API_CALL?.data?.data?.current_page || 1));
          set_total_records(Number(API_CALL?.data?.data?.total_records || 0));
          set_page_size(Number(API_CALL?.data?.data?.page_size || 10));
        }
        set_pagination_loader(false);
      } catch (err) {
        console.error("API Error:", err);
        set_pagination_loader(false);
      }
    }, 500),
    []
  );

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsTitle(value);
  };

  const columns = [
    {
      title: "Name",
      render: (text, record) => (
        <span>
          {record.learner_id__first_name} {record.learner_id__last_name}
        </span>
      ),
    },
    {
      title: "Email",
      render: (text, record) => <span>{record.learner_id__email}</span>,
    },
    {
      title: "Total Quiz",
      render: (text, record) => <span>{record.chapter_count}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/report/quiz-report/${btoa(record.learner_id)}`)}
        >
          View Report
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={<span>Name & Email</span>}
            onChange={handleInput}
            placeholder="Search by Name or Email"
            size="large"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {loader ? (
        <CulsightPageLoader />
      ) : pagination_loader ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            pagination={false}
            dataSource={table_data}
            style={{ marginTop: "15px" }}
            rowKey={(record, index) => index}
          />

          {total_records > 0 && (
            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                current={current_page}
                total={total_records}
                pageSize={page_size}
                onChange={pagination_on_change}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizReport;
