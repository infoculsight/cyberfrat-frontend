import { Button, Col, message, Pagination, Row, Table, Spin, App } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { GENERATE_LIVE_TEST_RESULT, LIST_LIVE_SUBMISSION } from '../../../apis/apis';
import CulsightPageLoader from '../../../components/CulsightPageLoader';

function LiveTestReport(props) {
    const { model_row } = props
    const { notification } = App.useApp();
    const [loader, setLoader] = useState(true);
    const [dataSource, set_dataSource] = useState([])
    const [page_size, set_page_size] = useState(10)
    const [current_page, set_current_page] = useState(1);
    const [total_pages, set_total_pages] = useState(0);
    const [pagination_loader, set_pagination_loader] = useState(false);

    const formatDuration = (seconds) => {
        if (!seconds && seconds !== 0) return "";
        seconds = Math.floor(seconds);
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        let result = [];
        if (hrs > 0) result.push(`${hrs} hr${hrs > 1 ? "s" : ""}`);
        if (mins > 0) result.push(`${mins} min${mins > 1 ? "s" : ""}`);
        if (secs > 0 || result.length === 0) result.push(`${secs} sec${secs > 1 ? "s" : ""}`);
        return result.join(" ");
    };

    const columns = [
        { title: 'Rank', dataIndex: 'rank', render: () => 1 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Maximum Marks', render: (_, record) => record?.live_test_answer_submission_by_chapter?.total_marks },
        { title: 'Marks Obtained', render: (_, record) => record?.live_test_answer_submission_by_chapter?.total_score },
        { title: 'Correct', render: (_, record) => record?.live_test_answer_submission_by_chapter?.correct_answers },
        { title: 'Incorrect', render: (_, record) => record?.live_test_answer_submission_by_chapter?.wrong_answers },
        { title: 'Skipped', render: (_, record) => record?.live_test_answer_submission_by_chapter?.skip },
        { title: 'Total Time', render: (_, record) => <span>{formatDuration(record?.live_test_answer_submission_by_chapter?.time_spend)}</span> }
    ];

    const LIST_API = async (page = 1, perPage = page_size) => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append('id', model_row?.id);
        FORM_DATA.append('page', page);
        FORM_DATA.append('per_page', perPage);

        const API_CALL = await LIST_LIVE_SUBMISSION(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_dataSource(API_CALL.data?.data);
            set_current_page(API_CALL.data?.current_page);
            set_total_pages(API_CALL.data?.total_pages);
        } else {
            set_dataSource([]);
            set_current_page(1);
            set_total_pages(0);
        }
        setLoader(false);
    };

    useEffect(() => {
        if (model_row?.id) LIST_API(1, page_size);
    }, [model_row, page_size]);
    const handleGenerateResults = async () => {
        try {
            setLoader(true);

            const requests = dataSource
                .filter(record => record?.live_test_answer_submission_by_chapter)
                .map(record => {
                    const submission = record.live_test_answer_submission_by_chapter;

                    const formData = new FormData();
                    formData.append("learner_id", record.learner_id);
                    formData.append("live_test_id", model_row?.id);
                    formData.append("total_question", submission.total_question ?? 0);
                    formData.append("total_time", submission.time_spend ?? 0);
                    formData.append("total_marks", submission.total_marks ?? 0);
                    formData.append("correct_answers", submission.correct_answers ?? 0);
                    formData.append("wrong_answers", submission.wrong_answers ?? 0);
                    formData.append("total_score", submission.total_score ?? 0);
                    return GENERATE_LIVE_TEST_RESULT(formData);
                });

            if (!requests.length) {
                message.warning("No submissions found to generate results.");
                return;
            }

            const responses = await Promise.all(requests);

            notification.success({
                message: "Successful",
                description: "Live test results generated successfully.",
            });

        } catch (error) {
            console.error(error);
            message.error("Failed to generate results!");
        } finally {
            setLoader(false);
        }
    };


    const pagination_on_change = async (page, size) => {
        set_pagination_loader(true);
        await LIST_API(page, size);
        set_pagination_loader(false);
    };


    return (
        <div className='lms-body'>
            {loader ? <CulsightPageLoader /> : (
                <>
                    <Row>
                        <Col span={12}>
                            <h4><span style={{ color: "orange" }}>Test title: </span>{model_row?.title}</h4>
                            {/* <h4><span style={{ color: "orange" }}>Chapter title: </span>{model_row?.chapter_title}</h4>
                            <h4><span style={{ color: "orange" }}>Course title: </span>{model_row?.course_title}</h4> */}
                        </Col>
                        <Col span={12}>
                            <Button type="primary" style={{ float: "right" }} onClick={handleGenerateResults}>Generate Results</Button>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: "10px" }}>
                        <Col span={24}>
                            <Button style={{ float: "right", marginBottom: "15px" }}>Export as CSV</Button>
                        </Col>
                        <Col span={24}>
                            {pagination_loader ? (
                                <div style={{ textAlign: "center", padding: "60px" }}>
                                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                                </div>
                            ) : (
                                <>
                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        pagination={false}
                                    />
                                    {total_pages > 0 && (
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
                                                    LIST_API(1, size);
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
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </>
            )}
        </div>
    )
}

export default LiveTestReport
