import React, { useState } from 'react';
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
import { ADD_TRAININGS } from '../../apis/apis';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function AddUpcomingTrainings() {
  const navigate = useNavigate();
  const { notification } = App.useApp();

  const [loading, setLoading] = useState(false);

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

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();

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
      const response = await ADD_TRAININGS(FORM_DATA);

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
        <h2>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/upcoming-trainings")}>
            <LeftOutlined />
          </span>
          Add Upcomming training details
        </h2>

        <Form layout="vertical" onFinish={onFinish}>

          <Form.Item label="Title">
            <Input value={title} onChange={(e) => set_title(e.target.value)} />
            {errors?.title && <span style={{ color: "red" }}>{errors.title}</span>}
          </Form.Item>

          <Form.Item label="Short Description">
            <Input
              value={short_description}
              onChange={(e) => set_short_description(e.target.value)}
            />
            {errors?.short_description && (
              <span style={{ color: "red" }}>{errors.short_description}</span>
            )}
          </Form.Item>

          <CustomRichTextEditor
            value={description}
            editorLabel="Description"
            onChange={set_description}
            placeholder="Write something..."
          />
          {errors?.description && <span style={{ color: "red" }}>{errors.description}</span>}

          <Form.Item label="Category" style={{ marginTop: '15px' }}>
            <Select onChange={set_category} value={category}>
              <Select.Option value="tech">Tech</Select.Option>
              <Select.Option value="hr">HR</Select.Option>
              <Select.Option value="course">Course</Select.Option>
              <Select.Option value="package">Package</Select.Option>
            </Select>
            {errors?.category && <span style={{ color: "red" }}>{errors.category}</span>}
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

          {/* START DATE */}
          <Form.Item label="Start Date">
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                set_start_date(date);
                set_end_date(null); // reset end date
              }}
              value={start_date}
            />
            {errors?.start_date && <span style={{ color: "red" }}>{errors.start_date}</span>}
          </Form.Item>

          {/* END DATE */}
          <Form.Item label="End Date">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_end_date}
              value={end_date}
              disabledDate={(current) =>
                start_date && current.isBefore(start_date.startOf('day'))
              }
            />
            {errors?.end_date && <span style={{ color: "red" }}>{errors.end_date}</span>}
          </Form.Item>

          {/* ENROLLMENT START */}
          <Form.Item label="Enrollment Start">
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                set_enrollment_start(date);
                set_enrollment_end(null); // reset enrollment end
              }}
              value={enrollment_start}
            />
            {errors?.enrollment_start && (
              <span style={{ color: "red" }}>{errors.enrollment_start}</span>
            )}
          </Form.Item>

          {/* ENROLLMENT END */}
          <Form.Item label="Enrollment End">
            <DatePicker
              style={{ width: '100%' }}
              onChange={set_enrollment_end}
              value={enrollment_end}
              disabledDate={(current) =>
                enrollment_start && current.isBefore(enrollment_start.startOf('day'))
              }
            />
            {errors?.enrollment_end && (
              <span style={{ color: "red" }}>{errors.enrollment_end}</span>
            )}
          </Form.Item>

          <Form.Item label="Duration (Minutes)">
            <Input
              type="number"
              value={duration_minutes}
              onChange={(e) => set_duration_minutes(e.target.value)}
            />
            {errors?.duration_minutes && (
              <span style={{ color: "red" }}>{errors.duration_minutes}</span>
            )}
          </Form.Item>

          <Form.Item label="Trainer">
            <Input value={trainer} onChange={(e) => set_trainer(e.target.value)} />
            {errors?.trainer && <span style={{ color: "red" }}>{errors.trainer}</span>}
          </Form.Item>

          <Form.Item label="Mandatory">
            <Switch checked={is_mandatory} onChange={set_is_mandatory} />
          </Form.Item>

          <Form.Item label="Active">
            <Switch checked={is_active} onChange={set_is_active} />
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
            </Upload>
            {errors?.banner && <span style={{ color: "red" }}>{errors.banner}</span>}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Training
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
}

export default AddUpcomingTrainings;
