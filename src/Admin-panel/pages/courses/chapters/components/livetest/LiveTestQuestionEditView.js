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
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { EDIT_LIVE_TEST_QUESTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import LiveTestQuestionOptions from "./LiveTestQuestionOptions";
import CustomRichTextEditor from "../../../../../components/CustomTextEditor";

export default function LiveTestQuestionEditView({
  course_id,
  chapter_id,
  question_details,
}) {
  // Components common state
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  // Add Question States
  const [question_title, set_question_title] = useState(
    question_details.question_title
  );
  const [question_tag, set_question_tag] = useState(
    question_details.question_tag?.split(",").map(tag => tag.trim()) || ""
  );
  const [description, set_description] = useState(question_details.description);
  const [question_type, set_question_type] = useState(
    question_details.question_type
  );
  const [option_details, set_option_details] = useState(
    JSON.parse(question_details.option_details)
  );
  const [explanation, set_explanation] = useState(question_details.explanation);

  // API states
  const [errors, set_errors] = useState({});
  const [form] = Form.useForm();

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", question_details.id);
    FORM_DATA.append("question_title", question_title);
    FORM_DATA.append("question_tag", question_tag);
    FORM_DATA.append("description", description);
    FORM_DATA.append("question_type", question_type);
    FORM_DATA.append("option_details", JSON.stringify(option_details));
    FORM_DATA.append("explanation", explanation);
    try {
      const response = await EDIT_LIVE_TEST_QUESTION(FORM_DATA);

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
                validateTrigger="onSubmit">
                
                <Form.Item label="Question Title">
                  <Input
                    value={question_title}
                    onChange={(e) => set_question_title(e.target.value)}
                  />
                  {errors?.question_title && (
                    <span style={{ color: "red" }}>
                      {errors.question_title}
                    </span>
                  )}
                </Form.Item>

                <Form.Item label="Question Tag">
                  <Select
                    mode="tags"
                    value={question_tag}
                    onChange={set_question_tag}
                    placeholder="Please select"
                    style={{ width: "100%" }}
                  />
                  {errors?.question_tag && (
                    <span style={{ color: "red" }}>{errors?.question_tag}</span>
                  )}
                </Form.Item>

                <Form.Item>
                <CustomRichTextEditor
                  value={description}
                  editorLabel="Description"
                  onChange={(val) => set_description(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.description && (
                  <span style={{ color: "red" }}>{errors?.description}</span>
                )}
                </Form.Item>
               
                <Form.Item label="Question Type">
                  <Radio.Group
                    value={question_type}
                    onChange={(e) => set_question_type(e.target.value)}
                  >
                    <Radio value="single_choice">Single Choice</Radio>
                    <Radio value="multiple_choice">Multiple Choice</Radio>
                  </Radio.Group>
                  {errors?.question_type && (
                    <span style={{ color: "red" }}>{errors.question_type}</span>
                  )}
                </Form.Item>

                <LiveTestQuestionOptions
                  optionChoice={question_type}
                  options={option_details}
                  setOptions={set_option_details}
                />
                {errors?.option_details && (
                  <span style={{ color: "red" }}>{errors.option_details}</span>
                )}
                <br></br>

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
                        Saving...{" "}
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
