import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, List, Empty } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone, LeftOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { LIVE_TEST_SCORE } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";

function LiveTestResult(props) {
  const Navigate = useNavigate();
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


  const reviewQuestions = Array.isArray(liveTestData?.review_questions)
    ? liveTestData.review_questions
    : [];

  const correctCount = reviewQuestions.filter((q) => q.is_correct).length;
  const wrongCount = reviewQuestions.length - correctCount;


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

  const formatTime = (seconds = 0) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }
    else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    }
    else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hr ${remainingMinutes} min`;
    }
  };



  return (
    <div className="lms-body">
      <Card>
        {loader ? (
          <CulsightPageLoader />
        ) : liveTestData && Object.keys(liveTestData).length > 0 ? (
          <>

            <Row>
              <span style={{ cursor: "pointer" }} onClick={() => Navigate("/list-live-test")}> <LeftOutlined /> Go Back</span>

              <Col span={24} style={{ textAlign: "center" }}>

                <h2 style={{ color: "#e9c70ada" }}>
                  Live Test Result
                </h2>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={8}>
                <b>Total Questions:</b> <Tag color="gold">{reviewQuestions.length}</Tag>
              </Col>
              <Col span={8}>
                <b>Correct Answers:</b>{" "}
                <Tag color="green">{correctCount}</Tag>
              </Col>
              <Col span={8}>
                <b>Wrong Answers:</b>{" "}
                <Tag color="red">{wrongCount}</Tag>
              </Col>
              <Col span={8}>
                <b>Total Time:</b> {formatTime(liveTestData.total_time)}
              </Col>

              <Col span={8}>
                <b>Total Marks:</b> {liveTestData.total_marks || 0}
              </Col>
              <Col span={8}>
                <b>Total Score:</b> {liveTestData.total_score || 0}
              </Col>

            </Row>
            <Row>
              <Col span={24}>
                <Card style={{ height: "50px" }}>
                  <div style={{ display: "flex", marginTop: "-14px" }}>
                    <h3>Passing Status :</h3>
                    <Tag
                      color={liveTestData.passing_status ? "green" : "red"}
                      style={{
                        fontSize: "14px",
                        padding: "4px 16px",
                        borderRadius: "8px",
                        marginLeft:"30px"
                      }}
                    >
                      {liveTestData.passing_status ? "Passed" : "Failed"}
                    </Tag>
                  </div>
                </Card>
              </Col>
            </Row>

            {reviewQuestions.length > 0 ? (
              <List
                header={<b>Questions</b>}
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


                        <Col
                          span={24}
                          style={{ marginTop: 4, color: "green" }}
                        >
                          <b>Right Answer:</b> {item.correct_answer}
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
