import { Row, Col, Card, Tag, Button, Input, Space, Popconfirm, message, App, Table, Pagination, Spin, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LIST_TRAININGS, TRAININGS_STATUS } from '../../apis/apis';
import { useCallback, useEffect, useState } from 'react';
import { EyeFilled, LoadingOutlined } from '@ant-design/icons';
import CulsightPageLoader from '../../components/CulsightPageLoader';
import debounce from 'lodash.debounce';
import { formatToIST } from '../../../helper/CommonHelper';


export default function TrainingCards() {
    const Navigate = useNavigate();
    const { notification } = App.useApp();
    const [loader, setLoader] = useState(false);
    const [table_data, set_table_data] = useState([]);
    const [current_page, set_current_page] = useState(1);
    const [total_pages, set_total_pages] = useState(1);
    const [total_rows, set_total_rows] = useState(0);
    const [page_size, set_page_size] = useState(10);
    const [onchange_call, set_onchange_call] = useState(false);
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [placeholder, set_placeholder] = useState("Search by title ");
    const [search_query_key, set_search_query_key] = useState('title ');
    const [search_query_value, set_search_query_value] = useState('');

    const pagination_on_change = async (page, size) => {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", size);
        FORM_DATA.append("page", page);
        const API_CALL = await LIST_TRAININGS(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_rows(API_CALL?.data?.total_rows);
            set_pagination_loader(false);
        } else {
            console.log("error");
            set_pagination_loader(false);
        }
    };

    useEffect(() => {
        setLoader(true)
        const LIST_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("per_page", page_size);
            const API_CALL = await LIST_TRAININGS(FORM_DATA);
            if (API_CALL?.data?.status) {
                set_table_data(API_CALL?.data?.data);
                set_current_page(API_CALL?.data?.current_page);
                set_total_pages(API_CALL?.data?.total_pages);
                set_total_rows(API_CALL?.data?.total_rows);
                setLoader(false);
            } else {
                console.log("error");
                setLoader(false);
            }
        };
        LIST_API();
    }, [page_size, onchange_call]);


    const change_status = async (id) => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", id);
        try {
            const response = await TRAININGS_STATUS(FORM_DATA);
            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                set_onchange_call(onchange_call ? false : true)

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
            title: "Title",
            dataIndex: "title",
            render: (text, record) => (
                <span>
                    {record.title}
                </span>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            render: (text, record) => {
                const labels = {
                    course: "Course",
                    package: "Package",
                    tech: "Tech",
                    hr: "HR",
                };
                return <span>{labels[record.category] || record.category}</span>;
            }
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            render: (text, record) => <span>{formatToIST(record.start_date)}</span>,
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            render: (text, record) => <span>{formatToIST(record.end_date)}</span>,
        },
        {
            title: "Training Type",
            dataIndex: "training_type",
            render: (text, record) => {
                const labels = {
                    online: "Online",
                    offline: "Offline",
                }
                return <span>{labels[record.training_type] || record.training_type}</span>;
            }
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
                    <Button type="primary" size="small" onClick={() => Navigate("/edit-trainings/" + btoa(record.id))}><EyeFilled /></Button>

                    <Popconfirm
                        title="Do you really want to change the status ?"
                        onConfirm={() => change_status(record?.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button variant="solid" color="danger" size="small"> Change Status</Button>
                    </Popconfirm>


                </Space>
            ),
        },
    ];

    const fetchResults = useCallback((search_key, search_value) => {
        debounce(async () => {
            try {
                set_pagination_loader(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append(search_key, search_value);
                FORM_DATA.append("per_page", page_size);
                FORM_DATA.append("page", 1);
                const API_CALL = await LIST_TRAININGS(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_table_data(API_CALL?.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                    set_total_rows(API_CALL?.data?.total_rows);
                }
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                set_pagination_loader(false);
            }
        }, 500)(); // Call debounce immediately
    }, [page_size]);

    const handleInput = (e) => {
        const value = e.target.value;
        set_search_query_value(value)

        if (search_query_key === 'title ') {
            fetchResults('title ', value)
        }
        if (search_query_key === 'category') {
            fetchResults('category', value)
        }
        if (search_query_key === 'training_type') {
            fetchResults('training_type', value)
        }
    };

    const selectBefore = (
        <Select
            defaultValue="title"
            onChange={(value) => {
                if (value === 'title') {
                    set_search_query_key('title');
                    set_placeholder("Search by title");
                }
                if (value === 'category') {
                    set_search_query_key('category');
                    set_placeholder("Search by category");
                }
                if (value === 'training_type') {
                    set_search_query_key('training_type');
                    set_placeholder("Search by training_type");
                }
            }}
        >
            <Select.Option value="title">Title </Select.Option>
            <Select.Option value="category">Category</Select.Option>
            <Select.Option value="training_type">Training Type</Select.Option>
        </Select>
    );

    return (
        <div className='lms-body'>
            <Card>
                <Row>
                    <Col span={12}>
                        <h2>Upcoming Trainings</h2>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button color='green' variant='solid' onClick={() => Navigate("/add-trainings")}>Add New Training</Button>
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
                                        total={total_rows}
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

                            </>
                        )}
                    </>
                )}
            </Card>

        </div>

    );
}
