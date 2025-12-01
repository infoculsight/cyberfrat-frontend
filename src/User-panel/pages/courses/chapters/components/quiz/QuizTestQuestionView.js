import React, { useEffect, useState } from "react";
import { Button, Card, Col, Popconfirm, Row, Tag } from "antd";
import {
  ADD_QUIZ_ANSWER,
  List_QUIZ_QUESTION,
} from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import QuizTestQuestionOptions from "./QuizTestQuestionOptions";
import QuizTestQuestionOptionsRview from "./QuizTestQuestionOptionsRview";
import QuizResult from "./QuizResult";

const QuizTestQuestionView = (props) => {
  const { chapter_id, time_spend, set_submit_true } = props;
  const chapter_id_new = atob(chapter_id);
  const [items, setItems] = useState([]);
  const [show_result, set_show_result] = useState(false);
  const [question_id, set_question_id] = useState('');
  const [page_loader, set_page_loader] = useState(true);
  const [question_type, set_question_type] = useState("single_choice");
  const [option_details, set_option_details] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_questions, set_total_questions] = useState(0);
  const [test_submitted, set_test_submitted] = useState(false);
  const [attempted_questions, set_attempted_questions] = useState([]);
  const [review_questions, set_review_questions] = useState([]);
  const [rview_view, set_review_view] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(props.chapter_id));
      FORM_DATA.append("quiz_test_id", props.quiz_test_id);
      FORM_DATA.append("page", current_page);

      const LIST_API_RESPONSE = await List_QUIZ_QUESTION(FORM_DATA);
      if (LIST_API_RESPONSE?.data?.status) {
        const response_data = LIST_API_RESPONSE?.data;
        setItems(response_data?.data[0]);
        set_current_page(response_data?.current_page);
        set_question_id(response_data?.data[0]?.id);
        set_total_questions(response_data?.total_questions);
        set_question_type(response_data?.data[0]?.type);
        set_review_questions(response_data?.review_questions);
        const options = response_data?.data[0]?.option_details
          ? JSON.parse(response_data?.data[0]?.option_details).map((opt) => ({
            ...opt,
            selected: opt.selected ?? false,
          }))
          : [];
        set_option_details(options);
        set_page_loader(false);
      }
    };
    fetchData();
  }, [current_page, props.quiz_test_id, props.chapter_id, rview_view]);

  const submit_question = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(props.chapter_id));
    FORM_DATA.append("submitted", 1);
    FORM_DATA.append("time_spend", time_spend);
    try {
      const API_RESPONSE = await ADD_QUIZ_ANSWER(FORM_DATA);
      if (API_RESPONSE?.data?.status) {
        set_test_submitted(true);
        set_current_page(1);
        set_submit_true(true);
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  if (page_loader) {
    return <CulsightPageLoader />;
  }

  return (
    <div style={{ marginTop: 20 }}>
      {show_result ? (
        <QuizResult chapter_id={chapter_id} />
      ) : test_submitted ? (
        <div
          style={{
            padding: 50,
            textAlign: "center",
            color: "green",
            border: "1px solid green",
            fontSize: 42,
          }}
        >
          Quiz Test submitted <br />
          <Button type="primary" size="small" onClick={() => window.close()}>
            Close
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 15 }}
            onClick={() => set_show_result(true)}
          >
            View Result
          </Button>
        </div>
      ) : (
        <Card>
          {rview_view ? (
            <>
              <h2 style={{ textAlign: "center", marginBottom: 15 }}>
                Review All Quiz Answer
              </h2>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  {review_questions?.map((item, index) => (
                    <div key={index} style={{ marginBottom: 20 }}>
                      <h3>{`Ques ${index + 1}. ${item?.question_text}`}</h3>
                      <QuizTestQuestionOptionsRview
                        chapter_id={chapter_id_new}
                        question_id={question_id}
                        options={JSON.parse(item.option_details)}
                        setOptions={set_option_details}
                        optionChoice={question_type}
                      />
                    </div>
                  ))}
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      marginBottom: 15,
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <Popconfirm
                      title="Submit Quiz Test"
                      okText="Cancel"
                      description={
                        <div>
                          <p>Are you sure you want to submit the Quiz test?</p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 8,
                              marginTop: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              type="primary"
                              size="small"
                              onClick={submit_question}
                            >
                              Yes
                            </Button>
                          </div>
                        </div>
                      }
                      showCancel={false}
                    >
                      <Button variant="solid" color="green">
                        Submit
                      </Button>
                    </Popconfirm>
                    <Button
                      variant="solid"
                      color="#c9ac0ce0"
                      onClick={() => set_review_view(false)}
                    >
                      Back To Quiz
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={18}>
                  <h3 style={{ marginBottom: 20 }}>{`Ques ${current_page}. ${items?.question_text}`}</h3>
                  <QuizTestQuestionOptions
                    chapter_id={chapter_id_new}
                    question_id={question_id}
                    options={option_details}
                    setOptions={set_option_details}
                    optionChoice={question_type}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <h3 style={{ marginBottom: 20 }}>Review Questions</h3>
                  <Card style={{ width: "100%", marginLeft: 0, height: "100%" }}>
                    {review_questions?.map((item, index) => (
                      <Tag
                        key={index}
                        color={current_page === item?.number ? "#c9ac0ce0" : item?.color === "green" ? "#49aa19" : item?.color}
                        onClick={() => set_current_page(item.number)}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          margin: 4,
                        }}
                      >
                        <span
                          style={{
                            color: item?.color === 'white' ? "black" : "white",
                            fontWeight: "bold",
                          }}
                        >
                          Q{item.number}
                        </span>
                      </Tag>
                    ))}
                    <hr />
                    <div style={{ fontSize: 12 }}>
                      <span style={{ fontSize: 14, display: "inline-block", marginBottom: 10 }}> Guide Color</span> <br />
                      <span style={{ backgroundColor: "white", color: "black", fontSize: 10, fontWeight: "bold", padding: "3px 8px", borderRadius: 4, marginBottom: 5, display: "inline-block" }}>Q</span> Not Answered<br />
                      <span style={{ backgroundColor: "#49aa19", color: "white", fontSize: 10, fontWeight: "bold", padding: "3px 8px", borderRadius: 4, marginBottom: 5, display: "inline-block" }}>Q</span> Answered<br />
                      <span style={{ backgroundColor: "#c9ac0ce0", color: "white", fontSize: 10, fontWeight: "bold", padding: "3px 8px", borderRadius: 4, marginBottom: 5, display: "inline-block" }}>Q</span> Current Question
                    </div>
                  </Card>
                </Col>
              </Row>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: 15,
                  gap: 20,
                }}
              >
                <Button
                  variant="solid"
                  color="black"
                  disabled={current_page <= 1}
                  onClick={() => set_current_page(parseInt(current_page) - 1)}
                >
                  Previous
                </Button>

                {current_page < total_questions ? (
                  <Button
                    variant="solid"
                    color="orange"
                    onClick={() => set_current_page(parseInt(current_page) + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Popconfirm
                    title="Submit Quiz Test"
                    okText="Cancel"
                    description={
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <p>Are you sure you want to submit the Quiz test?</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Button type="primary" size="small" onClick={submit_question}>
                            Yes
                          </Button>
                          <Button variant="solid" color="green" size="small" onClick={() => set_review_view(true)}>
                            Review
                          </Button>
                        </div>
                      </div>
                    }
                    showCancel={false}
                  >
                    <Button variant="solid" color="green">
                      Submit
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default QuizTestQuestionView;
