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

import { Add_LIVE_TEST_QUESTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import LiveTestQuestionOptions from "./LiveTestQuestionOptions";

import CustomRichTextEditor from "../../../../../components/CustomTextEditor";

export default function LiveTestQuestionAddView({
  course_id,
  chapter_id,
  onClose,
  onSuccess,
}) {
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const [question_title, set_question_title] = useState("");
  const [question_tag, set_question_tag] = useState([]);
  const [description, set_description] = useState("");
  const [question_type, set_question_type] = useState("single_choice");
  const [option_details, set_option_details] = useState([]);
  const [explanation, set_explanation] = useState("");

  const [errors, set_errors] = useState({});
  const [form] = Form.useForm();

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(chapter_id));
    FORM_DATA.append("question_title", question_title);
    FORM_DATA.append("question_tag", question_tag);
    FORM_DATA.append("description", description);
    FORM_DATA.append("question_type", question_type);
    FORM_DATA.append("option_details", JSON.stringify(option_details));
    FORM_DATA.append("explanation", explanation);
    try {
      const response = await Add_LIVE_TEST_QUESTION(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });

        setLoading(false);
        onSuccess(response?.data?.data);

        form.resetFields();
        set_question_title("");
        set_question_tag("");
        set_description("");
        set_question_type("single_choice");
        set_option_details([]);
        set_explanation("");
        set_errors({});
      } else {
        setLoading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "-15px" }}>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              validateTrigger="onSubmit"
            >
              <Form.Item label="Question Title">
                <Input
                  value={question_title}
                  onChange={(e) => set_question_title(e.target.value)}
                />
                {errors?.question_title && (
                  <span style={{ color: "red" }}>{errors.question_title}</span>
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
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : (
                    "Add Question"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
}
