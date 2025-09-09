import {
  App,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

import {
  ADD_ASSIGNMENT,
  EDIT_ASSIGNMENT,
  VIEW_ASSIGNMENT,
} from "../../../../apis/apis";
import CulsightPageLoader from "../../../../components/CulsightPageLoader";
import CustomRichTextEditor from "../../../../components/CustomTextEditor";

import dayjs from "dayjs";

export default function Assignment({ course_id, chapter_id }) {
  const { notification } = App.useApp();
  const [assignment_id, set_assignment_id] = useState();
  const [loading, setLoading] = useState(true);
  const [show_edit_button, set_edit_button] = useState(false);
  const [edit_loading, set_edit_loading] = useState(false);
  const [title, set_title] = useState("");
  const [tag, set_tag] = useState([]);
  const [availability_settings, set_availability_settings] = useState("");
  const [instructions, set_instructions] = useState("");
  const [email_send_on_submission, set_email_send_on_submission] = useState("");
  const [template, set_template] = useState("");
  const [confirmation_message, set_confirmation_message] = useState("");
  const [errors, set_errors] = useState({});
  const [form] = Form.useForm();

  const [availability_date, set_availability_date] = useState(null);

  useEffect(() => {
    const VIEW_API = async () => {
      const TOKEN = localStorage.getItem("token");
      const FORM_DATA = new FormData();
      FORM_DATA.append("token", TOKEN);
      FORM_DATA.append("chapter_id", atob(chapter_id));
      FORM_DATA.append("course_id", course_id);

      const response = await VIEW_ASSIGNMENT(FORM_DATA);
      if (response?.data?.status) {
        const data = response.data.data;
        set_assignment_id(data?.id);
        set_title(data?.title);
        set_tag(
          Array.isArray(data?.tag) ? data.tag : data?.tag?.split(",") || []
        );
        set_instructions(data?.instructions);
        set_availability_settings(data?.availability_settings);
        set_availability_date(data?.availability_date ? dayjs(data.availability_date) : null);

        set_email_send_on_submission(Number(data?.email_send_on_submission));
        set_template(data?.template);
        set_confirmation_message(data?.confirmation_message);
        set_edit_button(true);
      }
      setLoading(false);
    };

    if (course_id && chapter_id) {
      VIEW_API();
    }
  }, [course_id, chapter_id]);

  const handleSubmit = async (isEdit) => {
    setLoading(true);
    const FORM_DATA = new FormData();

    FORM_DATA.append("token", localStorage.getItem("token"));
    FORM_DATA.append("title", title);
    FORM_DATA.append("tag", Array.isArray(tag) ? tag.join(",") : tag);
    FORM_DATA.append("instructions", instructions);
    FORM_DATA.append("availability_settings", availability_settings);
    FORM_DATA.append("email_send_on_submission", email_send_on_submission.toString());
    FORM_DATA.append("template", template);
    FORM_DATA.append("confirmation_message", confirmation_message);
    FORM_DATA.append("course_id", course_id);
    FORM_DATA.append("chapter_id", atob(chapter_id));

    // ✅ Send separate availability_date only if needed
    if (availability_settings === "time_based" && availability_date) {
      FORM_DATA.append("availability_date", availability_date.toISOString());
    }

    if (isEdit) {
      FORM_DATA.append("id", assignment_id);
    }

    try {
      const response = isEdit
        ? await EDIT_ASSIGNMENT(FORM_DATA)
        : await ADD_ASSIGNMENT(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response.data.message,
        });
        set_edit_loading(true);
      } else {
        set_errors(response.data.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
    setLoading(false);
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
                <Form.Item label="Title">
                  <Input
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
                    placeholder="Please select"
                    style={{ width: "100%" }}
                  />
                  {errors?.tag && (
                    <span style={{ color: "red" }}>{errors?.tag}</span>
                  )}
                </Form.Item>
                <CustomRichTextEditor
                  value={instructions}
                  editorLabel="Introduction"
                  onChange={(val) => set_instructions(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.instructions && (
                  <span style={{ color: "red" }}>{errors?.instructions}</span>
                )}

                {/* <Form.Item label="Availability Settings">
                <Radio.Group
                  value={availability_settings}
                  onChange={(e) => set_availability_settings(e.target.value)}
                >
                  <Radio value="Always Available">Always Available</Radio>
                  <Radio value="Time Based">Time Based</Radio>
                </Radio.Group>
                {errors?.availability_settings && (
                  <span style={{ color: "red" }}>
                    {errors.availability_settings}
                  </span>
                )}
              </Form.Item> */}

                <Form.Item label="Availability Settings">
                  <Radio.Group
                    value={availability_settings}
                    onChange={(e) => {
                      set_availability_settings(e.target.value);
                      if (e.target.value === "Always Available") {
                        set_availability_date(null); // clear date if not needed
                      }
                    }}
                  >
                    <Radio value="Always Available">Always Available</Radio>
                    <Radio value="time_based">Time Based</Radio>
                  </Radio.Group>


                  {/* 👇 Show if actual date string is present */}
                  {(availability_settings === "time_based" ||
                    availability_date) && (
                      <Form.Item
                        label="Select Date & Time"
                        style={{ marginTop: 10 }}
                      >
                        <DatePicker
                          showTime
                          style={{ width: "100%" }}
                          value={availability_date}
                          onChange={(val) => set_availability_date(val)}
                        />

                      </Form.Item>
                    )}

                  {errors?.availability_settings && (
                    <span style={{ color: "red" }}>
                      {errors.availability_settings}
                    </span>
                  )}
                </Form.Item>

                <Form.Item label="Email Notification on Submission">
                  <Radio.Group
                    value={email_send_on_submission}
                    onChange={(e) =>
                      set_email_send_on_submission(e.target.value)
                    }
                  >
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {errors?.email_send_on_submission && (
                    <span style={{ color: "red" }}>
                      {errors.email_send_on_submission}
                    </span>
                  )}
                </Form.Item>
                <Form.Item label="Template (PDF)">
                  <Upload
                    accept=".pdf"
                    beforeUpload={(file) => {
                      const isPDF = file.type === "application/pdf";
                      const isLt10M = file.size / 1024 / 1024 < 10;

                      if (!isPDF) {
                        message.error("Only PDF files are allowed.");
                        return Upload.LIST_IGNORE;
                      }

                      if (!isLt10M) {
                        message.error("File must be smaller than 10MB.");
                        return Upload.LIST_IGNORE;
                      }

                      set_template(file);
                      message.success(`${file.name} selected successfully.`);
                      return false; // Prevent auto-upload
                    }}
                    showUploadList={true}
                    fileList={template ? [template] : []}
                    onRemove={() => set_template(null)}
                  >
                    <Button icon={<UploadOutlined />}>Select PDF</Button>
                  </Upload>
                  {errors?.template && (
                    <span style={{ color: "red" }}>{errors?.template}</span>
                  )}
                </Form.Item>
                <CustomRichTextEditor
                  value={confirmation_message}
                  editorLabel="Confirmation Message"
                  onChange={(val) => set_confirmation_message(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.confirmation_message && (
                  <span style={{ color: "red" }}>
                    {errors?.confirmation_message}
                  </span>
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
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                        />
                      </>
                    ) : show_edit_button || edit_loading ? (
                      "Update"
                    ) : (
                      "Save"
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
