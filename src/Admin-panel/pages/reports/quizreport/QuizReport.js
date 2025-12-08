import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Row, Col, Input, Pagination, Spin, Space, App } from "antd";
import { useNavigate } from "react-router-dom";
import { DOWNLOAD_QUIZ_REPORT, QUIZ_REPORT } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { LoadingOutlined } from "@ant-design/icons";

const QuizReport = () => {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [page_size, set_page_size] = useState(10);
  const [search_query_title, set_search_query_title] = useState("");

  // Initial load
  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("per_page", page_size);
      const API_CALL = await QUIZ_REPORT(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data?.results || []);
        set_current_page(Number(API_CALL?.data?.data?.current_page || 1));
        set_total_pages(Number(API_CALL?.data?.data?.total_pages || 0)); // ✅ total_records

        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, [page_size]);

  // Pagination change
  const pagination_on_change = async (page, size) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("search", search_query_title);
    FORM_DATA.append("per_page", size);

    const API_CALL = await QUIZ_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data?.results || []);
      set_current_page(Number(API_CALL?.data?.data?.current_page || page));
      set_total_pages(Number(API_CALL?.data?.data?.total_pages || 0));

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
        FORM_DATA.append("per_page", page_size); // <– now always latest
        const API_CALL = await QUIZ_REPORT(FORM_DATA);

        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data.data.results || []);
          set_current_page(Number(API_CALL.data.data.current_page || 1));
          set_total_pages(Number(API_CALL.data.data.total_pages || 0));
          // <- Correct key
        }
      } finally {
        set_pagination_loader(false);
      }
    }, 500),
    [page_size]
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
        <>
          <Space>
            <Button
              type="link"
              onClick={() => navigate(`/report/quiz-report/${btoa(record.learner_id)}`)}
            >
              View Report
            </Button>
            <Button
              size="small" variant="solid" color="red"
              onClick={() => DOWNLOAD_REPORT_ACTION(record.learner_id)}
            >
              Download Report
            </Button>
          </Space>
        </>
      ),
    },
  ];


  
    const DOWNLOAD_REPORT_ACTION = async (learner_id) => {
    
  
      const FORM_DATA = new FormData();
      FORM_DATA.append("learner_id", learner_id);
  
      const API_CALL = await DOWNLOAD_QUIZ_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        notification.success({
          message: "Successful",
          description: "Check the Download tab for your report",
        });
  
      } else {
        console.log("error");
        setLoader(false);
      }
    };

  return (
    <>
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


          <div style={{ float: "right", marginTop: "20px" }}>
            <Pagination
              current={current_page}
              total={total_pages}
              pageSize={page_size}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              onChange={pagination_on_change}
              onShowSizeChange={(page, newPageSize) => {
                set_page_size(newPageSize);
                pagination_on_change(1, newPageSize);
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
      )}
 </>
  );
};

export default QuizReport;
