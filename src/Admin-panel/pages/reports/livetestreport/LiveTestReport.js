import { Button, Col, message, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { GENERATE_LIVE_TEST_RESULT, LIST_LIVE_SUBMISSION } from '../../../apis/apis';
import CulsightPageLoader from '../../../components/CulsightPageLoader';

function LiveTestReport(props) {
    const { model_row } = props
    const [loader, setLoader] = useState(true);
    const [dataSource, set_dataSource] = useState([])

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
        {
            title: 'Rank',
            dataIndex: 'rank',
            render: (text, record) => 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Maximum Marks',
            render: (text, record) => record?.live_test_answer_submission_by_chapter?.total_marks

        },
        {
            title: 'Marks Obtained',
            render: (text, record) => record?.live_test_answer_submission_by_chapter?.total_score
        },
        {
            title: 'Correct',
            render: (text, record) => record?.live_test_answer_submission_by_chapter?.correct_answers
        },
        {
            title: 'Incorrect',
            render: (text, record) => record?.live_test_answer_submission_by_chapter?.wrong_answers
        },
        {
            title: 'Skipped',
            render: (text, record) => record?.live_test_answer_submission_by_chapter?.skip
        },
        {
            title: 'Total Time',
            render: (text, record) =>(
                <span>{formatDuration( record?.live_test_answer_submission_by_chapter?.time_spend) }</span>) 
        }
    ];

    useEffect(() => {
        const LIST_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append('id', model_row?.id);
            const API_CALL = await LIST_LIVE_SUBMISSION(FORM_DATA);
            if (API_CALL?.data?.status) {
                set_dataSource(API_CALL?.data?.data);
                setLoader(false);
            } else {
                console.log("error");
                setLoader(false);
            }
        };

        LIST_API();
    }, [model_row]);

    const handleGenerateResults = async () => {
        try {
            setLoader(true);
            for (let record of dataSource) {
                const submission = record?.live_test_answer_submission_by_chapter;
                if (!submission) continue;
                const formData = new FormData();
                formData.append("learner_id", record?.learner_id);
                formData.append("live_test_id", model_row?.id);
                formData.append("total_question", submission?.total_question ?? 0);
                formData.append("total_time", submission?.time_spend ?? 0);
                formData.append("total_marks", submission?.total_marks ?? 0);
                formData.append("correct_answers", submission?.correct_answers ?? 0);
                formData.append("wrong_answers", submission?.wrong_answers ?? 0);
                formData.append("total_score", submission?.total_score ?? 0);
                await GENERATE_LIVE_TEST_RESULT(formData);
            }
            message.success("Results generated successfully!");
        } catch (error) {
            console.error(error);
            message.error("Failed to generate results!");
        } finally {
            setLoader(false);
        }
    };
    return (
        <div className='lms-body'>

            {loader ? <CulsightPageLoader /> : <>
                <Row>
                    <Col span={12}>
                        <h4><span style={{ color: "orange" }}>Test title: </span>{model_row?.title}</h4>
                        <h4><span style={{ color: "orange" }}>Chapter title: </span>{model_row?.chapter_title}</h4>
                        <h4><span style={{ color: "orange" }}>Course title: </span>{model_row?.course_title}</h4>

                    </Col>
                    <Col span={12}>
                        <Button type="primary" style={{ float: "right" }} onClick={handleGenerateResults}>Generate Results</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Button style={{ float: "right", marginBottom: "15px" }}>Export as CSV</Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                        />
                    </Col>
                </Row>
            </>}
        </div>
    )
}

export default LiveTestReport
