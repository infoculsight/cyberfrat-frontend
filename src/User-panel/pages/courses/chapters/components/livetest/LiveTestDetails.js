import { Col, Row, Card } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { VIEW_LIVE_TEST } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

export default function LiveTestDetails({
  set_live_test_id,
  show_options,
  set_show_options,
  chapter_id,
  set_time_spend,
  submit_true
}) {
  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState("");
  const [time_limit, set_time_limit] = useState("");
  const [available_from, set_available_from] = useState("");
  const [available_till, set_available_till] = useState("");
  const [show_advance_options, set_show_advance_options] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, set_expired] = useState(false);
  const [submitted, set_submitted] = useState(false);

  useEffect(() => {
    const VIEW_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));
      const response = await VIEW_LIVE_TEST(FORM_DATA);
      if (response?.data?.status) {
        const data = response.data.data;
        set_title(data?.title);
        set_time_limit(data?.time_limit);
        if (!data?.expired && !data?.test_submitted) {
          set_live_test_id(data?.id);
        }
        set_expired(data?.expired);
        set_submitted(data?.test_submitted);
        set_available_from(moment(data?.available_from).format("DD-MM-YYYY"));
        set_available_till(moment(data?.available_till).format("DD-MM-YYYY"));
        set_show_advance_options(data?.show_advance_options);
        setRemainingTime(parseInt(data?.time_limit) * 60);
      }
      setLoading(false);
    };
    VIEW_API();
  }, [chapter_id,set_live_test_id]);

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

  const optionsMap = {
    a: {
      title: "Neet UG Pattern 2025 - Single Subject",
      marks: "180",
      rule: "+4 for correct, -1 for incorrect",
      note: "No marks for unanswered",
      sections: "4 predefined sections",
    },
    b: {
      title: "CAT Pattern 2023",
      marks: "198",
      rule: "Time limit: 120 mins",
      note: "",
      sections: "3 predefined sections",
    },
    c: {
      title: "Neet UG Pattern 2025",
      marks: "721",
      rule: "Time limit: 180 mins",
      note: "+4 / -1 for incorrect",
      sections: "4 predefined sections",
    },
    d: {
      title: "JEE MAINS Pattern 2025",
      marks: "300",
      rule: "Time limit: 180 mins",
      note: "+4 / -1 for incorrect",
      sections: "6 predefined sections",
    },
  };

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
                  <h3>{title}</h3>
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
                      Available From :-{" "}
                    </span>
                    {available_from}
                    <p>
                      <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                        Available Till :-{" "}
                      </span>
                      {available_till}
                    </p>
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
                  Test submitted
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
                  Test Expired
                </h3>
              ) : (
                !show_options &&
                optionsMap[show_advance_options] && (
                  <Card
                    style={{
                      borderRadius: 8,
                      border: 0,
                      boxShadow: "0 0 10px rgba(87, 87, 87, 0.3)",
                      height: "auto",
                      textAlign: "center",
                      maxWidth: "500px",
                      margin: "50px auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>
                        <strong style={{ color: "#6ca9ff" }}>Pattern: </strong>
                        {optionsMap[show_advance_options].title}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <strong style={{ color: "#6ca9ff" }}>
                          Maximum Marks:
                        </strong>{" "}
                        {optionsMap[show_advance_options].marks}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <strong style={{ color: "#6ca9ff" }}>Rules: </strong>
                        {optionsMap[show_advance_options].rule}
                        {optionsMap[show_advance_options].note && (
                          <span>
                            {" "}
                            | Note: {optionsMap[show_advance_options].note}
                          </span>
                        )}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <strong style={{ color: "#6ca9ff" }}>Sections: </strong>
                        {optionsMap[show_advance_options].sections}
                      </p>
                    </div>
                  </Card>
                )
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
            </h3>
          )}
        </>
      )}
    </>
  );
}
