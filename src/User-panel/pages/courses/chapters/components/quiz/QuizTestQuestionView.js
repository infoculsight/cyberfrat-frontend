import React, { useEffect, useState } from "react";
import { Button, Card, Popconfirm } from "antd";
import {
  ADD_QUIZ_ANSWER,
  List_QUIZ_QUESTION,
} from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import QuizTestQuestionOptions from "./QuizTestQuestionOptions";

const QuizTestQuestionView = (props) => {
  const { chapter_id , time_spend, set_submit_true} = props;
  const chapter_id_new = atob(chapter_id);
  const [items, setItems] = useState([]);
  const [question_id, set_question_id] = useState('');
  const [page_loader, set_page_loader] = useState(true);
  const [question_type, set_question_type] = useState("single_choice");
  const [option_details, set_option_details] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_questions, set_total_questions] = useState(0);
  const [test_submitted, set_test_submitted] = useState(false);

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
    
  }, [current_page, props.quiz_test_id, props.chapter_id]);

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
        set_submit_true(true)
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  

  return (
    <div style={{ marginTop: "20px" }}>
      {page_loader ? (
        <CulsightPageLoader />
      ) : (
        <>
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
            </h3>
          ) : (
            <>
              <Card>
                <h2>{`Ques ${current_page}. ${items?.question_text}`}</h2>

                <QuizTestQuestionOptions
                  chapter_id={chapter_id_new}
                  question_id={question_id}
                  options={option_details}
                  setOptions={set_option_details}
                  optionChoice={question_type}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
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
                    description="Are you sure want to submit Quiz test?"
                    onConfirm={submit_question}
                    // onCancel={cancel}
                    okText="Yes"
                    
                    cancelText="No"
                  >
                    <Button  variant="solid"
                      color="green">Submit</Button>
                  </Popconfirm>
                  )}
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuizTestQuestionView;
