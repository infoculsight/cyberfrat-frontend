import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { VIEW_QUIZ_SETTING } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

export default function QuizTestDetails({
  set_quiz_test_id,
  show_options,
  chapter_id,
  set_time_spend,
  submit_true,
  set_quiz_title,
}) {
  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState("");
  const [time_limit, set_time_limit] = useState("");
  const [passing_percentage, set_passing_percentage] = useState("");
  const [number_of_retake, set_number_of_retake] = useState("");
  const [current_attempt, set_current_attempt] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, set_expired] = useState(false);
  const [submitted, set_submitted] = useState(false);
  const [display_question,set_display_question] = useState("")

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
        set_time_limit(data?.time_limit);
        set_display_question(data?.display_question)
        if (!data?.expired && !data?.test_submitted) {
          set_quiz_test_id(data?.id);
        }
        set_expired(data?.expired);
        set_submitted(data?.test_submitted);
        set_passing_percentage(data?.passing_percentage);
        set_number_of_retake(data?.no_of_retake);
        set_current_attempt(data?.current_attempt);
        setRemainingTime(parseInt(data?.time_limit) * 60);
      }
      setLoading(false);
    };
    VIEW_API();
  }, [chapter_id, set_quiz_test_id, set_quiz_title]);

  // Countdown with time_spend tracking in seconds
  useEffect(() => {
    let interval;
    let timeout;

    if (show_options && remainingTime && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            set_time_spend(parseInt(time_limit) * 60);
            return 0;
          }
          const timeSpent = parseInt(time_limit) * 60 - (prev - 1);
          set_time_spend(timeSpent);
          return prev - 1;
        });
      }, 1000);

      timeout = setTimeout(() => {
        alert("⏰ Time is over!");
        window.close();
      }, remainingTime * 1000);
    }

    // ✅ Stop countdown if test is submitted
    if (submit_true && interval) {
      clearInterval(interval);
      clearTimeout(timeout);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [remainingTime, show_options, time_limit, set_time_spend, submit_true]);


  return (
    <>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <>
          {time_limit > 0 ? (
            <div
              className="section-details section-details-right-padding"
              style={{ minHeight: "auto" }}
            >
              <Row>
                <Col span={12}>

                  <p>
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Time Limit :-{" "}
                    </span>
                    {time_limit} min
                    <br />
                    {remainingTime !== null && (
                      <span style={{ color: "orange", fontWeight: "bold" }}>
                        <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                          Remaining Time:{" "}
                        </span>
                        {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
                      </span>
                    )}
                  </p>
                </Col>

                <Col span={12}>
                  <div style={{ float: "right" }}>
                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Passing percentage :-{" "}
                    </span>
                    {passing_percentage}%  <br />

                    <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Number of retake :-{" "}
                    </span>
                    {number_of_retake} <br />

                     <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                      Number of questions :-{" "}
                    </span>
                    {display_question}
                    <br />
                   

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
                <br></br>
                              <Button type="primary" size="small" onClick={() => window.close()}>Close</Button>
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
                  <br></br>
                                <Button type="primary" size="small" onClick={() => window.close()}>Close</Button>
                </h3>
              ) : (
                ""
              )}
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
              <br></br>
                            <Button type="primary" size="small" onClick={() => window.close()}>Close</Button>
            </h3>
          )}
        </>
      )}
    </>
  );
}
