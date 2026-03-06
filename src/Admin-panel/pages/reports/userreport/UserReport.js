import { App, Button, Col, Input, Pagination, Row, Select, Space, Spin, Table, Tag } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LEARNER_LIST, USER_REPORT } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { formatToIST } from "../../../../helper/CommonHelper";


function UserReport() {
    const { page } = useParams();
    const { notification } = App.useApp();

    //USE STATE FOR PAGINATION AND LOADER
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [table_data, set_table_data] = useState(false);
    const [current_page, set_current_page] = useState("");
    const [total_pages, set_total_pages] = useState("");
    const [total_learners, set_total_learners] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);



    // fillter state
    const [placeholder, set_placeholder] = useState("Search by name");
    const [search_query_key, set_search_query_key] = useState('name');
    const [search_query_value, set_search_query_value] = useState('');
    const [page_size, set_page_size] = useState(10);
    const [download_button, set_download_button] = useState(true);


    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
            console.log("Selected Row Keys:", newSelectedRowKeys);
        },
    };



    const fetchResults = useCallback((search_key, search_value) => {
        debounce(async () => {
            try {
                set_pagination_loader(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append(search_key, search_value);
                FORM_DATA.append("per_page", page_size);
                FORM_DATA.append("page", 1);
                const API_CALL = await LEARNER_LIST(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_table_data(API_CALL?.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                    set_total_learners(API_CALL?.data?.total_learners);
                }
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                set_pagination_loader(false);
            }
        }, 500)(); // Call debounce immediately
    }, [page_size, navigate]);



    const LIST_API = async () => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);
        const API_CALL = await LEARNER_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_learners(API_CALL?.data?.total_learners);
            setLoader(false);
        } else {
            console.log("error");
            setLoader(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoader(true);
            try {
                if (page) {
                    await pagination_on_change(Number(page), page_size, true);
                } else {
                    await LIST_API();
                }
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoader(false);
            }
        };

        loadData();
    }, [page, page_size]);




    const selectBefore = (
        <Select
            defaultValue="Name"
            onChange={(value) => {
                if (value === 'Name') {
                    set_search_query_key('name');
                    set_placeholder("Search by name");
                }
                if (value === 'Email') {
                    set_search_query_key('email');
                    set_placeholder("Search by email");
                }
                if (value === 'Phone') {
                    set_search_query_key('contact_no');
                    set_placeholder("Search by contact no.");
                }
            }}
        >
            <Select.Option value="Name">Name</Select.Option>
            <Select.Option value="Email">Email</Select.Option>
            <Select.Option value="Phone">Phone</Select.Option>
        </Select>
    );


    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record.first_name} {record.last_name}
                </span>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            render: (text, record) => <span>{record.email}</span>,
        },
        {
            title: "Phone",
            dataIndex: "contact_no",
            render: (text, record) => <span>{record.contact_no}</span>,
        },
        {
            title: "Last Login",
            dataIndex: "last_login",
            render: (text, record) => (
                <div>
                    {record.last_login ? <>
                        <div style={{ fontSize: "12px", }}>{formatToIST(record.last_login)}</div>

                    </> : <><div style={{ color: "#5bede7" }}>Not login yet</div></>}

                </div>
            ),
        },
        {
            title: "Joined On",
            key: "joining_on",
            render: (text, record) => (
                <div>
                    <div style={{ fontSize: "12px" }}>{formatToIST(record.joining_on)}</div>

                </div>
            ),
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

    ];

    const pagination_on_change = async (data, size) => {

        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("per_page", size);
        FORM_DATA.append(search_query_key, search_query_value);
        const API_CALL = await LEARNER_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_learners(API_CALL?.data?.total_learners);
            set_pagination_loader(false);
        } else {
            set_pagination_loader(false);
        }
    }

    const handleInput = (e) => {
        const value = e.target.value;
        set_search_query_value(value)

        if (search_query_key === 'name') {
            fetchResults('name', value)
        }
        if (search_query_key === 'email') {
            fetchResults('email', value)
        }
        if (search_query_key === 'contact_no') {
            fetchResults('contact_no', value)
        }
    };



    const DOWNLOAD_REPORT_ACTION = async () => {
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: "Warning",
                description: "Please select at least one learner",
            });
            return;
        }

        try {
            set_download_button(false); // disable button

            const FORM_DATA = new FormData();

            // Convert array of ids to comma separated string
            const learnerIds = selectedRowKeys.join(",");
            FORM_DATA.append("learner_ids", learnerIds);

            const API_CALL = await USER_REPORT(FORM_DATA);

            if (API_CALL?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: "Check the Download tab for your report",
                });
            } else {
                notification.error({
                    message: "Error",
                    description: "Something went wrong",
                });
            }
        } catch (error) {
            console.error("Download Error:", error);
            notification.error({
                message: "Error",
                description: "Failed to download report",
            });
        } finally {
            set_download_button(true); // enable button again
        }
    };




    return (
        <div>

            <Row>
                <Col span={20}>
                    <Input
                        addonBefore={selectBefore}
                        placeholder={placeholder}
                        onChange={handleInput}
                        size="large"
                    />
                </Col>
                <Col span={4}>
                  
                        <Button
                            size="large"
                            style={{ marginLeft: "10px", width: "100%" }}
                            variant="solid"
                            color="green"
                           
                            onClick={DOWNLOAD_REPORT_ACTION}
                        >
                            Download Report
                        </Button>

                    
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
                                rowSelection={rowSelection}
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
                                    total={total_learners}
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
                                <h2>No Learner Found</h2>
                            </div>
                        </>
                    )}
                </>
            )}


        </div>
    );
}

export default UserReport;
