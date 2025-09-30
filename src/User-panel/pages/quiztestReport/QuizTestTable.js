import React, { useCallback, useEffect, useState } from 'react';
import { Table, Card, Row, Col, Input, Pagination, Spin } from 'antd';
import { CHAPTER_QUIZ_WITH_SCORE } from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';
import debounce from 'lodash.debounce';
import { LoadingOutlined } from "@ant-design/icons";

function QuizTestTable() {
    const [loader, setLoader] = useState(false);
    const [test_table_data, set_test_table_data] = useState([]);
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [current_page, set_current_page] = useState(1);
    const [total_pages, set_total_pages] = useState(0);
    const [total_courses, set_total_courses] = useState(0);
    const [search_query_title, set_search_query_title] = useState("");

    const LIST_API = async () => {
        setLoader(true);
        const FORM_DATA = new FormData();
        const API_CALL = await CHAPTER_QUIZ_WITH_SCORE(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_test_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_courses(API_CALL?.data?.total_courses);
            setLoader(false);
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
            title: "Course Name",
            dataIndex: "course_name",
            render: (text, record) => <span>{record.course_name}</span>,
        },
        {
            title: "Chapter Name",
            dataIndex: "chapter_name",
            render: (text, record) => <span>{record.chapter_name}</span>,
        },
        {
            title: "Total Marks",
            dataIndex: "total_marks",
            render: (text, record) => <span>{record.total_marks}</span>,
        },
        {
            title: "Total Score",
            dataIndex: "total_score",
            render: (text, record) => <span>{record.total_score}</span>,
        },
        {
            title: "Percentage",
            dataIndex: "percentage",
            render: (text, record) => <span>{record.percentage}</span>,
        },
        {
            title: "Status",
            key: "status",
            render: (text, record) => <span>{record.status}</span>,
        },
    ];

    const pagination_on_change = async (data) => {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("title", search_query_title);
        const API_CALL = await CHAPTER_QUIZ_WITH_SCORE(FORM_DATA);

        if (API_CALL?.data?.status) {
            set_test_table_data(API_CALL.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_courses(API_CALL?.data?.total_courses);
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
                FORM_DATA.append("title", value);
                const API_CALL = await CHAPTER_QUIZ_WITH_SCORE(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_test_table_data(API_CALL.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                    set_total_courses(API_CALL?.data?.total_courses);
                    set_pagination_loader(false);
                } else {
                    set_pagination_loader(false);
                }
            } catch (err) {
                console.error("API Error:", err);
            }
        }, 500)();
    }, []);

    const handleInput = (e) => {
        const value = e.target.value;
        fetchResultsTitle(value);
    };

    return (
        <div className="lms-body">
            <Card title="Quiz Test Report">
                {loader ? (
                    <CulsightPageLoader />
                ) : (
                    <>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={24} md={18} lg={20}>
                                <Input
                                    addonBefore={<span>Title</span>}
                                    placeholder="Search by title"
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={handleInput}
                                />
                            </Col>
                        </Row>

                        {pagination_loader ? <>
                            <div style={{ textAlign: "center", padding: "60px" }}>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </div>
                        </> : <>
                            <Table
                                style={{ marginTop: "15px" }}
                                columns={columns}
                                dataSource={test_table_data}
                                pagination={false}
                                rowKey={(record, index) => index}
                            />
                        </>}


                    </>
                )}

                <div style={{ float: "right", marginTop: "20px" }}>
                    {total_pages > 0 && <>
                        <Pagination
                            current={current_page}
                            total={total_courses}
                            pageSize={1}
                            onChange={pagination_on_change}
                        />

                    </>}

                </div>
            </Card>
        </div>
    );
}

export default QuizTestTable;
