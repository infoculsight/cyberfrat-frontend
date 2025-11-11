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
      setLoader(true);
      try {
        const FORM_DATA = new FormData();
        FORM_DATA.append("live_test_id", atob(live_test_id));
        const API_CALL = await LIVE_TEST_SCORE(FORM_DATA);

        if (API_CALL?.data?.status) {
          setLearner(API_CALL?.data?.learner || {});
          setLiveTestData(API_CALL?.data?.data || {});
        } else {
          console.error("Error fetching live test data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoader(false);
    };

    fetchLiveTestScore();
  }, [props.chapter_id, live_test_id]);

  // ✅ Safely extract review_questions
  const reviewQuestions = Array.isArray(liveTestData?.review_questions)
    ? liveTestData.review_questions
    : [];

  // ✅ Dynamically compute correct/wrong counts
  const correctCount = reviewQuestions.filter((q) => q.is_correct).length;
  const wrongCount = reviewQuestions.length - correctCount;

  // ✅ Helper to safely parse option details
  const parseOptions = (optionDetails) => {
    try {
      if (typeof optionDetails === "string") {
        const parsed = JSON.parse(optionDetails);
        return Array.isArray(parsed) ? parsed : [];
      } else if (Array.isArray(optionDetails)) {
        return optionDetails;
      }
      return [];
    } catch {
      return [];
    }
  };

  // ✅ Helper to find the correct label
  const rightLabel = (optionDetails) => {
    if (!Array.isArray(optionDetails)) return "—";
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
            {/* ✅ Summary section */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <b>Total Questions:</b> {reviewQuestions.length}
              </Col>
              <Col span={12}>
                <b>Total Marks:</b> {liveTestData.total_marks || 0}
              </Col>
              <Col span={12}>
                <b>Correct Answers:</b>{" "}
                <Tag color="green">{correctCount}</Tag>
              </Col>
              <Col span={12}>
                <b>Wrong Answers:</b>{" "}
                <Tag color="red">{wrongCount}</Tag>
              </Col>
              <Col span={12}>
                <b>Total Score:</b> {liveTestData.total_score || 0}
              </Col>
              <Col span={12}>
                <b>Total Time:</b> {liveTestData.total_time || 0}s
              </Col>
              <Col span={12}>
                <b>Passing Status:</b>{" "}
                <Tag color={liveTestData.passing_status ? "green" : "red"}>
                  {liveTestData.passing_status ? "Passed" : "Failed"}
                </Tag>
              </Col>
            </Row>

            {/* ✅ Question-wise Details */}
            {reviewQuestions.length > 0 ? (
              <List
                header={<b>Question-wise Details</b>}
                dataSource={reviewQuestions}
                renderItem={(item, idx) => {
                  const optionDetails = parseOptions(item.option_details);

                  return (
                    <List.Item key={idx}>
                      <Row style={{ width: "100%" }}>
                        {/* Question Text + Status */}
                        <Col span={22}>
                          <b>Q{item.number}:</b> {item.question_text}
                        </Col>
                        <Col
                          span={2}
                          style={{
                            textAlign: "right",
                            fontSize: 24,
                          }}
                        >
                          {item.is_correct ? (
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                          ) : (
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                          )}
                        </Col>

                        {/* Options */}
                        <Col span={24} style={{ marginTop: 8 }}>
                          {optionDetails.length > 0 ? (
                            optionDetails.map((opt, i) => (
                              <Tag
                                key={i}
                                color={opt.value ? "gold" : "default"}
                                style={{ marginBottom: 6, fontSize: 13 }}
                              >
                                {opt.label?.trim() || "—"}
                              </Tag>
                            ))
                          ) : (
                            <Tag color="default">No Options</Tag>
                          )}
                        </Col>

                        {/* Correct Answer (Derived) */}
                        <Col
                          span={24}
                          style={{ marginTop: 4, color: "green" }}
                        >
                          <b>Right Answer:</b> {rightLabel(optionDetails)}
                        </Col>

                    
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
