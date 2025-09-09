import { App, Button, Card, Form, Input, message, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import CustomRichTextEditor from '../../components/CustomTextEditor'
import { useNavigate, useParams } from 'react-router-dom';
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import { EDIT_NOTIFICATION, VIEW_NOTIFICATION } from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function EditNotification() {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, set_title] = useState('');
  const [notification_from, set_notification_from] = useState('');
  const [notification_text, set_notification_text] = useState('');
  const [notification_type, set_notification_type] = useState('');
  const [errors, set_errors] = useState("");


 useEffect(() => {

  const VIEW_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));

    const EDIT_API_RESPONSE = await VIEW_NOTIFICATION(FORM_DATA);
    if (EDIT_API_RESPONSE?.data?.status) {
      const response_data = EDIT_API_RESPONSE?.data?.data;
      set_title(response_data?.title);
      set_notification_from(response_data?.notification_from);
      set_notification_text(response_data?.notification_text);

      const matchOption = (value) => {
        const options = [
          'course_assign', 'package_assign', 'add_course_in_package',
          'course_update', 'test_expire', 'result_declaration',
          'course_completion', 'test_submit', 'course_expire'
        ];
        return options.find(opt => opt.toLowerCase() === value?.toLowerCase()) || value;
      };

      set_notification_type(matchOption(response_data?.notification_type));
      setLoading(false);
    }
  };

  VIEW_API();
}, [id]);


    const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("title", title);
    FORM_DATA.append("notification_from", notification_from);
    FORM_DATA.append("notification_text", notification_text);
    FORM_DATA.append("notification_type", notification_type);
    try {
      const response = await EDIT_NOTIFICATION(FORM_DATA);

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
      <Card>

      {loading ?<>
        <CulsightPageLoader />
      </>:<>
 <h2><span style={{ cursor: "pointer" }}
              onClick={() => navigate("/notification")}><LeftOutlined /></span>Edit Notification</h2>
        <Form layout="vertical"  onFinish={onFinish} form={form} autoComplete="off" validateTrigger="onSubmit">
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
         

          <Form.Item label="Notification Type" >
            <Select
              placeholder="Select notification type"
              value={notification_type}
              disabled
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
              ]}
            />{errors?.notification_type && (
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
                      Update
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
                      Update
                    </Button>
                  </>
                )}
          </Form.Item>


        </Form>
      </>}
       
      </Card>

    </div>
  )
}

export default EditNotification
