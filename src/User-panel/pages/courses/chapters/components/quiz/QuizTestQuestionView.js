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
        set_review_questions(response_data?.review_questions)
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
        set_attempted_questions((prev) => [...new Set([...prev, current_page])]);
        set_test_submitted(true);
        set_current_page(1);
        set_submit_true(true)
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };



  return (
    <div style={{ marginTop: "20px" }}>
      {show_result ? <> <QuizResult chapter_id={chapter_id} /></> : <>
      {test_submitted ? (
        <h3
          style={{
            padding: "50px",
            textAlign: "center",
            color: "green",
            border: "1px solid green",
            fontSize: "42px",
          }}
        >
          Quiz Test submitted <br></br>
          <Button type="primary" size="small" onClick={() => window.close()}>Close</Button>
           <Button
                    type="primary"
                    size="small"
                    onClick={() => set_show_result(true)}
                  >
                    View Result
                  </Button>
        </h3>
      ) : (
        <>
          <Card>
            {rview_view ? <>
              <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Review All Quiz Answer</h2>
              <Row gutter={20}>
                <Col span={24}>
                  {review_questions?.length > 0 && review_questions.map((item, index) => (
                    <>
                      <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>{`Ques ${index + 1}. ${items?.question_text}`}</h3>
                      <QuizTestQuestionOptionsRview
                        chapter_id={chapter_id_new}
                        question_id={question_id}
                        options={option_details}
                        setOptions={set_option_details}
                        optionChoice={question_type}
                        onAnswerSubmitted={() =>
                          set_attempted_questions((prev) => [...new Set([...prev, current_page])])
                        }
                      />
                    </>
                  ))}
                  <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "15px" }}>
                    <Popconfirm
                      title="Submit Quiz Test"
                      description={
                        <div>
                          <p>Are you sure you want to submit the Quiz test?</p>
                          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                            <Button
                              type="primary"
                              size="small"
                              onClick={submit_question}
                            >
                              Yes
                            </Button>
                            <Button
                              danger
                              size="small"
                              onClick={(e) => e.stopPropagation()} // just closes popconfirm
                            >
                              No
                            </Button>

                          </div>
                        </div>
                      }
                      showCancel={false} // hide default cancel button
                    >
                      <Button variant="solid" color="green">
                        Submit
                      </Button>

                    </Popconfirm>
                    <Button

                      variant="solid" color="#c9ac0ce0" style={{ marginLeft: "15px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        set_review_view(false)
                      }}
                    >
                      Back To Quiz
                    </Button>

                  </div>
                </Col>
              </Row>
            </> : <>
              <Row gutter={20}>
                <Col span={18}>
                  <h3 style={{ marginBottom: "20px" }}>{`Ques ${current_page}. ${items?.question_text}`}</h3>
                  <QuizTestQuestionOptions
                    chapter_id={chapter_id_new}
                    question_id={question_id}
                    options={option_details}
                    setOptions={set_option_details}
                    optionChoice={question_type}
                    onAnswerSubmitted={() =>
                      set_attempted_questions((prev) => [...new Set([...prev, current_page])])
                    }
                  />
                </Col>
                <Col span={6}>
                  <h3 style={{ marginBottom: "20px" }}>Review Questions</h3>
                  <Card style={{ height: "100%", width: "100%", marginLeft: "5px" }}>
                    {review_questions?.length > 0 && review_questions.map((item, index) => (
                      <Tag
                        key={index}
                        color={current_page === item?.number ? "#c9ac0ce0" : item?.color === "green" ? "#49aa19" : item?.color}
                        onClick={() =>
                          set_current_page(item.number)
                        }
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          margin: "4px",
                        }}
                      >
                        {item?.color === 'white' ? <>
                          <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "bold" }}>Q{item.number}</span>
                        </> : <>
                          <span style={{ color: "rgba(255, 255, 255, 1)", fontWeight: "bold" }}>Q{item.number}</span>
                        </>}

                      </Tag>
                    ))}
                    <hr />
                    <div style={{ fontSize: "12px" }}>

                      <span style={{ fontSize: "14px", display: "inline-block", marginBottom: "10px" }}> Guide Color</span> <br></br>
                      <span style={{ backgroundColor: "white", color: "black", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px", marginBottom: "5px", display: "inline-block" }}>Q</span> Not Answered<br></br>
                      <span style={{ backgroundColor: "#49aa19", color: "white", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px", marginBottom: "5px", display: "inline-block" }}>Q</span> Answered<br></br>
                      <span style={{ backgroundColor: "#c9ac0ce0", color: "white", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px", marginBottom: "5px", display: "inline-block" }}>Q</span> Current Question
                    </div>
                  </Card>




                </Col>
              </Row>


              <div
                style={{
                  display: "flex",
                  marginTop: "15px",
                  paddingLeft: "370px",
                  gap: "20px",
                }}
              >
                {current_page > 1 ? (
                  <Button
                    variant="solid"
                    color="black"
                    onClick={() =>
                      set_current_page(parseInt(current_page) - 1)
                    }
                  >
                    Previous
                  </Button>
                ) : (
                  <Button disabled variant="solid" color="green">
                    Previous
                  </Button>
                )}

                {current_page >= 1 && current_page < total_questions ? (
                  <Button
                    variant="solid"
                    color="orange"
                    onClick={() =>
                      set_current_page(
                        parseInt(current_page) + 1 !== current_page &&
                        parseInt(current_page) + 1
                      )
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Popconfirm
                    title="Submit Quiz Test"
                    description={
                      <div>
                        <p>Are you sure you want to submit the Quiz test?</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={submit_question}
                          >
                            Yes
                          </Button>
                         
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              set_review_view(true)
                            }}
                          >
                            Review
                          </Button>
                           <Button
                           type="primary"
                            danger
                            size="small"
                            onClick={(e) => e.stopPropagation()} // just closes popconfirm
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    }
                    showCancel={false} // hide default cancel button
                  >
                    <Button variant="solid" color="green">
                      Submit
                    </Button>
                  </Popconfirm>

                )}
              </div>
            </>}
          </Card>
        </>
      )}
      </>}
    </div>
  );
};

export default QuizTestQuestionView;
