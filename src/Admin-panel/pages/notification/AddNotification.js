import { App, Button, Card, Form, Input, message, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import CustomRichTextEditor from '../../components/CustomTextEditor'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { ADD_NOTIFICATION, NOTIFICATION_DROPDOWN } from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function AddNotification() {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState('');
  const [notification_from, set_notification_from] = useState('');
  const [notification_text, set_notification_text] = useState('');
  const [notification_type, set_notification_type] = useState('');
  const [available_dropdown, set_available_dropdown] = useState('');

  const [errors, set_errors] = useState("");

  useEffect(() => {
    const LIST_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      const API_CALL = await NOTIFICATION_DROPDOWN(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_available_dropdown(API_CALL?.data?.available_dropdown)
        setLoading(false);
      } else {
        console.log("error");
        setLoading(false);
      }
    };

    LIST_API();
  }, []);

  
  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("title", title);
    FORM_DATA.append("notification_from", notification_from);
    FORM_DATA.append("notification_text", notification_text);
    FORM_DATA.append("notification_type", notification_type);
    try {
      const response = await ADD_NOTIFICATION(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message
        });

        navigate("/notification");
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
    <div className='lms-body'>
      {loading ? <CulsightPageLoader /> : <>
        <Card>
          <h2><span style={{ cursor: "pointer" }}
            onClick={() => navigate("/notification")}><LeftOutlined /></span>Add Notification</h2>
          <Form layout="vertical" onFinish={onFinish} form={form} autoComplete="off" validateTrigger="onSubmit">
            <Form.Item label="Title" >
              <Input
                placeholder="Enter the title"
                value={title}
                onChange={(e) => set_title(e.target.value)}
              />{errors?.title && (
                <span style={{ color: "red" }}>{errors.title}</span>
              )}
            </Form.Item>

            <Form.Item label="Notification From">
              <Input
                placeholder="Enter here..."
                value={notification_from}
                onChange={(e) => set_notification_from(e.target.value)}
              />{errors?.notification_from && (
                <span style={{ color: "red" }}>{errors.notification_from}</span>
              )}
            </Form.Item>


            <CustomRichTextEditor
              editorLabel="Notification Text"
              placeholder="Write something..."
              value={notification_text}
              onChange={(value) => set_notification_text(value)}
            />{errors?.notification_text && (
              <span style={{ color: "red" }}>{errors.notification_text}</span>
            )}
            <br></br>

            <Form.Item label="Notification Type" >

              <Select
                placeholder="Select notification type"
                value={notification_type || null}   // null karega to placeholder dikhega
                onChange={(value) => set_notification_type(value)}
                options={[
                  { value: 'course_assign', label: 'Course Assign' },
                  { value: 'package_assign', label: 'Package Assign' },
                  { value: 'add_course_in_package', label: 'Add Course in Package' },
                  { value: 'course_update', label: 'Course Update' },
                  { value: 'test_expire', label: 'Test Expire' },
                  { value: 'result_declaration', label: 'Result Declaration' },
                  { value: 'course_completion', label: 'Course Completion' },
                  { value: 'test_submit', label: 'Test Submit' },
                  { value: 'course_expire', label: 'Course Expire' },
                  { value: 'certificate_issued', label: "Certificate Issued" },
                  { value: 'quiz_uploaded', label: "Quiz Uploaded" },
                  { value: 'livetest_assign', label: "Live Test Assign" },
                  { value: 'profile_update', label: "Profile Update" },
                  { value: 'course_reminder', label: "Course Reminder" },
                ].filter(opt => available_dropdown.includes(opt.value))}
              />
              {errors?.notification_type && (
                <span style={{ color: "red" }}>{errors.notification_type}</span>
              )}
            </Form.Item>

            <Form.Item>
              {loading ? (
                <>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Save
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </>
              )}
            </Form.Item>


          </Form>
        </Card>
      </>}
    </div>
  )
}

export default AddNotification
