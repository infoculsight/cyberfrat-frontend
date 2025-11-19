import { App, Button, Card, Col, Input, Pagination, Row, message, Spin, Table, Tag, Popconfirm } from 'antd'
import { EyeFilled, LoadingOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from 'react'
import { NEWS_LIST, NEWS_STATUS } from '../../apis/apis';
import debounce from 'lodash.debounce';
import { useNavigate, useParams } from 'react-router-dom';
import CulsightPageLoader from '../../components/CulsightPageLoader';
import { formatToIST } from '../../../helper/CommonHelper';

function Announcment() {
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const { page } = useParams();
    const [loader, setLoader] = useState(true)
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [table_data, set_table_data] = useState(false);
    const [current_page, set_current_page] = useState("");
    const [total_pages, set_total_pages] = useState("");
    const [total_news, set_total_news] = useState("");
    const [page_size, set_page_size] = useState(10);
    const [search_query_title, set_search_query_title] = useState("");
    const [onchange_call, set_onchange_call] = useState(true);


    const LIST_API = async () => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);
        const API_CALL = await NEWS_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_news(API_CALL?.data?.total_news);
            setLoader(false);
        } else {
            setLoader(false);
        }
    };
    useEffect(() => {
    LIST_API();
}, []);

    


    const pagination_on_change = async (data, size) => {
        navigate(`/announcment/${data}`);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("per_page", size);
        const API_CALL = await NEWS_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_news(API_CALL?.data?.total_news);
            set_pagination_loader(false);
        } else {
            set_pagination_loader(false);
        }
    }


    const fetchResults = useCallback((value) => {
      debounce(async () => {
        try {
          set_pagination_loader(true);
          navigate("/announcment/1");
          const FORM_DATA = new FormData();
          FORM_DATA.append("title", value);
          FORM_DATA.append("per_page", page_size);
          FORM_DATA.append("page", 1);
          const API_CALL = await NEWS_LIST(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_news(API_CALL?.data?.total_news);
          }
        } catch (err) {
          console.error("API Error:", err);
        } finally {
          set_pagination_loader(false);
        }
      }, 500)(); // Call debounce immediately
    }, [page_size, navigate]);


 const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_title(value);   
    fetchResults(value);
};


  const change_status = async (id) => {
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);
    try {
      const response = await NEWS_STATUS(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        set_onchange_call(onchange_call ? false : true)
         setLoader(false);

      } else {
         setLoader(false);

      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };




    const columns = [
        {
            title: "Created On",
            dataIndex: "created_at",
            render: (text, record) => (
                <span>
                    {formatToIST(record.created_at)}
                </span>
            ),
        },
        {
            title: "Name",
            dataIndex: "title",
            render: (text, record) => (
                <span>
                    {record.title}
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
                            <Tag color="success">Publish</Tag>
                        </>
                    ) : (
                        <>
                            <Tag color="error">Unpablish</Tag>
                        </>
                    )}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <>
                <span><Button type='primary' onClick={() => navigate('/edit-announcment/' + btoa(record.id))}><EyeFilled size="large"/></Button></span>
                <Popconfirm
            title="Do you really want to change the status ?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button variant="solid" color="danger" style={{marginLeft:"10px"}}> Change Status</Button>

          </Popconfirm>
          </>
            ),
        },
    ];


    return (
        <div className='lms-body'>
            <Card>
                <Row>
                    <Col span={12}>
                    <h2>Announcment</h2> 
                    </Col>
                    <Col span={12}>
                        <Button type='primary' style={{ float: "right" }} onClick={() => navigate('/add-announcment')}>  Add Announcment</Button>
                    </Col>
                </Row>
                  <Row>
          <Col span={12}>
            <Input
              addonBefore={<>Title</>}
              placeholder={"Search by title"}
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
                    total={total_news}
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
              <>
                <div style={{ textAlign: "center", color: "red" }}>
                  <h2>No News Found</h2>
                </div>
              </>
            )}
          </>
        )}
            </Card>
        </div>
    )
}

export default Announcment
