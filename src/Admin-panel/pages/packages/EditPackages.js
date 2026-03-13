import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,

  message,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { EDIT_PACKAGE, VIEW_PACKAGE } from "../../apis/apis";
import CustomRichTextEditor from "../../components/CustomTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function Packages() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [how_to_use, set_how_to_use] = useState("");
  // const [validity, set_validity] = useState("");
  const [tag, set_tag] = useState([]);
  const [tag_line, set_tag_line] = useState("");
  const [thumbnail, set_thumbnail] = useState(null);
  const [thumbnail_api, set_thumbnail_api] = useState(null);
  const [errors, set_errors] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
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
      const EDIT_API_RESPONSE = await VIEW_PACKAGE(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_name(response_data?.name);
        set_tag(Array.isArray(response_data?.tags) ? response_data.tags : response_data?.tags?.split(',') || []);
        set_description(response_data?.description);
        set_how_to_use(response_data?.how_to_use);
        // set_validity(response_data?.validity);
        set_tag_line(response_data?.tag_line);
        if (response_data?.thumbnail) {
          set_thumbnail(response_data.thumbnail);
        } else {
          set_thumbnail("");
        }
        setLoading(false);
      }
    };

    VIEW_API();
  }, [id]);


  const handleSubmit = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("name", name);
    FORM_DATA.append("description", description);
    FORM_DATA.append("how_to_use", how_to_use);
    // FORM_DATA.append("validity", validity);
    FORM_DATA.append("tags", Array.isArray(tag) ? tag.join(",") : tag);
    FORM_DATA.append("tag_line", tag_line);

    if (thumbnail_api) {
      FORM_DATA.append("thumbnail", thumbnail_api.originFileObj || thumbnail_api);
    }

    try {
      const response = await EDIT_PACKAGE(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response.data.message,
        });
        navigate('/packages');
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
            <h2><span  style={{ cursor: "pointer" }}
              onClick={() => navigate("/packages")}><LeftOutlined /></span>Edit Package</h2>
          </Col>
        </Row>

        {loading ? <CulsightPageLoader /> : <>
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              validateTrigger="onSubmit"
            >
              <Form.Item label="Package Name">
                <Input value={name} onChange={(e) => set_name(e.target.value)} />
                {errors?.name && (
                  <span style={{ color: "red" }}>{errors.name}</span>
                )}
              </Form.Item>

              {/* <Form.Item label="Validity (In days)">
                <InputNumber style={{width:"100%"}} value={validity} onChange={(value) => set_validity(value)} />
                {errors?.validity && (
                  <span style={{ color: "red" }}>{errors.validity}</span>
                )}
              </Form.Item> */}

              <Form.Item>
              <CustomRichTextEditor
                value={description}
                editorLabel="description"
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
                {errors?.tags && (
                  <span style={{ color: "red" }}>{errors?.tags}</span>
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

              <Form.Item>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Updating..
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        </>}
      </Card>
    </div>
  );
}
