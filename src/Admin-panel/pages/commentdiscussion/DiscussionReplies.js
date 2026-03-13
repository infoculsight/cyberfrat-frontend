import { App, Button, Card, Col, Input, message, Pagination, Row, Select, Space, Spin, Table, Tag, Popconfirm, Tooltip } from "antd";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeFilled, LeftOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DISSCUSSION_STATUS, LIST_DISSCUSSION_REPLY } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";


function DiscussionReplies() {
    const { notification } = App.useApp();
    const { id } = useParams()
    //USE STATE FOR PAGINATION AND LOADER
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [table_data, set_table_data] = useState(false);
    const [current_page, set_current_page] = useState("");
    const [total_pages, set_total_pages] = useState("");
    const [total_count, set_total_count] = useState("");
    const [onchange_call, set_onchange_call] = useState(true);
    const [placeholder, set_placeholder] = useState("Search by comment");
    const [search_query_key, set_search_query_key] = useState('comment');
    const [search_query_value, set_search_query_value] = useState('');
    const [page_size, set_page_size] = useState(10);


    const change_status = async (id) => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", id);
        FORM_DATA.append("type", "discussion_reply");

        try {
            const response = await DISSCUSSION_STATUS(FORM_DATA);
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

    const selectBefore = (
        <Select
            defaultValue="comment"
            onChange={(value) => {
                if (value === 'comment') {
                    set_search_query_key('comment');
                    set_placeholder("Search by comment");
                }
            }}
        >
            <Select.Option value="comment">Comment</Select.Option>

        </Select>
    );


    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record?.user_row?.first_name} {record?.user_row?.last_name}
                </span>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            render: (text, record) => <span>{record?.user_row?.email}</span>,
        },
        {
            title: "Replies",
            dataIndex: "comment",
            render: (text, record) => <span>{record.comment}</span>,
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


                </Space>
            ),
        },
    ];


    const LIST_API = async () => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);
        FORM_DATA.append("id", atob(id));
        const API_CALL = await LIST_DISSCUSSION_REPLY(FORM_DATA);
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
    }, [page_size, onchange_call]);

    const fetchResults = useCallback((search_key, search_value) => {
        debounce(async () => {
            try {
                set_pagination_loader(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append(search_key, search_value);
                FORM_DATA.append("per_page", page_size);
                FORM_DATA.append("id", atob(id));
                FORM_DATA.append("page", 1);
                const API_CALL = await LIST_DISSCUSSION_REPLY(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_table_data(API_CALL?.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                    set_total_count(API_CALL?.data?.total_count);
                }
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                set_pagination_loader(false);
            }
        }, 500)(); // Call debounce immediately
    }, [page_size]);


    const pagination_on_change = async (data, size) => {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("id", atob(id));
        FORM_DATA.append("per_page", size);
        FORM_DATA.append(search_query_key, search_query_value);
        const API_CALL = await LIST_DISSCUSSION_REPLY(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_count(API_CALL?.data?.total_count);
            set_pagination_loader(false);
        } else {
            set_pagination_loader(false);
        }
    }

    const handleInput = (e) => {
        const value = e.target.value;
        set_search_query_value(value)

        if (search_query_key === 'comment') {
            fetchResults('comment', value)
        }

    };


    return (
        <div className="lms-body">
            <Card>
                <Row>
                    <Col span={12}>
                        <h2><span style={{ cursor: "pointer" }}
                            onClick={() => navigate("/comment-discussion")}><LeftOutlined /></span> Discussion Reply</h2>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Input
                            addonBefore={selectBefore}
                            placeholder={placeholder}
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
                                    <h2>No Data</h2>
                                </div>
                            </>
                        )}
                    </>
                )}


            </Card>
        </div>
    );
}

export default DiscussionReplies;
