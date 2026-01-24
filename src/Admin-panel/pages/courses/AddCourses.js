import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Radio,
  Select,
  App,
  Spin,
  Upload,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import { ADD_COURSE } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import {
  LeftOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import CulsightPageLoader from "../../components/CulsightPageLoader";

import CustomRichTextEditor from "../../components/CustomTextEditor";

export default function AddCourses() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [thumbnail, set_thumbnail] = useState("");
  const [thumbnail_api, set_thumbnail_api] = useState("");
  const [title, set_title] = useState("");
  const [tag, set_tag] = useState([]);
  const [instructor_display_name, set_instructor_display_name] = useState("");
  const [description, set_description] = useState("");
  const [course_tag_line, set_course_tag_line] = useState("");
  const [how_to_use, set_how_to_use] = useState("");
  const [language, set_language] = useState("");
  const [show_validity_to_learner, set_show_validity_to_learner] = useState(0);
  const [accessible_through, set_accessible_through] = useState([]);
  const [bookmark_course, set_bookmark_course] = useState(0);
  const [errors, set_errors] = useState("");
  const [thumbnailError, setthumbnailError] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    set_thumbnail_api(info.file);
    if (info.file.status === "done") {
      console.log(info.file.originFileObj);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        set_thumbnail(url);
      });
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("Upload failed. Please try again.");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? (
        <Loading3QuartersOutlined />
      ) : (
        <PlusOutlined style={{ color: "#fff" }} />
      )}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("thumbnail", thumbnail_api);
    FORM_DATA.append("tag", tag);
    FORM_DATA.append("title", title);
    FORM_DATA.append("instructor_display_name", instructor_display_name);
    FORM_DATA.append("description", description);
    FORM_DATA.append("course_tag_line", course_tag_line);
    FORM_DATA.append("how_to_use", how_to_use);
    FORM_DATA.append("language", language);
    FORM_DATA.append(
      "show_validity_to_learner",
      show_validity_to_learner.toString()
    );
    FORM_DATA.append("accessible_through", accessible_through);
    FORM_DATA.append("bookmark_course", bookmark_course.toString());

    try {
      const response = await ADD_COURSE(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });

       
        navigate("/courses");
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
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2> <span style={{ cursor: "pointer" }}
              onClick={() => navigate("/courses")}><LeftOutlined /></span>Course Details</h2>
          </Col>
        </Row>

        <h2>Add Course</h2>


        {loading ? (
          <>
            <CulsightPageLoader />
          </>
        ) : (
          <>
            <Form
              layout="vertical"
              form={form}
              autoComplete="off"
              validateTrigger="onSubmit"
              onFinish={onFinish}
            >
              <Form.Item label="Upload Course Photo here">
                <Upload
                  name="avatar"
                  style={{ width: "250px", minHeight: "200px" }}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    console.log(file)
                    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                    // const isLt2M = file.size <= 2 * 1024 * 1024;
                    const isLt512KB = file.size <= 512 * 1024;

                    if (!isJpgOrPng) {
                      set_thumbnail_api('');
                      set_thumbnail('')
                      setthumbnailError("Only JPG/PNG files are allowed.");
                      return false;
                    }

                    if (!isLt512KB) {
                      set_thumbnail_api('');
                      set_thumbnail('')
                      setthumbnailError("Thumbnail must be smaller than or equal to 512KB.");
                      return false;
                    }
                    const img = new Image();
                    img.src = URL.createObjectURL(file);

                    img.onload = () => {
                      const { width, height } = img;
                      // Example: Minimum 300x300 pixels
                      if (width === 490 && height === 320) {
                        setthumbnailError(""); // Clear errors if valid

                        // Set preview and file for API
                        getBase64(file, (url) => set_thumbnail(url));
                        set_thumbnail_api(file);

                      } else {
                        set_thumbnail_api('');
                        set_thumbnail('')
                        setthumbnailError("Image must be at least 490x320 pixels.");
                      }

                    };
                    return false;

                  }}
                  onChange={handleChange}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
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
                {thumbnailError && (
                  <span
                    style={{ color: "red", display: "block", marginTop: 8 }}
                  >
                    {thumbnailError}
                  </span>
                )}
                {/* Server-side validation error */}
                {errors?.thumbnail && (
                  <span
                    style={{ color: "red", display: "block", marginTop: 8 }}
                  >
                    {errors?.thumbnail}
                  </span>
                )}
                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 512KB and must be at least 490x320 pixels.</p>
              </Form.Item>

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
                {errors?.tag ? (
                  <>
                    <span style={{ color: "red" }}>{errors?.tag}</span>
                  </>
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label="Instructor Name">
                <Input
                  value={instructor_display_name}
                  onChange={(e) => set_instructor_display_name(e.target.value)}
                />
                {errors?.instructor_display_name ? (
                  <>
                    <span style={{ color: "red" }}>
                      {errors?.instructor_display_name}
                    </span>
                  </>
                ) : (
                  <></>
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
                  <span style={{ color: "red" }}>{errors.description}</span>
                )}
              </Form.Item>
              <Form.Item>
                <CustomRichTextEditor
                  value={course_tag_line}
                  editorLabel="Course Tag Line"
                  onChange={(val) => set_course_tag_line(val)}
                  placeholder="Write something..."
                />{" "}
                {errors?.course_tag_line && (
                  <span style={{ color: "red" }}>{errors.course_tag_line}</span>
                )}
              </Form.Item>

              <Form.Item>
                <CustomRichTextEditor
                  value={how_to_use}
                  editorLabel="How to use"
                  onChange={(val) => set_how_to_use(val)}
                  placeholder="Write something..."
                />
                {errors?.how_to_use && (
                  <span style={{ color: "red" }}>{errors.how_to_use}</span>
                )}
              </Form.Item>
              <Form.Item label="Language">
                <Input
                  value={language}
                  onChange={(e) => set_language(e.target.value)}
                />
                {errors?.language ? (
                  <>
                    <span style={{ color: "red" }}>{errors?.language}</span>
                  </>
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label="Show validity to learner">
                <Radio.Group
                  value={show_validity_to_learner}
                  onChange={(e) => set_show_validity_to_learner(e.target.value)}
                >
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}> No </Radio>
                </Radio.Group>
                {errors?.show_validity_to_learner ? (
                  <>
                    <span style={{ color: "red" }}>
                      {errors?.show_validity_to_learner}
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label="Accessible Through">
                <Checkbox.Group
                  value={accessible_through}
                  onChange={set_accessible_through}
                >
                  <Checkbox value="All">All</Checkbox>
                  <Checkbox value="Website">Website</Checkbox>
                  <Checkbox value="Android App">Android App</Checkbox>
                  <Checkbox value="IOS App">IOS App</Checkbox>
                </Checkbox.Group>
                {errors?.accessible_through ? (
                  <>
                    <span style={{ color: "red" }}>
                      {errors?.accessible_through}
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label="Bookmark Course">
                <Radio.Group
                  value={bookmark_course}
                  onChange={(e) => set_bookmark_course(e.target.value)}
                >
                  <Radio value={1}> Yes </Radio>
                  <Radio value={0}> No </Radio>
                </Radio.Group>
                {errors?.bookmark_course ? (
                  <>
                    <span style={{ color: "red" }}>
                      {errors?.bookmark_course}
                    </span>
                  </>
                ) : (
                  <></>
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
          </>
        )}
      </Card>
    </div>
  );
}
