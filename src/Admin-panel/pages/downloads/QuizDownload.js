import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Spin,
  Table,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { GET_DOWNLOAD_REPORT, LIST_DOWNLOAD_QUIZ_TEST_REPORT } from "../../apis/apis";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import debounce from "lodash.debounce";

import { formatToIST } from "../../../helper/CommonHelper";

function QuizDownload() {

  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState(0);
  const [search_query_title, set_search_query_title] = useState("");
  const [page_size, set_page_size] = useState(10)


  const LIST_API = async (page = 1, perPage = page_size) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("per_page", perPage);
    const API_CALL = await LIST_DOWNLOAD_QUIZ_TEST_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  const GET_DOWNLOAD_REPORT_ACTION = async (id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);

    const API_CALL = await GET_DOWNLOAD_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      window.location = API_CALL?.data?.url
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "report_view",
      render: (text, record) => {
        try {

          let titleMatch = record.report_view.match(/'title':\s*'([^']+)'/);
          let nameMatch = record.report_view.match(/'name':\s*'([^']+)'/);

          let value = titleMatch ? titleMatch[1] : nameMatch ? nameMatch[1] : "N/A";

          if (value && value !== "N/A") {
            value = value.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
          }
          return <span>{value}</span>;
        } catch (e) {
          return <span>N/A</span>;
        }
      },
    },
    {
      title: "Download on",
      dataIndex: "created_at",
      render: (text, record) => (
        <div>
          <div style={{ fontSize: "12px" }}>{formatToIST(record.created_at)}</div>

        </div>
      ),
    },
    {
      title: "Report Type",
      dataIndex: "report_type",
      render: (text, record) => {

        const typeMap = {
          course_learners: "Course",
        };
        const displayType = typeMap[record.report_type] || record.report_type;
        return <span>{displayType}</span>;
      },
    },


    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => GET_DOWNLOAD_REPORT_ACTION(record.id)} variant="solid" color="danger" size="small">
          Download
        </Button>
      ),
    },
  ];

  const pagination_on_change = async (page, size) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("per_page", size)
    const API_CALL = await LIST_DOWNLOAD_QUIZ_TEST_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_pagination_loader(false);
    } else {
      set_pagination_loader(false);
    }
  };



  const fetchResultsTitle = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_title(value);
        set_current_page(1);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);
        FORM_DATA.append("title", value);
        const API_CALL = await LIST_DOWNLOAD_QUIZ_TEST_REPORT(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_pagination_loader(false);
        } else {
          set_pagination_loader(false);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    }, 500)(); // Call debounce immediately
  }, [page_size]);

  const handleInput = (e) => {
    const value = e.target.value;
    if (!value) {
      LIST_API(1, page_size); // force current page_size
    } else {
      fetchResultsTitle(value);
    }
  };

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={<span>Title</span>}
            onChange={handleInput}
            placeholder="Search by title"
            size="large"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {loader ? (
        <CulsightPageLoader />
      ) : (
        <>
          {pagination_loader ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              pagination={false}
              dataSource={table_data}
              style={{ marginTop: "15px" }}
              rowKey="id"
            />
          )}

          {total_pages > 0 ? (
            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                current={current_page}
                total={total_pages * page_size}
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
          ) : (
            <div style={{ textAlign: "center", color: "red" }}>
              <h2>No Data Found</h2>
            </div>
          )}
        </>
      )}
    </>

  );
}

export default QuizDownload;
