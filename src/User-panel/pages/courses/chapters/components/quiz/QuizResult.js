import { Card, Avatar, Row, Col, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { QUIZ_RESULT_VIEW } from "../../../../../apis/apis";

function QuizResult({ chapter_id }) {
  const [loading, set_loading] = useState(false);
  const [result, set_result] = useState(null);
  const [image, set_image] = useState("");

  useEffect(() => {
    const VIEW_API = async () => {
      set_loading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));
      try {
        const response = await QUIZ_RESULT_VIEW(FORM_DATA);
        console.log(response);
        if (response?.data?.status) {
          const data = response.data.data;
          set_result(data);
          if (data.image) set_image(data.image);
        }
      } catch (err) {
        console.error("Error fetching quiz result:", err);
      }
      set_loading(false);
    };
    VIEW_API();
  }, [chapter_id]);

  if (loading || !result) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        Loading your result...
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins} mins ${secs < 10 ? "0" + secs : secs
      } sec`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // mobile padding
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 1000,
          textAlign: "center",
          borderRadius: 12,
          border: "none",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="avatar"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 20,
              marginTop: 20,
            }}
          />
        ) : (
          <Avatar
            size={100}
            icon={<SmileOutlined />}
            style={{
              backgroundColor: "#fadb14",
              marginBottom: 20,
              marginTop: 20,
            }}
          />
        )}

        <h2 style={{ color: "#fff", fontSize: "1.2rem" }}>
          {result.passing_status
            ? "Congratulations! You passed the quiz!"
            : "Take on that quiz again and crush it like a boss!"}
        </h2>

        <h3 style={{ color: "#40a9ff" }}>Score: {result.score}</h3>
        <p style={{ color: "#aaa", marginTop: 20 }}>
          Here’s a breakdown of your performance
        </p>

        <Row
          justify="center"
          gutter={[16, 16]} // responsive gutter
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Col xs={12} sm={6} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "green",
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              ></span>
              <span>Correct Answers</span>
            </div>
            <div style={{ color: "#fff", fontSize: 16 }}>
              {result.correct_answers < 10
                ? `0${result.correct_answers}`
                : result.correct_answers}
            </div>
          </Col>

          <Col xs={12} sm={6} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "red",
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              ></span>
              <span>Wrong Answers</span>
            </div>
            <div style={{ color: "#fff", fontSize: 16 }}>
              {result.wrong_answers < 10
                ? `0${result.wrong_answers}`
                : result.wrong_answers}
            </div>
          </Col>

          <Col xs={12} sm={6} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#fadb14",
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              ></span>
              <span>Time Spent</span>
            </div>
            <div style={{ color: "#fff", fontSize: 16 }}>
              {formatTime(result.time_spent)}
            </div>
          </Col>

          <Col xs={12} sm={6} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#40a9ff",
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              ></span>
              <span>Percentage</span>
            </div>
            <div style={{ color: "#fff", fontSize: 16 }}>
              {result.percentage}%
            </div>
          </Col>
        </Row>

        <Button
          type={result.passing_status ? "primary" : "default"}
          size="large"
          style={{ marginTop: "20px" }}
          onClick={() => window.close()}
        >
          Close
        </Button>
      </Card>
    </div>
  );
}

export default QuizResult;
