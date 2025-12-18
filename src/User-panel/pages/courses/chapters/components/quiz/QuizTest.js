import { Card, Divider } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import QuizTestDetails from "./QuizTestDetails";
import QuizTestQuestionView from "./QuizTestQuestionView";

export default function QuizTest() {
  const { chapter_id } = useParams();
  const [show_options, set_show_options] = useState(true);
  const [quiz_test_id, set_quiz_test_id] = useState("");
  const [time_spend, set_time_spend] = useState("");
  const [submit_true, set_submit_true] = useState(false);
  const [min_time_before_submit , set_min_time_before_submit] = useState("")
  const [quiz_title, set_quiz_title] = useState("");

  return (
    <div
      className="lms-body"
      style={{
        width: "100%",
        margin: "0 auto",
        marginTop: "0px",
        height: "100%",
        position: "absolute",
        boxSizing: "border-box"

      }}
    >
      <Card
        style={{
          padding: "0px 25px 20px 25px",
          border: 0,
          boxShadow: "0 0 20px rgba(134, 134, 134, 0.3)",
          minHeight: "96vh"
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
          time_spend={time_spend}
          submit_true={submit_true}
          set_quiz_title={set_quiz_title}
          min_time_before_submit = {min_time_before_submit}
          set_min_time_before_submit = {set_min_time_before_submit}
        />
        <div style={{marginTop:"30px"}}>
        {quiz_test_id &&
          <QuizTestQuestionView
            set_submit_true={set_submit_true}
            time_spend={time_spend}
            chapter_id={chapter_id}
            quiz_test_id={quiz_test_id}
            min_time_before_submit = {min_time_before_submit}
          />

        }
        </div>

      </Card>

    </div>
  );
}
