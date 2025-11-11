import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, List, Empty } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { LIVE_TEST_SCORE } from "../../apis/apis";
import { useParams } from "react-router-dom";

function LiveTestResult(props) {
    const { live_test_id } = useParams();
    const [loader, setLoader] = useState(true);
    const [learner, setLearner] = useState({});
    const [liveTestData, setLiveTestData] = useState({});

    useEffect(() => {
        const fetchLiveTestScore = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("live_test_id", atob(live_test_id));
            const API_CALL = await LIVE_TEST_SCORE(FORM_DATA);

            if (API_CALL?.data?.status) {
                setLearner(API_CALL?.data?.learner || {});
                setLiveTestData(API_CALL?.data?.data || {});
            } else {
                console.log("Error fetching live test data");
            }
            setLoader(false);
        };
        fetchLiveTestScore();
    }, [props.chapter_id, live_test_id]);

    // ✅ Helper to find the correct option label
    const rightLabel = (optionDetails) => {
        if (!Array.isArray(optionDetails)) return "";
        const correctOption = optionDetails.find((opt) => opt.value === true);
        return correctOption?.label || "—";
    };

    return (
        <div className="lms-body">
            <Card>
                {loader ? (
                    <CulsightPageLoader />
                ) : liveTestData && Object.keys(liveTestData).length > 0 ? (
                    <>
                        {/* Summary section */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                            <Col span={12}>
                                <b>Total Questions:</b> {liveTestData.total_question}
                            </Col>
                            <Col span={12}>
                                <b>Total Marks:</b> {liveTestData.total_marks}
                            </Col>
                            <Col span={12}>
                                <b>Correct Answers:</b>{" "}
                                <Tag color="green">{liveTestData.correct_answers}</Tag>
                            </Col>
                            <Col span={12}>
                                <b>Wrong Answers:</b>{" "}
                                <Tag color="red">{liveTestData.wrong_answers}</Tag>
                            </Col>
                            <Col span={12}>
                                <b>Total Score:</b> {liveTestData.total_score}
                            </Col>
                            <Col span={12}>
                                <b>Total Time:</b> {liveTestData.total_time}s
                            </Col>
                            <Col span={12}>
                                <b>Passing Status:</b>{" "}
                                <Tag color={liveTestData.passing_status ? "green" : "red"}>
                                    {liveTestData.passing_status ? "Passed" : "Failed"}
                                </Tag>
                            </Col>
                        </Row>

                        {/* Question-wise review */}
                        {liveTestData.review_questions &&
                            liveTestData.review_questions.length > 0 ? (
                            <List
                                header={<b>Question-wise Details</b>}
                                dataSource={liveTestData.review_questions}
                                renderItem={(item, idx) => {
                                    let optionDetails = [];

                                    
                                    try {
                                        if (typeof item.option_details === "string") {
                                            const parsed = JSON.parse(item.option_details);
                                            optionDetails = Array.isArray(parsed) ? parsed : [];
                                        } else if (Array.isArray(item.option_details)) {
                                            optionDetails = item.option_details;
                                        } else {
                                            optionDetails = [];
                                        }
                                    } catch (err) {
                                        optionDetails = [];
                                    }

                                    return (
                                        <List.Item key={idx}>
                                            <Row style={{ width: "100%" }}>
                                                <Col span={22}>
                                                    <b>Q{item.number}:</b> {item.question_text}
                                                </Col>
                                                <Col span={2} style={{ textAlign: "right", fontSize: 24 }}>
                                                    {item.is_correct ? (
                                                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                                                    ) : (
                                                        <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                                                    )}
                                                </Col>

                                                <Col span={24} style={{ marginTop: 8 }}>
                                                    {optionDetails.length > 0 ? (
                                                        optionDetails.map((opt, i) => (
                                                            <Tag
                                                                key={i}
                                                                color={opt.value ? "gold" : "default"}
                                                                style={{ marginBottom: 6, fontSize: 13 }}
                                                            >
                                                                {opt.label || "—"}
                                                            </Tag>
                                                        ))
                                                    ) : (
                                                        <Tag color="default">No Options</Tag>
                                                    )}
                                                </Col>

                                                {/* ✅ Display correct answer */}
                                                <Col span={24} style={{ marginTop: 4, color: "green" }}>
                                                    <b>Right Answer:</b>{" "}
                                                    {(() => {
                                                        const correct = optionDetails.find((opt) => opt.value === true);
                                                        return correct ? correct.label : "—";
                                                    })()}
                                                </Col>

                                                {/* ✅ Optional backend correct answer */}
                                                {item.correct_answer && Array.isArray(item.correct_answer) && (
                                                    <Col span={24} style={{ marginTop: 4, color: "#1890ff" }}>
                                                        <b>API Correct Answer:</b> {item.correct_answer.join(", ")}
                                                    </Col>
                                                )}
                                            </Row>
                                        </List.Item>
                                    );
                                }}
                            />

                        ) : (
                            <Empty description="No Question Review Data" />
                        )}
                    </>
                ) : (
                    <Empty description="No Live Test Data Found" />
                )}
            </Card>
        </div>
    );
}

export default LiveTestResult;
