import React, { useEffect, useState } from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import { QUIZ_ANSWER_DETAILS } from "../../../../../apis/apis";
import { Col, Row, List, Tag, Collapse, Empty } from "antd";

const { Panel } = Collapse;

function QuizLearnerReportDetails(props) {
  const [loader, setLoader] = useState(true);
  const [learner, setLearner] = useState("");
  const [chapterData, setChapterData] = useState({});
  const [quizData, setQuizData] = useState({});
  
  

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", props.chapter_id);
      const API_CALL = await QUIZ_ANSWER_DETAILS(FORM_DATA);

      if (API_CALL?.data?.status) {
        setLearner(API_CALL?.data?.learner);
        setQuizData(API_CALL?.data?.data || {});
        setChapterData(API_CALL?.data?.chapter_data);
      } else {
        console.log("error");
      }
      setLoader(false);
    };
    LIST_API();
  }, [props.chapter_id]);


  const right_label = (option_details) => {
    const correctOption = option_details.find(opt => opt.value === true);
    return correctOption?.label
  }
  return (
    <>
      {loader ? (
        <CulsightPageLoader />
      ) : (
        <>
          {quizData && Object.keys(quizData).length > 0 ? (
            <>
              <Row style={{ marginBottom: "20px" }}>
                <Col span={24}>
                  <h3>Quiz Results</h3>
                </Col>
              </Row>

              {/* Accordion (Collapse) for Attempts */}
              <Collapse accordion bordered style={{ borderRadius: "10px" }}>
                {Object.keys(quizData).map((attemptKey, index) => (
                  <Panel
                    header={`Attempt ${index + 1}`}
                    key={attemptKey}
                  >
                    <List
                      itemLayout="vertical"
                      dataSource={quizData[attemptKey]}
                      renderItem={(item, idx) => (
                        <List.Item
                          key={item.question_id}
                         
                        >
                          <Row>
                            <Col span={22}>
                              <b>Q{idx + 1}:</b> {item.question}
                            </Col>
                            <Col
                              span={2}
                              style={{
                                textAlign: "right",
                                fontSize: "24px",
                              }}
                            >
                              {item.is_correct ? (
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                              ) : (
                                <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                              )}
                            </Col>
                          </Row>

                          <div style={{ marginTop: 10 }}>
                            {item.option_details?.map((opt, i) => (
                              <Tag
                                key={i}
                                color={
                                  opt.value
                                    ? "gold"
                                    : item.submitted && !opt.value
                                    ? "red"
                                    : "red"
                                }
                                style={{
                                  marginBottom: "6px",
                                  fontSize: "13px",
                                }}
                              >
                                {opt.label}
                              </Tag>
                            ))}
                          </div>

                          <div
                            style={{
                              marginTop: 8,
                              fontSize: "12px",
                              color: "#888",
                            }}
                          >
                            ⏱ Time Spent: {item.time_spend}s
                          </div>
                        {!item?.is_correct &&   <span style={{color:"green"}}><b>Right Answer:</b> {right_label(item.right_option_details)}</span>}
                        </List.Item>
                      )}
                    />
                  </Panel>
                ))}
              </Collapse>
            </>
          ) : (
            <Empty description="No Quiz Data Found" />
          )}
        </>
      )}
    </>
  );
}

export default QuizLearnerReportDetails;
