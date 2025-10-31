import { Card, Divider, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizTestDetails from "./QuizTestDetails";
import QuizTestQuestionView from "./QuizTestQuestionView";
import { START_QUIZ_QUESTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

export default function QuizTest() {
  const { chapter_id } = useParams();
  const [show_options, set_show_options] = useState(false);
  const [quiz_test_id, set_quiz_test_id] = useState("");
  const [time_spend, set_time_spend] = useState("");
  const [submit_true, set_submit_true] = useState(false);
  const [first_attempt, set_first_attempt] = useState(true);
  const [button_loader, set_button_loader] = useState(true);
  const [quiz_title, set_quiz_title] = useState("");

  // const enableSecurity = () => {
  //   const elem = document.documentElement;
  //   try {
  //     if (elem.requestFullscreen) elem.requestFullscreen();
  //     else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  //     else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  //   } catch (err) {
  //     console.warn("Fullscreen failed:", err);
  //   }

  //   // Disable right-click
  //   const disableRightClick = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", disableRightClick);

  //   // Disable dangerous keys
  //   const disableKeys = (e) => {
  //     if (
  //       e.key === "F11" ||
  //       e.key === "Escape" ||
  //       e.key === "F12" ||
  //       (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
  //       (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase()))
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       console.log("Blocked:", e.key);
  //     }
  //   };
  //   document.addEventListener("keydown", disableKeys);

  //   // Disable copy/paste/select
  //   const disableCopy = (e) => e.preventDefault();
  //   document.addEventListener("copy", disableCopy);
  //   document.addEventListener("cut", disableCopy);
  //   document.addEventListener("paste", disableCopy);
  //   document.addEventListener("selectstart", disableCopy);
  // };

  const check_quiz_status = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(chapter_id));
    try {
      const API_CALL = await START_QUIZ_QUESTION(FORM_DATA);

      if (API_CALL?.data?.status) {
        if (API_CALL?.data?.answer_sumission_count > 0) {
          set_first_attempt(false); // Pehle attempt hua hai
          // enableSecurity();
          set_button_loader(false)

        } else {
          set_first_attempt(true); // Pehle attempt hua hai
          set_button_loader(false)
          // enableSecurity();
        }

      } else {
        window.close()
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    check_quiz_status()
  }, [])

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
            height:"96vh"
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
          />
          <QuizTestQuestionView

            set_submit_true={set_submit_true}
            time_spend={time_spend}
            chapter_id={chapter_id}
            quiz_test_id={quiz_test_id}
          />
        </Card>

      </>}

    </div>
  );
}
