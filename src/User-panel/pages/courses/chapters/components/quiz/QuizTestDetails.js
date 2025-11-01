import { Button, Col, Row } from "antd";
import { useEffect, useState, useRef } from "react";
import { ADD_QUIZ_ANSWER, VIEW_QUIZ_SETTING } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";


export default function QuizTestDetails({
  set_quiz_test_id,
  show_options,
  chapter_id,
  set_time_spend,
  time_spend,
  submit_true,
  set_quiz_title,
}) {

  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState("");
  const [time_limit, set_time_limit] = useState(null);
  const [passing_percentage, set_passing_percentage] = useState("");
  const [number_of_retake, set_number_of_retake] = useState("");
  const [display_question, set_display_question] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, set_expired] = useState(false);
  const [submitted, set_submitted] = useState(false);

  const timerRef = useRef(null);

  // 🔹 Fetch Quiz Settings
  useEffect(() => {
    const VIEW_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));
      const response = await VIEW_QUIZ_SETTING(FORM_DATA);

      if (response?.data?.status) {
        const data = response.data.data;
        set_title(data?.title);
        set_quiz_title(data?.title);
        set_time_limit(parseInt(data?.time_limit));
        set_display_question(data?.display_question);

        if (!data?.expired && !data?.test_submitted) {
          set_quiz_test_id(data?.id);
        }

        set_expired(data?.expired);
        set_submitted(data?.test_submitted);
        set_passing_percentage(data?.passing_percentage);
        set_number_of_retake(data?.no_of_retake);

        if (data?.time_limit) {
          const seconds = parseInt(data.time_limit) * 60;
          console.log("⏳ Initial time:", seconds);
          setRemainingTime(seconds);
        }
      }
      setLoading(false);
    };

    VIEW_API();   
  }, [chapter_id]);

  // 🔹 Countdown Logic
  useEffect(() => {
    if (!show_options) return;
    if (!time_limit) return;
    if (submit_true || expired) return;
    if (remainingTime === null) return;

    console.log("✅ Timer started with", remainingTime, "seconds");

    clearInterval(timerRef.current);
    if(remainingTime === 0){
      submit_question()
    }
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        const total = time_limit * 60;
        const spent = total - (prev - 1);
        set_time_spend(spent);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [show_options, time_limit, submit_true, expired, remainingTime]);

  // 🔹 Format time helper
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const submit_question = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(chapter_id));
    FORM_DATA.append("submitted", 1);
    FORM_DATA.append("time_spend", time_limit * 60);
    try {
      const API_RESPONSE = await ADD_QUIZ_ANSWER(FORM_DATA);
      if (API_RESPONSE?.data?.status) {
        alert("⏰ Time is over!");
        window.close()
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  return (
    <>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <>
          {time_limit ? (
            <div
              className="section-details section-details-right-padding"
              style={{ minHeight: "auto" }}
            >
              <Row>
                <Col span={12}>
                  <p>
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Time Limit:{" "}
                    </span>
                    {time_limit} min
                    <br />
                    {remainingTime !== null && (
                      <span style={{ color: "orange", fontWeight: "bold" }}>
                        Remaining Time: {formatTime(remainingTime)}
                      </span>
                    )}
                  </p>
                </Col>
                <Col span={12}>
                  <div style={{ float: "right" }}>
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Passing Percentage:{" "}
                    </span>
                    {passing_percentage}% <br />
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Retake Allowed:{" "}
                    </span>
                    {number_of_retake} <br />
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Total Questions:{" "}
                    </span>
                    {display_question}
                  </div>
                </Col>
              </Row>

              {submitted ? (
                <h3
                  style={{
                    padding: "50px",
                    textAlign: "center",
                    color: "green",
                    border: "1px solid green",
                    fontSize: "42px",
                  }}
                >
                  Quiz submitted
                  <br />
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => window.close()}
                  >
                    Close
                  </Button>
                 
                  ;
                </h3>
              ) : expired ? (
                <h3
                  style={{
                    padding: "50px",
                    textAlign: "center",
                    color: "red",
                    border: "1px solid red",
                    fontSize: "42px",
                  }}
                >
                  Quiz Test Expired
                  <br />
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => window.close()}
                  >
                    Close
                  </Button>
                </h3>
              ) : null}
            </div>
          ) : (
            <h3
              style={{
                padding: "50px",
                textAlign: "center",
                color: "red",
                fontSize: "42px",
              }}
            >
              Data Empty
              <br />
              <Button
                type="primary"
                size="small"
                onClick={() => window.close()}
              >
                Close
              </Button>
            </h3>
          )}
        </>
      )}
    </>
  );
}
