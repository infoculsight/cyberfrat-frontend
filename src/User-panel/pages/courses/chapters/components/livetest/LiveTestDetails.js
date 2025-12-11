import { Button, Col, Row, Grid } from "antd";
import { useEffect, useState, useRef } from "react";
import { VIEW_LIVE_TEST_DETAILS, ADD_LIVE_TEST_ANSWERS } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

const { useBreakpoint } = Grid;

export default function LiveTestDetails({
  set_quiz_test_id,
  show_options,
  chapter_id,
  set_time_spend,
  time_spend,
  submit_true,
  set_quiz_title,
  live_test_id,
  display_question,
}) {

  const screens = useBreakpoint();

  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState("");
  const [time_limit, set_time_limit] = useState(null);
  const [passing_percentage, set_passing_percentage] = useState("");
  const [number_of_retake, set_number_of_retake] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, set_expired] = useState(false);
  const [submitted, set_submitted] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const VIEW_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("live_test_id", atob(live_test_id));
      const response = await VIEW_LIVE_TEST_DETAILS(FORM_DATA);

      if (response?.data?.status) {
        const data = response.data.data;

        set_title(data?.title);
        set_quiz_title(data?.title);
        set_time_limit(parseInt(data?.time_limit));

        if (!data?.expired && !data?.test_submitted) {
          set_quiz_test_id(data?.id);
        }

        set_expired(data?.expired);
        set_submitted(data?.test_submitted);
        set_passing_percentage(data?.passing_percentage);
        set_number_of_retake(data?.no_of_retake);

        if (data?.time_limit) {
          const seconds = parseInt(data.time_limit) * 60;
          setRemainingTime(seconds);
        }
      }
      setLoading(false);
    };

    VIEW_API();
  }, [live_test_id]);


  // -------------- NEW SUBMIT FUNCTION (Same as QuizTest) --------------
  const submit_question = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("live_test_id", atob(live_test_id));
    FORM_DATA.append("submitted", 1);
    FORM_DATA.append("time_spend", time_limit * 60);

    try {
      const API_RESPONSE = await ADD_LIVE_TEST_ANSWERS(FORM_DATA);
      if (API_RESPONSE?.data?.status) {
        alert("⏰ Time is over!");
        window.close();
      }
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };


  // ------------------- TIMER (Exactly like quiz) -----------------------
  useEffect(() => {
    if (!show_options) return;
    if (!time_limit) return;
    if (submit_true || expired) return;
    if (remainingTime === null) return;

    clearInterval(timerRef.current);

    if (remainingTime === 0) {
      submit_question();
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null) return null;

        if (prev <= 1) {
          clearInterval(timerRef.current);
          submit_question();  // Auto submit
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


  // ------------------- FORMAT TIME -------------------
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  return (
    <>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <>
          {time_limit ? (
            <div className="section-details section-details-right-padding">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <p>
                    <b style={{ color: "#6ca9ff" }}>Time Limit:</b> {time_limit}
                  </p>

                  {remainingTime !== null && (
                    <p style={{ color: "orange", fontWeight: "bold" }}>
                      Remaining Time: {formatTime(remainingTime)}
                    </p>
                  )}
                </Col>

                <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                  <b style={{ color: "#6ca9ff" }}>Total Questions:</b>{" "}
                  {display_question}
                </Col>
              </Row>

              {submitted ? (
                <h3 style={{ padding: "40px", color: "green", border: "1px solid green", textAlign: "center" }}>
                  Test Submitted
                  <br />
                  <Button type="primary" size="small" onClick={() => window.close()} style={{ marginTop: 10 }}>
                    Close
                  </Button>
                </h3>
              ) : expired ? (
                <h3 style={{ padding: "40px", color: "red", border: "1px solid red", textAlign: "center" }}>
                  Test Expired
                  <br />
                  <Button type="primary" size="small" onClick={() => window.close()} style={{ marginTop: 10 }}>
                    Close
                  </Button>
                </h3>
              ) : null}
            </div>
          ) : (
            <h3 style={{ padding: 40, color: "red", textAlign: "center" }}>
              Data Empty
            </h3>
          )}
        </>
      )}
    </>
  );
}
