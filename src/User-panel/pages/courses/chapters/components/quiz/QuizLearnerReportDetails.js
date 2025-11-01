import React, { useEffect, useState } from "react";
import { LeftOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import { QUIZ_ANSWER_DETAILS } from "../../../../../apis/apis";
import { Col, Row, Card, List, Tag } from "antd";
import { useParams } from "react-router-dom";

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
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };
    LIST_API();
  }, []);

  return (
    <>
      {loader ? (
        <CulsightPageLoader />
      ) : (
        <>
        
        <Card>
          <Row style={{ marginBottom: "20px" }}>
            <Col span={24}>
              <h2>
                {learner?.first_name} {learner?.last_name} ({learner?.email})
              </h2>
              <h3>Chapter Title : {chapterData?.title}</h3>
            </Col>
          </Row>

          {/* Attempts List */}
          {Object.keys(quizData)?.map((attemptKey, index) => (
            <Card
              key={attemptKey}
              title={`Attempt ${index + 1}`}
              style={{ marginBottom: "20px", borderRadius: "12px" }}
              bordered={true}
            >
              <List
                itemLayout="vertical"
                dataSource={quizData[attemptKey]}
                renderItem={(item, idx) => (
                  <List.Item
                    key={item.question_id}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      padding: "12px",
                    }}
                  >
                    <Row>
                      <Col span={22}>
                        <b>Q{idx + 1}:</b> {item.question}
                      </Col>
                      <Col span={2} style={{ textAlign: "right", fontSize:"24px" }}>
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
                              ? "green"
                              : item.submitted && !opt.value
                              ? "red"
                              : "default"
                          }
                          style={{ marginBottom: "6px" }}
                        >
                          {opt.label}
                        </Tag>
                      ))}
                    </div>

                    <div style={{ marginTop: 8, fontSize: "12px", color: "#888" }}>
                      ⏱ Time Spent: {item.time_spend}s
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          ))}
          </Card>
        </>
      )}
      
    </>
  );
}

export default QuizLearnerReportDetails;