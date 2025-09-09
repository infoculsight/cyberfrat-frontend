import {
  App,
  Button,
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
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  EDIT_CHAPTER_SECTION
} from "../../../../../apis/apis"; // apna correct path dena
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import CustomRichTextEditor from "../../../../../components/CustomTextEditor";


export default function EditChapterSection({
  section_id,
  sectionData,
  onAddSuccess,
  onClose, // modal close function from parent
}) {
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [section_title, set_section_title] = useState("");
  const [section_tag, set_section_tag] = useState([]);
  const [description, set_description] = useState("");
  const [image, setimage] = useState("");
  const [image_api, set_image_api] = useState(null);
  const [errors, set_errors] = useState({});
  const [form] = Form.useForm();
  
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
    set_image_api(info.file);
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setimage(url);
      });
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("Upload failed. Please try again.");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined style={{ color: "#fff" }} />}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );



  useEffect(() => {
    if (sectionData) {

      set_section_title(sectionData?.title );
      set_section_tag(sectionData?.tags || []);
      set_description(sectionData?.description );

      if (sectionData?.image) {
        setimage(sectionData.image);
      } else {
        setimage("");
      }
    }
  }, [sectionData, form,section_id]);//section_id



  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
   // FORM_DATA.append("token", localStorage.getItem("token"));
    FORM_DATA.append("id",section_id);
    FORM_DATA.append("image", image_api);
    FORM_DATA.append("tags", section_tag);
    FORM_DATA.append("title", section_title);
    FORM_DATA.append("description", description);
  

    try {
      const response = await EDIT_CHAPTER_SECTION(FORM_DATA);

    if (response?.data?.status) {
  notification.success({
    message: "Successful",
    description: response?.data?.message,
  });

  onAddSuccess({
    ...sectionData,
    title: section_title,
    tags: section_tag,
    description: description,
    image: image,
    //id:section_id
  });

  onClose(); // close the modal from parent

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
    <div style={{ marginTop: "15px" }}>
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              validateTrigger="onSubmit"
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item label="Section Title">
                    <Input
                      value={section_title}
                      onChange={(e) => set_section_title(e.target.value)}
                    />
                    {errors?.title && (
                      <span style={{ color: "red" }}>{errors.title}</span>
                    )}
                  </Form.Item>

                  <Form.Item label="Section Tag">
                    <Select
                      mode="tags"
                      value={section_tag}
                      onChange={set_section_tag}
                      placeholder="Please select"
                      style={{ width: "100%" }}
                    />
                    {errors?.tags && (
                      <span style={{ color: "red" }}>{errors.tags}</span>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Image" style={{ float: "right" }}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isJpgOrPng =
                          file.type === "image/jpeg" || file.type === "image/png";
                        const isLt2M = file.size / 1024 / 1024 < 2;

                        if (!isJpgOrPng) {
                          message.error("You can only upload JPG/PNG file!");
                        }
                        if (!isLt2M) {
                          message.error("Image must be smaller than 2MB!");
                        }

                        if (isJpgOrPng && isLt2M) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setimage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                        return false;
                      }}
                      onChange={handleChange}
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
                  </Form.Item>
                </Col>
              </Row>

                 <CustomRichTextEditor
                    value={description}
                    editorLabel="description"
                    onChange={(val) => set_description(val)}
                    placeholder="Write something..."
                  />
                {errors?.description && (
                  <span style={{ color: "red" }}>{errors.description}</span>
                )}

              <Form.Item>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={onFinish}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Saving...
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    </>
                  ) : (
                    "Edit Section"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
}
