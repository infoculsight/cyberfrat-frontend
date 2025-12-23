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
  Space,
  Spin,
  Switch,
  TimePicker,
} from "antd";
import { LoadingOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  ADD_QUIZ_SETTIING,
  EDIT_QUIZ_SETTIING,
  VIEW_QUIZ_SETTIING,
} from "../../../../../apis/apis";
import CustomRichTextEditor from "../../../../../components/CustomTextEditor";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import dayjs from "dayjs";


function QuizSetting({ course_id, chapter_id }) {
  const { notification } = App.useApp();
  const [show_edit_button, set_edit_button] = useState(false);
  const [edit_loading, set_edit_loading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [quiz_setting_id, set_quiz_setting_id] = useState();
  const [title, set_title] = useState("");
  const [tag, set_tag] = useState([]);
  const [time_limit, set_time_limit] = useState("");
  const [no_of_retake, set_no_of_retake] = useState("");
  const [show_instructions, set_show_instructions] = useState("");
  const [show_calculator, set_show_calculator] = useState("");
  const [post_submit_message, set_post_submit_message] = useState("");
  const [passing_percentage, set_passing_percentage] = useState("");
  const [display_question, set_display_question] = useState("");
  const [
    force_learner_to_attempt_in_one_go,
    set_force_learner_to_attempt_in_one_go,
  ] = useState(0);
  const [show_rank_along_with_result, set_show_rank_along_with_result] =
    useState(0);
  const [min_time_before_submit, set_min_time_before_submit] = useState("");
  const [show_solution, set_show_solution] = useState("");
  const [share_performance, set_share_performance] = useState(0);
  const [show_custom_messages, set_show_custom_messages] = useState(0);
  const [arrange_questions_by_topic, set_arrange_questions_by_topic] =
    useState(0);
  const [enable_section_grouping, set_enable_section_grouping] = useState(0);
  const [errors, set_errors] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));
      const response = await VIEW_QUIZ_SETTIING(FORM_DATA);
      if (response?.data?.status) {
        const data = response.data.data;
        set_quiz_setting_id(data?.id);
        set_title(data?.title);
        set_tag(
          Array.isArray(data?.tags) ? data.tags : data?.tags?.split(',') || []
        );
        set_time_limit(data?.time_limit);
        set_no_of_retake(data?.no_of_retake);
        set_show_instructions(data?.show_instructions);
        set_show_calculator(data?.show_calculator);
        set_post_submit_message(data?.post_submit_message);
        set_passing_percentage(data?.passing_percentage);
        set_display_question(data?.display_question);
        set_force_learner_to_attempt_in_one_go(
          Number(data?.force_learner_to_attempt_in_one_go)
        );
        set_show_rank_along_with_result(
          Number(data?.show_rank_along_with_result)
        );
        set_min_time_before_submit(data?.min_time_before_submit);
        set_show_solution(data?.show_solution);
        set_share_performance(Number(data?.share_performance));
        set_show_custom_messages(Number(data?.show_custom_messages));
        set_arrange_questions_by_topic(
          Number(data?.arrange_questions_by_topic)
        );
        set_enable_section_grouping(Number(data?.enable_section_grouping));
        set_edit_button(true);
      }
      setLoading(false);
    };

    if (chapter_id) {
      VIEW_API();
    }
  }, [edit_loading, chapter_id]);

  const handleSubmit = async (isEdit) => {
    setLoading(true);

    const FORM_DATA = new FormData();
    FORM_DATA.append("title", title);
    FORM_DATA.append("tags", tag);
    FORM_DATA.append("id", quiz_setting_id);
    FORM_DATA.append("course_id", course_id)
    FORM_DATA.append("time_limit", time_limit);
    FORM_DATA.append("no_of_retake", no_of_retake);

    FORM_DATA.append("show_instructions", show_instructions);
    FORM_DATA.append("show_calculator", show_calculator);
    FORM_DATA.append("post_submit_message", post_submit_message);
    FORM_DATA.append(
      "display_question",
      display_question
    );
    FORM_DATA.append(
      "passing_percentage",
      passing_percentage
    );
    FORM_DATA.append(
      "force_learner_to_attempt_in_one_go",
      force_learner_to_attempt_in_one_go.toString()
    );
    FORM_DATA.append(
      "show_rank_along_with_result",
      show_rank_along_with_result.toString()
    );
    FORM_DATA.append("min_time_before_submit", min_time_before_submit);
    FORM_DATA.append("show_solution", show_solution);
    FORM_DATA.append("share_performance", share_performance.toString());
    FORM_DATA.append("show_custom_messages", show_custom_messages.toString());
    FORM_DATA.append(
      "arrange_questions_by_topic",
      arrange_questions_by_topic.toString()
    );
    FORM_DATA.append(
      "enable_section_grouping",
      enable_section_grouping.toString()
    );
    FORM_DATA.append("chapter_id", atob(chapter_id));

    if (quiz_setting_id) {
      FORM_DATA.append("id", quiz_setting_id);
    }

    try {
      const response = isEdit
        ? await EDIT_QUIZ_SETTIING(FORM_DATA)
        : await ADD_QUIZ_SETTIING(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response.data.message,
        });
        set_edit_loading(true);
        setLoading(false);
        set_errors([])
      } else {
        setLoading(false);
        set_errors(response.data.errors);
      }
    } catch (error) {
      message.error(

        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <Row>
          <Col span={24}>
            <Form
              layout="vertical"
              autoComplete="off"
              validateTrigger="onSubmit"
              form={form}
            >
              <Form.Item label="Title">
                <Input
                  placeholder="Enter Quiz Title"
                  value={title}
                  onChange={(e) => set_title(e.target.value)}
                />
                {errors?.title && (
                  <span style={{ color: "red" }}>{errors.title}</span>
                )}
              </Form.Item>
              <Form.Item label="Tag">
                <Select
                  mode="tags"
                  value={tag}
                  onChange={set_tag}
                  placeholder="Select Tag"
                  style={{ width: "100%" }}
                />
                {errors?.tag && (
                  <span style={{ color: "red" }}>{errors.tag}</span>
                )}
              </Form.Item>
              <Form.Item label="Time Limit (in Minutes)">
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm:ss"
                  value={time_limit ? dayjs().startOf("day").add(time_limit, "minute") : null}
                  onChange={(time) => {
                    if (time) {
                      set_time_limit(time.diff(dayjs().startOf("day"), "minute"));
                    } else {
                      set_time_limit("");
                    }
                  }}
                  panelRender={(panel) => (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          fontWeight: 600,
                          padding: "8px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <span>HH</span>
                        <span>MM</span>
                        <span>SS</span>
                      </div>
                      {panel}
                    </div>
                  )}
                />

              </Form.Item>
              <Form.Item label="Number Of Retake">
                <Input
                  placeholder="Enter Number Of Retake"
                  value={no_of_retake}
                  onChange={(e) => set_no_of_retake(e.target.value)}
                />
                {errors?.no_of_retake && (
                  <span style={{ color: "red" }}>{errors.no_of_retake}</span>
                )}
              </Form.Item>
              <Form.Item label="Display Question">
                <Input
                  placeholder="Display Question"
                  value={display_question}
                  onChange={(e) => set_display_question(e.target.value)}
                />
                {errors?.display_question && (
                  <span style={{ color: "red" }}>
                    {errors.display_question}
                  </span>
                )}
              </Form.Item>
              <Form.Item label="Show Instruction">
                <Radio.Group
                  value={show_instructions}
                  onChange={(e) => set_show_instructions(e.target.value)}
                >
                  <Radio value="No">No</Radio>
                  <Radio value="Yes - Default instructions">
                    Yes - Default instructions
                  </Radio>
                  <Radio value="Yes - Custom instructions">
                    Yes - Custom instructions
                  </Radio>
                </Radio.Group>
                {errors?.show_instructions && (
                  <span style={{ color: "red" }}>
                    {errors.show_instructions}
                  </span>
                )}
              </Form.Item>


              <Form.Item label="Passing Percentage">
                <Input
                  placeholder="Enter Percentage"
                  value={passing_percentage}
                  onChange={(e) => set_passing_percentage(e.target.value)}
                />
                {errors?.passing_percentage && (
                  <span style={{ color: "red" }}>
                    {errors.passing_percentage}
                  </span>
                )}
              </Form.Item>

              <Form.Item label="Minimum Time Before Submit">
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  value={min_time_before_submit ? dayjs().startOf("day").add(time_limit, "minute") : null}
                  onChange={(time) => {
                    if (time) {
                      set_min_time_before_submit(time.diff(dayjs().startOf("day"), "minute"));
                    } else {
                      set_min_time_before_submit("");
                    }
                  }}
                />
              </Form.Item>

              {/* Advanced Setting Toggle */}
              <h3
                style={{
                  color: "#6ca9ff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: "15px",
                }}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Advanced Setting
                {showAdvanced ? <UpOutlined /> : <DownOutlined />}
              </h3>


              {showAdvanced && (
                <>
                  <Form.Item label="Show Calculator" style={{ marginTop: "15px" }}>
                    <Radio.Group
                      value={show_calculator}
                      onChange={(e) => set_show_calculator(e.target.value)}
                    >
                      <Radio value="No">No</Radio>
                      <Radio value="Yes - Basic calculator">
                        Yes - Basic calculator
                      </Radio>
                      <Radio value="Yes - Scientific calculator">
                        Yes - Scientific calculator
                      </Radio>
                    </Radio.Group>
                    {errors?.show_calculator && (
                      <span style={{ color: "red" }}>{errors.show_calculator}</span>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <CustomRichTextEditor
                      value={post_submit_message}
                      editorLabel="Post submit Message"
                      onChange={(val) => set_post_submit_message(val)}
                      placeholder="Write something..."
                    />
                    {errors?.post_submit_message && (
                      <span style={{ color: "red" }}>
                        {errors?.post_submit_message}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Force Learn Attempt in one go"
                    style={{ marginTop: "15px" }}
                  >
                    <Radio.Group
                      value={force_learner_to_attempt_in_one_go}
                      onChange={(e) =>
                        set_force_learner_to_attempt_in_one_go(e.target.value)
                      }
                    >
                      <Radio value={0}>No</Radio>
                      <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                    {errors?.force_learner_to_attempt_in_one_go && (
                      <span style={{ color: "red" }}>
                        {errors.force_learner_to_attempt_in_one_go}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Show Rank Along with Result"
                    style={{ marginTop: "15px" }}
                  >
                    <Radio.Group
                      value={show_rank_along_with_result}
                      onChange={(e) =>
                        set_show_rank_along_with_result(e.target.value)
                      }
                    >
                      <Radio value={0}>No</Radio>
                      <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                    {errors?.show_rank_along_with_result && (
                      <span style={{ color: "red" }}>
                        {errors.show_rank_along_with_result}
                      </span>
                    )}
                  </Form.Item>



                  <Form.Item
                    label="Show Solutions to learner"
                    style={{ marginTop: "15px" }}
                  >
                    <Radio.Group
                      value={show_solution}
                      onChange={(e) => set_show_solution(e.target.value)}
                    >
                      <Radio value="No">No</Radio>
                      <Radio value="Yes - After complete attempt">
                        Yes - After complete attempt
                      </Radio>
                      <Radio value="Yes - After each question">
                        Yes - After each question
                      </Radio>
                      <Radio value="Yes - After complete attempt - no demand">
                        Yes - After complete attempt - no demand
                      </Radio>
                    </Radio.Group>
                    {errors?.show_solution && (
                      <span style={{ color: "red" }}>{errors.show_solution}</span>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Switch
                        checked={share_performance === 1}
                        onChange={(checked) =>
                          set_share_performance(checked ? 1 : 0)
                        }
                      />
                      <span>Allow learners to share performance report</span>
                    </Space>
                    {errors?.share_performance && (
                      <span style={{ color: "red" }}>
                        {errors.share_performance}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Switch
                        checked={show_custom_messages === 1}
                        onChange={(checked) =>
                          set_show_custom_messages(checked ? 1 : 0)
                        }
                      />
                      <span>Show Custom message based on user performance</span>
                    </Space>
                    {errors?.show_custom_messages && (
                      <span style={{ color: "red" }}>
                        {errors.show_custom_messages}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Switch
                        checked={arrange_questions_by_topic === 1}
                        onChange={(checked) =>
                          set_arrange_questions_by_topic(checked ? 1 : 0)
                        }
                      />
                      <span>Arrange Questions by topic</span>
                    </Space>
                    {errors?.arrange_questions_by_topic && (
                      <span style={{ color: "red" }}>
                        {errors.arrange_questions_by_topic}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Switch
                        checked={enable_section_grouping === 1}
                        onChange={(checked) =>
                          set_enable_section_grouping(checked ? 1 : 0)
                        }
                      />
                      <span>Enable section wise grouping</span>
                    </Space>
                    {errors?.enable_section_grouping && (
                      <span style={{ color: "red" }}>
                        {errors.enable_section_grouping}
                      </span>
                    )}
                  </Form.Item>
                </>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={() => handleSubmit(show_edit_button)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Saving...
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : show_edit_button ? (
                    "Update"
                  ) : (
                    "Save"
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

export default QuizSetting;
