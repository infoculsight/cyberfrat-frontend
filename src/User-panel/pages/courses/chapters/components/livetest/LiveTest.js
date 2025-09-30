import { Card, Divider, Button } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LiveTestDetails from "./LiveTestDetails";
import LiveTestQuestionView from "./LiveTestQuestionView";

export default function LiveTest() {
  const { chapter_id } = useParams();
  const [show_options, set_show_options] = useState(false);
  const [live_test_id, set_live_test_id] = useState("");
  const [time_spend, set_time_spend] = useState("");
  const [submit_true, set_submit_true] = useState(false);

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

  const handleStartTest = () => {
    enableSecurity();
    set_show_options(true);
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
          Live Test
        </Divider>

        <LiveTestDetails
          show_options={show_options}
          set_show_options={set_show_options}
          set_live_test_id={set_live_test_id}
          chapter_id={chapter_id}
          set_time_spend={set_time_spend}
          submit_true={submit_true}
        />

        {!show_options && live_test_id ? (
          <div style={{ textAlign: "center" }}>
            <Button onClick={handleStartTest} type="primary">
              Start Test
            </Button>
          </div>
        ) : (
          live_test_id && (
            <LiveTestQuestionView set_submit_true={set_submit_true} time_spend={time_spend} chapter_id={chapter_id} live_test_id={live_test_id} />
          )
        )}
      </Card>
    </div>
  );
}
