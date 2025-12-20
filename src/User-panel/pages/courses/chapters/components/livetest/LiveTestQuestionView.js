import React, { useEffect, useState } from "react";
import { Button, Card, Col, Popconfirm, Row, Tag, Grid } from "antd";
import {
  ADD_LIVE_TEST_ANSWERS,
  LIST_LIVE_TEST_QUESTION,
} from "../../../../../apis/apis";
import LiveTestQuestionOptions from "./LiveTestQuestionOptions";
import LiveTestQuestionOptionsRview from "./LiveTestQuestionOptionsRview";

const { useBreakpoint } = Grid;

const LiveTestQuestionView = (props) => {
  const { live_test_id, time_spend, set_submit_true, set_display_question } =
    props;
  const screens = useBreakpoint(); // 🔥 Responsive hook added

  const live_test_id_new = atob(live_test_id);
  const [items, setItems] = useState([]);
  const [show_result, set_show_result] = useState(false);
  const [question_id, set_question_id] = useState("");
  const [page_loader, set_page_loader] = useState(true);
  const [question_type, set_question_type] = useState("single_choice");
  const [option_details, set_option_details] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_questions, set_total_questions] = useState(0);
  const [test_submitted, set_test_submitted] = useState(false);
  const [review_questions, set_review_questions] = useState([]);
  const [rview_view, set_review_view] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("live_test_id", atob(props.live_test_id));
      FORM_DATA.append("page", current_page);

      const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
      if (LIST_API_RESPONSE?.data?.status) {
        const response_data = LIST_API_RESPONSE?.data;
        setItems(response_data?.data[0]);
        set_current_page(response_data?.current_page);
        set_question_id(response_data?.data[0]?.id);
        set_total_questions(response_data?.total_questions);
        set_display_question(response_data?.total_questions);
        set_question_type(response_data?.data[0]?.question_type);
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
  }, [current_page, props.quiz_test_id, props.live_test_id, rview_view]);

  // ================= SUBMIT DATA =================
  const submit_question = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("live_test_id", atob(props.live_test_id));
    FORM_DATA.append("submitted", 1);
    FORM_DATA.append("time_spend", time_spend);

    try {
      const API_RESPONSE = await ADD_LIVE_TEST_ANSWERS(FORM_DATA);
      if (API_RESPONSE?.data?.status) {
        set_test_submitted(true);
        set_current_page(1);
        set_submit_true(true);
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  // ================= UI =================

  return (
    <div style={{ marginTop: "20px", padding: screens.xs ? "10px" : "0px" }}>
      {test_submitted ? (
        <h3
          style={{
            padding: screens.xs ? "30px" : "50px",
            textAlign: "center",
            color: "green",
            border: "1px solid green",
            fontSize: screens.xs ? "24px" : "42px",
          }}
        >
          Test submitted <br />
          <Button type="primary" size="small" onClick={() => window.close()}>
            Close
          </Button>
        </h3>
      ) : (
        <>
          <Card style={{ width: "100%" }}>
            {/* REVIEW MODE */}
            {rview_view ? (
              <>
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "15px",
                    fontSize: screens.xs ? "20px" : "24px",
                  }}
                >
                  Review All Test Answer
                </h2>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24}>
                    {review_questions?.length > 0 &&
                      review_questions.map((item, index) => (
                        <div key={index}>
                          <h3
                            style={{
                              marginBottom: "20px",
                              marginTop: "20px",
                              fontSize: screens.xs ? "16px" : "20px",
                            }}
                          >
                            {`Q${index + 1}. ${item?.question_text}`}
                          </h3>

                          <LiveTestQuestionOptionsRview
                            live_test_id={live_test_id_new}
                            question_id={question_id}
                            options={JSON.parse(item.option_details)}
                            setOptions={set_option_details}
                            optionChoice={item.question_type}
                            submit_question={submit_question}
                          />
                        </div>
                      ))}

                    {/* Submit + Back Buttons */}
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        marginBottom: "15px",
                      }}
                    >
                      <Popconfirm
                        title="Submit Test"
                        okText="Cancel"
                        showCancel={false}
                        description={
                          <div>
                            <p>Are you sure you want to submit the test?</p>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px",
                                marginTop: "10px",
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
                      >
                        <Button type="primary">Submit</Button>
                      </Popconfirm>

                      <Button
                        style={{
                          marginLeft: "15px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          set_review_view(false);
                        }}
                      >
                        Back To Test
                      </Button>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                {/* MAIN QUESTION AREA */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={18}>
                    <h3
                      style={{
                        marginBottom: "20px",
                        fontSize: screens.xs ? "18px" : "22px",
                      }}
                    >
                      {`Q${current_page}. ${items?.question_title}`}
                    </h3>

                    <LiveTestQuestionOptions
                      live_test_id={live_test_id_new}
                      question_id={question_id}
                      options={option_details}
                      setOptions={set_option_details}
                      optionChoice={question_type}
                      submit_question={submit_question}
                    />
                  </Col>

                  {/* REVIEW SIDEBAR (moves below in mobile) */}
                  <Col xs={24} md={6}>
                    <h3 style={{ marginBottom: "10px" }}>Review Questions</h3>
                    <Card style={{ width: "100%" }}>
                      {review_questions?.map((item, index) => (
                        <Tag
                          key={index}
                          color={
                            current_page === item?.number
                              ? "#c9ac0ce0"
                              : item?.color === "green"
                              ? "#49aa19"
                              : item?.color
                          }
                          onClick={() => set_current_page(item.number)}
                          style={{
                            cursor: "pointer",
                            margin: "4px",
                            padding: screens.xs ? "4px 6px" : "6px 10px",
                            fontSize: screens.xs ? "10px" : "12px",
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

                {/* NAVIGATION BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: screens.xs ? "center" : "flex-start",
                    marginTop: "20px",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* PREVIOUS */}
                  {current_page > 1 ? (
                    <Button onClick={() => set_current_page(current_page - 1)}>
                      Previous
                    </Button>
                  ) : (
                    <Button disabled>Previous</Button>
                  )}

                  {/* NEXT OR SUBMIT */}
                  {current_page < total_questions ? (
                    <Button onClick={() => set_current_page(current_page + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Popconfirm
                      title="Submit Quiz Test"
                      okText="Cancel"
                      showCancel={false}
                      description={
                        <div>
                          <p>Are you sure you want to submit the test?</p>
                          <Button
                            type="primary"
                            size="small"
                            onClick={submit_question}
                          >
                            Yes
                          </Button>

                          <Button
                            size="small"
                            style={{ marginLeft: "10px" }}
                            onClick={() => set_review_view(true)}
                          >
                            Review
                          </Button>
                        </div>
                      }
                    >
                      <Button type="primary">Submit</Button>
                    </Popconfirm>
                  )}
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default LiveTestQuestionView;
