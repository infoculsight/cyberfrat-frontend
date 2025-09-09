import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import { useState } from "react";
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ADD_PACKAGE } from "../../apis/apis";
import CustomRichTextEditor from "../../components/CustomTextEditor";
import { useNavigate } from "react-router-dom";

export default function Packages() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [name, set_name] = useState("");
  const [validity, set_validity] = useState("");
  const [description, set_description] = useState("");
  const [how_to_use, set_how_to_use] = useState("");
  const [tag, set_tag] = useState([]);
  const [tag_line, set_tag_line] = useState("");
  const [thumbnail, set_thumbnail] = useState(null);
  const [thumbnail_api, set_thumbnail_api] = useState(null);
  const [errors, set_errors] = useState({});
  const [loading, setLoading] = useState(false);
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


  const handleSubmit = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();

    FORM_DATA.append("name", name);
    FORM_DATA.append("description", description);
    FORM_DATA.append("how_to_use", how_to_use);
    FORM_DATA.append("validity", validity);
    FORM_DATA.append("tags", Array.isArray(tag) ? tag.join(",") : tag);
    FORM_DATA.append("tag_line", tag_line);

    if (thumbnail_api) {
      FORM_DATA.append("thumbnail", thumbnail_api.originFileObj || thumbnail_api);
    }

    try {
      const response = await ADD_PACKAGE(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response.data.message,
        });
        navigate('/edit-package/' + btoa(response?.data?.data?.package_id));
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
    <div className="lms-body">
      <Card>

        <Row>
          <Col span={12}>
            <h2> <span style={{ cursor: "pointer" }}
              onClick={() => navigate("/packages")}><LeftOutlined /></span>Add Package</h2>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              validateTrigger="onSubmit"
            >
              <Form.Item label="Package Name">
                <Input value={name} onChange={(e) => set_name(e.target.value)} placeholder="Enter package name" />
                {errors?.name && (
                  <span style={{ color: "red" }}>{errors.name}</span>
                )}
              </Form.Item>

              <Form.Item label="Validity (In days)">
                <InputNumber style={{ width: "100%" }} min={1} max={10} value={validity} onChange={(value) => set_validity(value)} placeholder="Enter validity date" />
                {errors?.validity && (
                  <span style={{ color: "red" }}>{errors.validity}</span>
                )}
              </Form.Item>

              <Form.Item>

                <CustomRichTextEditor
                  value={description}
                  editorLabel="Description"
                  onChange={(val) => set_description(val)}
                  placeholder="Write something..."
                />
                {errors?.description && (
                  <span style={{ color: "red" }}>{errors?.description}</span>
                )}
              </Form.Item>

              <Form.Item>

                <CustomRichTextEditor
                  value={how_to_use}
                  editorLabel="How To Use"
                  onChange={(val) => set_how_to_use(val)}
                  placeholder="Write something..."
                />
                {errors?.how_to_use && (
                  <span style={{ color: "red" }}>{errors?.how_to_use}</span>
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

              <Form.Item label="Tag Line">
                <Input
                  value={tag_line}
                  onChange={(e) => set_tag_line(e.target.value)}
                />
                {errors?.tag_line && (
                  <span style={{ color: "red" }}>{errors.tag_line}</span>
                )}
              </Form.Item>

              <Form.Item label="Upload Your Photo here">
                <Upload
                  name="avatar"
                  style={{ width: "250px", minHeight: "200px" }}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    console.log(file)
                    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                    const isLt2M = file.size <= 512000;
                    if (!isJpgOrPng) {
                      set_thumbnail_api('');
                      set_thumbnail('')
                      setthumbnailError("Only JPG/PNG files are allowed.");
                      return false;
                    }

                    if (!isLt2M) {
                      set_thumbnail_api('');
                      set_thumbnail('')
                      setthumbnailError("Thumbnail must be smaller than or equal to 500KB.");
                      return false;
                    }
                    const img = new Image();
                    img.src = URL.createObjectURL(file);

                    img.onload = () => {
                      const { width, height } = img;
                      // Example: Minimum 300x300 pixels
                      if (width === 600 && height === 400) {
                        setthumbnailError(""); // Clear errors if valid

                        // Set preview and file for API
                        getBase64(file, (url) => set_thumbnail(url));
                        set_thumbnail_api(file);

                      } else {
                        set_thumbnail_api('');
                        set_thumbnail('')
                        setthumbnailError("Image must be at least 600x400 pixels.");
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
                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 2MB and must be at least 600x400 pixels.</p>
              </Form.Item>


              <Form.Item>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Saving...
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
