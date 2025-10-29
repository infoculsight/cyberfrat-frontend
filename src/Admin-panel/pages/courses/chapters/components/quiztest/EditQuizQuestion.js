import {
  App,
  Button,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { EDIT_QUIZ_QUESTION, VIEW_QUIZ_QUESTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import QuizQuestionOptions from "./QuizQuestionOptions";

import CustomRichTextEditor from "../../../../../components/CustomTextEditor";

export default function EditQuizQuestion({
  course_id,
  chapter_id,
  question_details,
  quiz_question_id
  
}) {
  // Components common state
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  // Add Question States


  const [type, set_type] = useState("single_choice");
  const [subject, set_subject] = useState("");
  const [topic, set_topic] = useState("");
  const [tags, set_tags] = useState([]);
  const [difficulty, set_difficulty] = useState([]);
  const [question_text, set_question_text] = useState("");
  const [is_group, set_is_group] = useState(0);
  const [option_details, set_option_details] = useState([]);
  const [explanation, set_explanation] = useState("");
  const [errors, set_errors] = useState({});
  const [form] = Form.useForm();



  useEffect(() => {
  const VIEW_API = async () => {
  const FORM_DATA = new FormData();
  FORM_DATA.append("chapter_id", atob(chapter_id));
  FORM_DATA.append("id", atob(quiz_question_id));
  const response = await VIEW_QUIZ_QUESTION(FORM_DATA);
  if (response?.data?.status) {
    const data = response.data.data;
    console.log("Quiz question data:", data);

    set_type(data?.type || "single_choice");
    set_subject(data?.subject || "");
    set_topic(data?.topic || "");
    set_tags(Array.isArray(data?.tags) ? data.tags : (data?.tags?.split(",") || []));
    set_difficulty(data?.difficulty || []);
    set_question_text(data?.question_text || "");
    set_is_group(Number(data?.is_group));
    
    try {
      const options = data?.option_details
        ? JSON.parse(data.option_details)
        : [];
      set_option_details(options);
    } catch (e) {
      console.error("Invalid JSON in option_details:", e);
      set_option_details([]);
    }

    set_explanation(data?.explanation || "");
  }
  setLoading(false);
};
   if (chapter_id && quiz_question_id) {
    VIEW_API();
  }
}, [chapter_id, quiz_question_id]);


  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(chapter_id));
     FORM_DATA.append("id", atob(quiz_question_id));
    FORM_DATA.append("type", type);
    FORM_DATA.append("tags", tags);
    FORM_DATA.append("is_group",is_group.toString());
    FORM_DATA.append("topic", topic);
    FORM_DATA.append("subject", subject);
    FORM_DATA.append("question_text", question_text);
    FORM_DATA.append("difficulty", difficulty.toString());
    FORM_DATA.append("option_details", JSON.stringify(option_details));
    FORM_DATA.append("explanation", explanation);
   
    try {
      const response = await EDIT_QUIZ_QUESTION(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });

        setLoading(false);
      } else {
        setLoading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {loading ? (
        <>
          <CulsightPageLoader />
        </>
      ) : (
        <>
          <Row>
            <Col span={24}>
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                validateTrigger="onSubmit"
              >
        
                <Form.Item label="Subject">
                  <Input
                    value={subject}
                    onChange={(e) => set_subject(e.target.value)}
                  />
                  {errors?.subject && (
                    <span style={{ color: "red" }}>{errors.subject}</span>
                  )}
                </Form.Item>

                <Form.Item label="Quiz Topic">
                  <Input
                    value={topic}
                    onChange={(e) => set_topic(e.target.value)}
                  />
                  {errors?.topic && (
                    <span style={{ color: "red" }}>{errors.topic}</span>
                  )}
                </Form.Item>

                <Form.Item label="Question Tag">
                  <Select
                    mode="tags"
                    value={tags}
                    onChange={set_tags}
                    placeholder="Please select"
                    style={{ width: "100%" }}
                  />
                  {errors?.tags && (
                    <span style={{ color: "red" }}>{errors?.tags}</span>
                  )}
                </Form.Item>
                
                <Form.Item label="Quiz Difficulty">
                  <Select
                    mode="tag"
                    value={difficulty}
                    onChange={set_difficulty}
                    placeholder="Please select"
                    style={{ width: "100%" }}
                    options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                  />
                  {errors?.difficulty && (
                    <span style={{ color: "red" }}>{errors?.difficulty}</span>
                  )}
                </Form.Item>

                <Form.Item>
                <CustomRichTextEditor
                  value={question_text}
                  editorLabel="Question Text"
                  onChange={(val) => set_question_text(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.question_text && (
                  <span style={{ color: "red" }}>{errors?.question_text}</span>
                )}
                </Form.Item>

                <Form.Item label="Is Group Question">
                  <Radio.Group
                    value={is_group}
                    onChange={(e) => set_is_group(e.target.value)}
                  >
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {errors?.is_group && (
                    <span style={{ color: "red" }}>{errors.is_group}</span>
                  )}
                </Form.Item>

                  <Form.Item label="Quiz Type">
                  <Radio.Group
                    value={type}
                    onChange={(e) => set_type(e.target.value)}
                  >
                    <Radio value="single_choice">Single Choice</Radio>
                    <Radio value="multiple_choice">Multiple Choice</Radio>
                  </Radio.Group>
                  {errors?.type && (
                    <span style={{ color: "red" }}>{errors.type}</span>
                  )}
                </Form.Item>

                <QuizQuestionOptions
                  optionChoice={type}
                  options={option_details}
                  setOptions={set_option_details}
                />
                {errors?.option_details && (
                  <span style={{ color: "red" }}>{errors.option_details}</span>
                )}

                <Form.Item>
                <CustomRichTextEditor
                  value={explanation}
                  editorLabel="Explanation"
                  onChange={(val) => set_explanation(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.explanation && (
                  <span style={{ color: "red" }}>{errors?.explanation}</span>
                )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    onClick={onFinish}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        Saving...
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                        />
                      </>
                    ) : (
                      "Update Question"
                    )}
                  </Button>
                </Form.Item>

                
              </Form>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
