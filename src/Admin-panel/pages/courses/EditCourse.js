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
import React, { useEffect, useState } from "react";
import { EDIT_COURSE, VIEW_COURSE } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import {
  LeftOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CustomRichTextEditor from "../../components/CustomTextEditor";
import CulsightPageLoader from "../../components/CulsightPageLoader";


export default function EditCourse() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page_loader, set_page_loader] = useState(true);
  const [form] = Form.useForm();
  const { id } = useParams();
  const [title, set_title] = useState("");
  const [tag, set_tag] = useState([]);
  const [thumbnail, set_thumbnail] = useState("");
  const [thumbnail_api, set_thumbnail_api] = useState("");
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


  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <Loading3QuartersOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));

      const EDIT_API_RESPONSE = await VIEW_COURSE(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_title(response_data?.title);
        set_tag(Array.isArray(response_data?.tag) ? response_data.tag : response_data?.tag?.split(',') || []);
        set_instructor_display_name(response_data?.instructor_display_name);
        set_description(response_data?.description);
        set_course_tag_line(response_data?.course_tag_line);
        set_how_to_use(response_data?.how_to_use);
        set_language(response_data?.language);
        set_show_validity_to_learner(Number(response_data?.show_validity_to_learner));
        set_accessible_through(response_data?.accessible_through);
        set_bookmark_course(Number(response_data?.bookmark_course));
        if (response_data?.thumbnail) {
          set_thumbnail(response_data.thumbnail);
        } else {
          set_thumbnail("");
        }
        set_page_loader(false);
      }
    };

    VIEW_API();
  }, [id]);


  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("thumbnail", thumbnail_api);
    FORM_DATA.append("tag", tag);
    FORM_DATA.append("title", title);
    FORM_DATA.append("instructor_display_name", instructor_display_name);
    FORM_DATA.append("description", description);
    FORM_DATA.append("course_tag_line", course_tag_line);
    FORM_DATA.append("how_to_use", how_to_use);
    FORM_DATA.append("language", language);
    FORM_DATA.append("show_validity_to_learner", show_validity_to_learner.toString());
    FORM_DATA.append("accessible_through", accessible_through);
    FORM_DATA.append("bookmark_course", bookmark_course.toString());

    try {
      const response = await EDIT_COURSE(FORM_DATA);
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
      message.error("Server Error: " + (error?.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="lms-body">
      <Card>
        {page_loader ? (
          <CulsightPageLoader />
        ) : (
          <>

            <Row>
              <Col span={12}>
                <h2><span style={{ cursor: "pointer" }} onClick={() => navigate("/courses")}><LeftOutlined /></span> Edit Course Details</h2>
              </Col>
            </Row>

            <Form layout="vertical" form={form} autoComplete="off" validateTrigger="onSubmit" onFinish={onFinish}>

              <Form.Item label="Upload Course Photo here">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  style={{ width: "250px", minHeight: "200px" }}
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    console.log(file)
                    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                    const isLt512KB = file.size <= 512 * 1024;
                    if (!isJpgOrPng) {
                      setthumbnailError("Only JPG/PNG files are allowed.");
                      return false;
                    }

                    if (!isLt512KB) {
                      setthumbnailError("Thumbnail must be smaller than or equal to 512KB.");
                      return false;
                    }
                    const img = new Image();
                    img.src = URL.createObjectURL(file);

                    img.onload = () => {
                      const { width, height } = img;
                      // Example: Minimum 600X400 pixels
                      if (width === 490 && height === 320) {
                        setthumbnailError(""); // Clear errors if valid

                        // Set preview and file for API
                        getBase64(file, (url) => set_thumbnail(url));
                        set_thumbnail_api(file);

                      } else {
                        setthumbnailError("Image must be at least 490x320 pixels.");
                      }

                    };
                    return false;

                  }}
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

                {thumbnailError && (
                  <span style={{ color: "red", display: "block", marginTop: 8 }}>{thumbnailError}</span>
                )}
                {errors?.thumbnail && (
                  <span style={{ color: "red", display: "block", marginTop: 8 }}>{errors?.thumbnail}</span>
                )}
                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 512KB and must be at least 490x320 pixels.</p>

              </Form.Item>

              <Form.Item label="Title">
                <Input value={title} onChange={(e) => set_title(e.target.value)} />
                {errors?.title && <span style={{ color: "red" }}>{errors?.title}</span>}
              </Form.Item>

              <Form.Item label="Tag">
                <Select
                  mode="tags"
                  value={tag}
                  onChange={set_tag}
                  placeholder="Please select"
                  style={{ width: "100%" }}
                />
                {errors?.tag && <span style={{ color: "red" }}>{errors?.tag}</span>}
              </Form.Item>

              <Form.Item label="Instructor Name">
                <Input
                  value={instructor_display_name}
                  onChange={(e) => set_instructor_display_name(e.target.value)}
                />
                {errors?.instructor_display_name && (
                  <span style={{ color: "red" }}>{errors?.instructor_display_name}</span>
                )}
              </Form.Item>

              <Form.Item>
                <CustomRichTextEditor
                  value={description}
                  editorLabel="Description"
                  onChange={(val) => set_description(val)}
                  placeholder="Write something..."
                />
              </Form.Item>

              <Form.Item>
                <CustomRichTextEditor
                  value={course_tag_line}
                  editorLabel="Course Tag Line"
                  onChange={(val) => set_course_tag_line(val)}
                  placeholder="Write something..."
                />
              </Form.Item>

              <Form.Item>
                <CustomRichTextEditor
                  value={how_to_use}
                  editorLabel="How to use"
                  onChange={(val) => set_how_to_use(val)}
                  placeholder="Write something..."
                />
              </Form.Item>

              <Form.Item label="Language">
                <Input value={language} onChange={(e) => set_language(e.target.value)} />
                {errors?.language && <span style={{ color: "red" }}>{errors?.language}</span>}
              </Form.Item>

              <Form.Item label="Show validity to learner">
                <Radio.Group
                  value={show_validity_to_learner}
                  onChange={(e) => set_show_validity_to_learner(e.target.value)}
                >
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}>No</Radio>
                </Radio.Group>
                {errors?.show_validity_to_learner && (
                  <span style={{ color: "red" }}>{errors?.show_validity_to_learner}</span>
                )}
              </Form.Item>

              <Form.Item label="Accessible Through">
                <Checkbox.Group value={accessible_through} onChange={set_accessible_through}>
                  <Checkbox value="All">All</Checkbox>
                  <Checkbox value="Website">Website</Checkbox>
                  <Checkbox value="Android App">Android App</Checkbox>
                  <Checkbox value="IOS App">IOS App</Checkbox>
                </Checkbox.Group>
                {errors?.accessible_through && (
                  <span style={{ color: "red" }}>{errors?.accessible_through}</span>
                )}
              </Form.Item>

              <Form.Item label="Bookmark Course">
                <Radio.Group value={bookmark_course} onChange={(e) => set_bookmark_course(e.target.value)}>
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}>No</Radio>
                </Radio.Group>
                {errors?.bookmark_course && (
                  <span style={{ color: "red" }}>{errors?.bookmark_course}</span>
                )}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ float: "right" }}>
                  {loading ? (
                    <>
                      Save <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </Form.Item>

            </Form>
          </>
        )}
      </Card>
    </div>
  );
}
