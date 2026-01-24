import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Upload,
  Button,
  message,
  App
} from 'antd';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import CustomRichTextEditor from '../../components/CustomTextEditor';
import { EDIT_TRAININGS, VIEW_TRAININGS } from '../../apis/apis';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function EditUpcomingTrainings() {
  const navigate = useNavigate();
  const {id} = useParams()
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  // Form fields state
  const [title, set_title] = useState('');
  const [short_description, set_short_description] = useState('');
  const [description, set_description] = useState('');
  const [category, set_category] = useState('');
  const [training_type, set_training_type] = useState('');
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  const [enrollment_start, set_enrollment_start] = useState(null);
  const [enrollment_end, set_enrollment_end] = useState(null);
  const [duration_minutes, set_duration_minutes] = useState('');
  const [trainer, set_trainer] = useState('');
  const [is_mandatory, set_is_mandatory] = useState(false);
  const [is_active, set_is_active] = useState(true);
  const [banner, set_Banner] = useState(null);
  const [errors, set_errors] = useState("");
  

useEffect(() => {
  setLoading(true);
  const VIEW_API = async () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));

    try {
      const response = await VIEW_TRAININGS(FORM_DATA);

      if (response?.data?.status) {
        const data = response.data.data;

        // Populate form fields from API response
        set_title(data.title || '');
        set_short_description(data.short_description || '');
        set_description(data.description || '');
        set_category(data.category || '');
        set_training_type(data.training_type || '');
        set_start_date(data.start_date ? moment(data.start_date) : null);
        set_end_date(data.end_date ? moment(data.end_date) : null);
        set_enrollment_start(data.enrollment_start ? moment(data.enrollment_start) : null);
        set_enrollment_end(data.enrollment_end ? moment(data.enrollment_end) : null);
        set_duration_minutes(data.duration_minutes || '');
        set_trainer(data.trainer || '');
        set_is_mandatory(data.is_mandatory || false);
        set_is_active(data.is_active || true);
        // If the API returns a banner URL, you can set it as a dummy file
       setLoading(false);
      } else {
        message.error(response?.data?.message || 'Failed to fetch training details');
      }
    } catch (error) {
      message.error('Server Error: ' + (error?.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  VIEW_API();
}, [id]);

const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append('title', title);
    FORM_DATA.append('short_description', short_description);
    FORM_DATA.append('description', description);
    FORM_DATA.append('category', category);
    FORM_DATA.append('training_type', training_type);
    FORM_DATA.append(
      'start_date',
      start_date ? start_date.format('YYYY-MM-DD HH:mm:ss') : ''
    );

    FORM_DATA.append(
      'end_date',
      end_date ? end_date.format('YYYY-MM-DD HH:mm:ss') : ''
    );

    FORM_DATA.append(
      'enrollment_start',
      enrollment_start ? enrollment_start.format('YYYY-MM-DD HH:mm:ss') : ''
    );

    FORM_DATA.append(
      'enrollment_end',
      enrollment_end ? enrollment_end.format('YYYY-MM-DD HH:mm:ss') : ''
    );

    FORM_DATA.append('duration_minutes', duration_minutes);
    FORM_DATA.append('trainer', trainer);
    FORM_DATA.append('is_mandatory', is_mandatory ? 1 : 0);
    FORM_DATA.append('is_active', is_active ? 1 : 0);

    if (banner) FORM_DATA.append('banner', banner);

    try {
      const response = await EDIT_TRAININGS(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: 'Successful',
          description: response?.data?.message,
        });
        navigate('/upcoming-trainings');
      } else {
       setLoading(false);
       set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        'Server Error: ' + (error?.response?.data?.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="lms-body">
      <Card>

      {loading ? <CulsightPageLoader /> :<>
 <h2> <span style={{ cursor: "pointer" }}
              onClick={() => navigate("/upcoming-trainings")}><LeftOutlined /></span>Edit Trainings Details</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Title">
            <Input value={title} onChange={(e) => set_title(e.target.value)} />
             {errors?.title && (
              <span style={{ color: "red" }}>{errors.title}</span>
            )}
          </Form.Item>

          <Form.Item label="Short Description">
            <Input
              value={short_description}
              onChange={(e) => set_short_description(e.target.value)}
            /> {errors?.short_description && (
              <span style={{ color: "red" }}>{errors.short_description}</span>
            )}
          </Form.Item>

          <CustomRichTextEditor
            value={description}
            editorLabel="Description"
            onChange={set_description}
            placeholder="Write something..."
          />{errors?.description && (
            <span style={{ color: "red" }}>{errors.description}</span>
          )}

          <Form.Item label="Category" style={{ marginTop: '15px' }}>
            <Select onChange={set_category} value={category}>
              <Select.Option value="tech">Tech</Select.Option>
              <Select.Option value="hr">HR</Select.Option>
              <Select.Option value="course">Course</Select.Option>
              <Select.Option value="package">Package</Select.Option>
            </Select>
             {errors?.category && (
              <span style={{ color: "red" }}>{errors.category}</span>
            )}
          </Form.Item>

          <Form.Item label="Training Type">
            <Select onChange={set_training_type} value={training_type}>
              <Select.Option value="online">Online</Select.Option>
              <Select.Option value="offline">Offline</Select.Option>
            </Select>
            {errors?.training_type && (
              <span style={{ color: "red" }}>{errors.training_type}</span>
            )}
          </Form.Item>

          <Form.Item label="Start Date">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_start_date}
              value={start_date}
            /> {errors?.start_date && (
              <span style={{ color: "red" }}>{errors.start_date}</span>
            )}
          </Form.Item>

          <Form.Item label="End Date">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_end_date}
              value={end_date}
            /> {errors?.end_date && (
              <span style={{ color: "red" }}>{errors.end_date}</span>
            )}
          </Form.Item>

          <Form.Item label="Enrollment Start">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_enrollment_start}
              value={enrollment_start}
            /> {errors?.enrollment_start && (
              <span style={{ color: "red" }}>{errors.enrollment_start}</span>
            )}
          </Form.Item>

          <Form.Item label="Enrollment End">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_enrollment_end}
              value={enrollment_end}
            /> {errors?.enrollment_end && (
              <span style={{ color: "red" }}>{errors.enrollment_end}</span>
            )}
          </Form.Item>

          <Form.Item label="Duration (Minutes)">
            <Input
              type="number"
              value={duration_minutes}
              onChange={(e) => set_duration_minutes(e.target.value)}
            /> {errors?.duration_minutes && (
              <span style={{ color: "red" }}>{errors.duration_minutes}</span>
            )}
          </Form.Item>

          <Form.Item label="Trainer">
            <Input value={trainer} onChange={(e) => set_trainer(e.target.value)} />{errors?.trainer && (
              <span style={{ color: "red" }}>{errors.trainer}</span>
            )}
          </Form.Item>

          <Form.Item label="Mandatory">
            <Switch checked={is_mandatory} onChange={set_is_mandatory} /> {errors?.is_mandatory && (
              <span style={{ color: "red" }}>{errors.is_mandatory}</span>
            )}
          </Form.Item>

          <Form.Item label="Active">
            <Switch checked={is_active} onChange={set_is_active} /> {errors?.is_active && (
              <span style={{ color: "red" }}>{errors.is_active}</span>
            )}
          </Form.Item>

          <Form.Item label="Banner">
            <Upload
              beforeUpload={(file) => {
                set_Banner(file);
                return false;
              }}
              fileList={banner ? [banner] : []}
            >
              <Button icon={<UploadOutlined />}>Upload Banner</Button>
            </Upload>  {errors?.banner && (
              <span style={{ color: "red" }}>{errors.banner}</span>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Training
            </Button>
          </Form.Item>
        </Form>
      </>}
      
      </Card>
    </div>
  );
}

export default EditUpcomingTrainings;
