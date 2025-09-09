import { Button, Card, Col, Input, Pagination, Row, Spin, Table } from 'antd'
import { EyeFilled, LoadingOutlined, } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LIST_LANDING_PAGE } from '../../apis/apis';
import debounce from 'lodash.debounce';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function LandingPage() {
  // STATES
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_landing_page, set_total_landing_page] = useState("");
  const [search_query_name, set_search_query_name] = useState("");



  // LIST API
  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LIST_LANDING_PAGE(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_landing_page(API_CALL?.data?.total_landing_page);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);


  // SEARCH API 
  const fetchResultsName = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_name(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("name", value);
        const API_CALL = await LIST_LANDING_PAGE(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_landing_page(API_CALL.data?.total_landing_page);
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


  // PAGINATION API 
  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("name", search_query_name);
    const API_CALL = await LIST_LANDING_PAGE(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_landing_page(API_CALL?.data?.total_landing_page);
    }
    set_pagination_loader(false);
  };


  // TABLE COLUMNS
  const columns = [
    {
      title: "Landing Page Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.name}
        </span>
      ),
    },
      {
      title: "User Count",
      render: (text, record) => (
        <span>
         {record.landing_page_count}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => navigate("/edit-landingpage/" + btoa(record.id))}><EyeFilled /></Button>
      ),
    },
  ];


  return (
    <div className='lms-body'>
      
        <Row>
          <Col span={12}>
            <h2>Landing Page</h2>
          </Col>

        </Row>
<Card>
        <Row>
          <Col span={20}>
            <Input addonBefore={<span>Name</span>} placeholder='Search here' size='large' onChange={handleInput} />
          </Col>
          <Col span={4}>
            <Button size='large' type='primary' style={{ marginLeft: "10px", width: "100%" }} onClick={() => navigate("/add-landingpage")}>Add Landing Page</Button>
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
                    total={total_landing_page}
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
  )
}

export default LandingPage
