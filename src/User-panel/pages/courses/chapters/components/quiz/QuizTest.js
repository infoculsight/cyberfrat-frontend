import { Card, Divider, Button, Spin } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import QuizTestDetails from "./QuizTestDetails";
import QuizTestQuestionView from "./QuizTestQuestionView";
import { START_QUIZ_QUESTION } from "../../../../../apis/apis";

export default function QuizTest() {
  const { chapter_id } = useParams();
  const [show_options, set_show_options] = useState(false);
  const [quiz_test_id, set_quiz_test_id] = useState("");
  const [time_spend, set_time_spend] = useState("");
  const [submit_true, set_submit_true] = useState(false);
  const [call_list, set_call_list] = useState(false);
  const [para_show, set_para_show] = useState(true);
   const [button_loader, set_button_loader] = useState(false);
  const [quiz_title, set_quiz_title] = useState("");

  const enableSecurity = () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } catch (err) {
      console.warn("Fullscreen failed:", err);
    }

    // Disable right-click
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Disable dangerous keys
    const disableKeys = (e) => {
      if (
        e.key === "F11" ||
        e.key === "Escape" ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Blocked:", e.key);
      }
    };
    document.addEventListener("keydown", disableKeys);

    // Disable copy/paste/select
    const disableCopy = (e) => e.preventDefault();
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("paste", disableCopy);
    document.addEventListener("selectstart", disableCopy);
  };

  const check_quiz_status = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(chapter_id));
    try {
      const API_CALL = await START_QUIZ_QUESTION(FORM_DATA);

      if (API_CALL?.data?.status) {
        if (API_CALL?.data?.answer_sumission_count > 0) {
          set_call_list(true); // Pehle attempt hua hai
        } else {
          set_call_list(false); // Pehli baar attempt ho raha hai
        }
        return true; // Quiz available
      } else {
        return false; // Quiz available nahi
      }
    } catch (error) {
      return false;
    }
  };

  // ✅ ab async banaya + 3 sec delay lagayi
  const handleStartTest = async () => {
    set_button_loader(true)
    const status = await check_quiz_status();
    if (status) {
      setTimeout(() => {
        enableSecurity();
        set_para_show(false)
        set_show_options(true);
      }, 3000); // 3 second delay
    } else {
      alert("Connect with Admin");
    }
  };

  return (
    <div
      className="lms-body"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        marginTop: "60px",
      }}
    >
      <Card
        style={{
          padding: "0px 25px 20px 25px",
          border: 0,
          boxShadow: "0 0 20px rgba(134, 134, 134, 0.3)",
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

        <QuizTestDetails
          show_options={show_options}
          set_show_options={set_show_options}
          set_quiz_test_id={set_quiz_test_id}
          chapter_id={chapter_id}
          set_time_spend={set_time_spend}
          submit_true={submit_true}
          set_quiz_title={set_quiz_title}
          para_show={para_show}
        />
    
        {!show_options && quiz_test_id ? (
          <div style={{ textAlign: "center" }}>
            {button_loader ? <><Button disabled type="primary">
              Start Test <Spin />
            </Button></> :<>
            <Button onClick={handleStartTest} type="primary">
              Start Test
            </Button>
            </>}
          </div>
        ) : null}
       
        {show_options && (
          <QuizTestQuestionView
            call_list={call_list}
            set_submit_true={set_submit_true}
            time_spend={time_spend}
            chapter_id={chapter_id}
            quiz_test_id={quiz_test_id}
          />
        )}
      </Card>
    </div>
  );
}
