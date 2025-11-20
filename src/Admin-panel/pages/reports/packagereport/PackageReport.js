import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Row, Col, Input, Pagination, Spin, App } from "antd";
import { useNavigate } from "react-router-dom";
import { DOWNLOAD_PACKAGE_REPORT, PACKAGE_REPORT } from "../../../apis/apis";
import moment from "moment";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { DownloadOutlined, EyeFilled, LoadingOutlined, } from "@ant-design/icons";



const PackageReport = () => {

  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_packages, set_total_packages] = useState("");
  const [search_query_title, set_search_query_title] = useState("");
  const [page_size, set_page_size] = useState(10)


  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("per_page", page_size);
      const API_CALL = await PACKAGE_REPORT(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_packages(API_CALL?.data?.total_packages);
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, []);

  const pagination_on_change = async (page, size) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("per_page", size);
    FORM_DATA.append("name", search_query_title);
    const API_CALL = await PACKAGE_REPORT(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_packages(API_CALL?.data?.total_packages);
      set_pagination_loader(false);
    } else {
      set_pagination_loader(false);
    }
  };


  const fetchResultsTitle = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_title(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);
        FORM_DATA.append("name", value);
        const API_CALL = await PACKAGE_REPORT(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_packages(API_CALL?.data?.total_packages);
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
    fetchResultsTitle(value);
  };

  const columns = [
    {
      title: "Created On",
      dataIndex: "created_on",
      render: (text, record) => (
        <span>
          {moment(record.created_on).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Till Date",
      dataIndex: "till_date",
      render: (text, record) => (
        <span>
          {moment(record.till_date).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      render: (text, record) => <span>{record.package_name}</span>,
    },
    {
      title: "Total Courses",
      dataIndex: "total_courses",
      render: (text, record) => <span>{record.total_courses}</span>,
    },
    {
      title: "Total Learners",
      dataIndex: "total_learners",
      render: (text, record) => <span>{record.total_learners}</span>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() =>
            navigate("/package-courses/" + btoa(record.package_id), {
              state: { from: "/report/package-report" },
            })
          }><EyeFilled /></Button>
          <Button style={{ marginLeft: "5px" }} color="green" variant="solid" size="small" onClick={() => GET_DOWNLOAD_REPORT_ACTION(record.package_id)}><DownloadOutlined /></Button></>

      ),
    },
  ];

  //   const GET_DOWNLOAD_REPORT_ACTION = async (package_id) => {
  //   const FORM_DATA = new FormData();
  //   FORM_DATA.append("package_id", package_id);
  //   const API_CALL = await DOWNLOAD_PACKAGE_REPORT(FORM_DATA);
  //   if (API_CALL?.data?.status) {
  //         window.location= API_CALL?.data?.url
  //   } else {
  //     console.log("error");
  //     setLoader(false);
  //   }
  // };


  const GET_DOWNLOAD_REPORT_ACTION = async (package_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("package_id", package_id);

    const API_CALL = await DOWNLOAD_PACKAGE_REPORT(FORM_DATA);
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


    <div style={{ padding: 20 }}>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={<span>Name</span>}
            onChange={handleInput}
            placeholder="Search by package name"
            size="large"
            style={{ width: "100%" }}
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
                  current={current_page}
                  total={total_packages}
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
            ""
          )}
        </>
      )}

    </div>
  );
};

export default PackageReport;
