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
import { LeftOutlined, Loading3QuartersOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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
  const [errors, set_errors] = useState("");
  const [image, set_image] = useState("");
  const [image_api, set_image_api] = useState("");
  const [imageError, setimageError] = useState("");
  

    const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <Loading3QuartersOutlined /> : <PlusOutlined style={{ color: "#fff" }} />}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );


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
          if (data?.banner) {
          set_image(data.banner);
        } else {
          set_image("");
        }
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

    FORM_DATA.append('banner', image_api);

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
              onChange={(date) => {
                set_start_date(date);
                set_end_date(null); // reset end date
              }}
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
              disabledDate={(current) =>
                start_date && current.isBefore(start_date.startOf('day'))
              }
            /> {errors?.end_date && (
              <span style={{ color: "red" }}>{errors.end_date}</span>
            )}
          </Form.Item>

          <Form.Item label="Enrollment Start">
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                set_enrollment_start(date);
                set_enrollment_end(null); // reset enrollment end
              }}
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
               disabledDate={(current) =>
               enrollment_start && current.isBefore(enrollment_start.startOf('day'))
              }
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
                       name="avatar"
                       listType="picture-card"
                       className="avatar-uploader"
                       showUploadList={false}
                       beforeUpload={(file) => {
                         console.log(file)
                         const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                         const isLt2MB = file.size <= 2 * 1024 * 1024;
                         if (!isJpgOrPng) {
                           setimageError("Only JPG/PNG files are allowed.");
                           return false;
                         }
     
                         if (!isLt2MB) {
                           setimageError("Thumbnail must be smaller than or equal to 2MB.");
                           return false;
                         }
                         const img = new Image();
                         img.src = URL.createObjectURL(file);
     
                         img.onload = () => {
                           const { width, height } = img;
                           // Example: Minimum 600X400 pixels
                           if (width === 600 && height === 400) {
                             setimageError(""); // Clear errors if valid
     
                             // Set preview and file for API
                             getBase64(file, (url) => set_image(url));
                             set_image_api(file);
     
                           } else {
                             setimageError("Image must be at least 600x400 pixels.");
                           }
     
                         };
                         return false;
     
                       }}
     
                     >
                       {image ? (
                         <img
                           src={image}
                           alt="avatar"
                           style={{
                             width: "100%",
                             height: "100%",
                             objectFit: "cover",
                           }}
                         />
                       ) : (
                         uploadButton
                       )}
                     </Upload>
     
                     {/* Error message under the uploader */}
                     {imageError && (
                       <span
                         style={{ color: "red", display: "block", marginTop: 8 }}
                       >
                         {imageError}
                       </span>
                     )}
                     {/* Server-side validation error */}
                     {errors?.banner && (
                       <span
                         style={{ color: "red", display: "block", marginTop: 8 }}
                       >
                         {errors?.banner}
                       </span>
                     )}
     
                     <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 2MB and must be at least 600x400 pixels.</p>
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
