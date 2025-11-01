import { Card, Divider, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LiveTestDetails from "./LiveTestDetails"
import LiveTestQuestionView from "./LiveTestQuestionView"
import { ADD_LIVE_TEST_SUBMISSION, START_QUIZ_QUESTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

export default function LiveTest() {
  const { live_test_id } = useParams();
  const [show_options, set_show_options] = useState(true);
  const [quiz_test_id, set_quiz_test_id] = useState("");
  const [time_spend, set_time_spend] = useState("");
  const [submit_true, set_submit_true] = useState(false);
  const [button_loader, set_button_loader] = useState(false);
  const [quiz_title, set_quiz_title] = useState("");
  const [display_question, set_display_question] = useState(0);
 
  return (
    <div
      className="lms-body"
      style={{
        width: "100%",
        margin: "0 auto",
        marginTop: "0px",
        height:"100%",
        position:"absolute",
        boxSizing:"border-box"
        
      }}
    >
      {button_loader ? <>
        <CulsightPageLoader />
      </> : <>
        <Card
          style={{
            padding: "0px 25px 20px 25px",
            border: 0,
            boxShadow: "0 0 20px rgba(134, 134, 134, 0.3)",
            minHeight:"96vh"
          }}
        >
          <Divider
            variant="dotted"
            style={{
              borderColor: "rgb(125 246 253)",
              color: "rgb(125 246 253)",
              fontSize: "30px",
            }}
          >
            {quiz_title}
          </Divider>

          <LiveTestDetails
            show_options={show_options}
            set_show_options={set_show_options}
            set_quiz_test_id={set_quiz_test_id}
            live_test_id={live_test_id}
            set_time_spend={set_time_spend}
            time_spend={time_spend}
            submit_true={submit_true}
            display_question={display_question}
            set_quiz_title={set_quiz_title}
          />
          {quiz_test_id && 

          <LiveTestQuestionView
            set_submit_true={set_submit_true}
            time_spend={time_spend}
            live_test_id={live_test_id}
            set_display_question={set_display_question}
          />
          
          }
          
        </Card>

      </>}

    </div>
  );
}
