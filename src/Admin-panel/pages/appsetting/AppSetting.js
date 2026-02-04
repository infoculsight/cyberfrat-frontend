import {
  Button,
  Card,
  Form,
  Input,
  message,
  Radio,
  App,
  Spin,
  Upload,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { APP_SETTING } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import {
  Loading3QuartersOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";


export default function AddAppSetting() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [banner, set_banner] = useState("");
  const [banner_api, set_banner_api] = useState("");
  const [banner_heading, set_banner_heading] = useState("");
  const [button_text, set_button_text] = useState("");
  const [web_link, set_web_link] = useState("");
  const [show_leaderboard_on_lms, set_show_leaderboard_on_lms] = useState(0);
  const [number_of_upcoming_event, set_number_of_upcoming_event] = useState("");
  const [number_of_news, set_number_of_news] = useState("");
  const [errors, set_errors] = useState("");
  const [bannerError, setbannerError] = useState("");

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
    set_banner_api(info.file);
    if (info.file.status === "done") {
      console.log(info.file.originFileObj);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        set_banner(url);
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


  //ADD API
  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("banner", banner_api);
    FORM_DATA.append("banner_heading", banner_heading);
    FORM_DATA.append("button_text", button_text);
    FORM_DATA.append("web_link", web_link);
    FORM_DATA.append("number_of_upcoming_event", number_of_upcoming_event);
    FORM_DATA.append("number_of_news", number_of_news);
    FORM_DATA.append(
      "show_leaderboard_on_lms",
      show_leaderboard_on_lms.toString()
    );
    try {
      const response = await APP_SETTING(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        setLoading(false);
        navigate("/app-setting");
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

  useEffect(() => {
    const view_api = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      try {
        const response = await APP_SETTING(FORM_DATA);
        if (response?.data?.status) {
          const response_data = response?.data?.data;
          set_banner_heading(response_data?.banner_heading);;
          set_show_leaderboard_on_lms(Number(response_data?.show_leaderboard_on_lms));
          set_button_text(response_data?.button_text);
          set_web_link(response_data?.web_link);
          set_number_of_upcoming_event(response_data?.number_of_upcoming_event);
          set_number_of_news(response_data?.number_of_news);

          if (response_data?.banner) {
            set_banner(response_data.banner);
          } else {
            set_banner("");
          }
          setLoading(false);
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
    view_api()
  }, []);



  return (
    <div className="lms-body">

      <Card>
        <h2> App Setting</h2>
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
              <Form.Item label="Upload Banner here">
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
                      set_banner_api('');
                      set_banner('')
                      setbannerError("Only JPG/PNG files are allowed.");
                      return false;
                    }

                    if (!isLt512KB) {
                      set_banner_api('');
                      set_banner('')
                      setbannerError("banner must be smaller than or equal to 512KB.");
                      return false;
                    }
                    const img = new Image();
                    img.src = URL.createObjectURL(file);

                    img.onload = () => {
                      const { width, height } = img;
                      // Example: Minimum 300x300 pixels
                      if (width === 490 && height === 320) {
                        setbannerError(""); // Clear errors if valid

                        // Set preview and file for API
                        getBase64(file, (url) => set_banner(url));
                        set_banner_api(file);

                      } else {
                        set_banner_api('');
                        set_banner('')
                        setbannerError("Image must be at least 490x320 pixels.");
                      }

                    };
                    return false;

                  }}
                  onChange={handleChange}
                >
                  {banner ? (
                    <img
                      src={banner}
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
                {bannerError && (
                  <span
                    style={{ color: "red", display: "block", marginTop: 8 }}
                  >
                    {bannerError}
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
                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - banner must be smaller than or equal to 512KB and must be at least 490x320 pixels.</p>
              </Form.Item>

              <Form.Item label="Banner Heading">
                <Input
                  value={banner_heading}
                  onChange={(e) => set_banner_heading(e.target.value)}
                />
                {errors?.banner_heading && (
                  <span style={{ color: "red" }}>{errors.banner_heading}</span>
                )}
              </Form.Item>

              <Form.Item label="Button Text">
                <Input
                  value={button_text}
                  onChange={(e) => set_button_text(e.target.value)}
                />
                {errors?.button_text && (
                  <span style={{ color: "red" }}>{errors.button_text}</span>
                )}
              </Form.Item>

              <Form.Item label="Web Link">
                <Input
                  value={web_link}
                  onChange={(e) => set_web_link(e.target.value)}
                />
                {errors?.web_link && (
                  <span style={{ color: "red" }}>{errors.web_link}</span>
                )}
              </Form.Item>

              <Form.Item label="Number upcoming event">
                <InputNumber style={{ width: "100%" }} value={number_of_upcoming_event} onChange={(value) => set_number_of_upcoming_event(value)} placeholder="Enter here" />
                {errors?.number_of_upcoming_event && (
                  <span style={{ color: "red" }}>{errors.number_of_upcoming_event}</span>
                )}
              </Form.Item>
              <Form.Item label="Number of News">
                <InputNumber style={{ width: "100%" }} value={number_of_news} onChange={(value) => set_number_of_news(value)} placeholder="Enter here" />
                {errors?.validity && (
                  <span style={{ color: "red" }}>{errors.number_of_news}</span>
                )}
              </Form.Item>


              <Form.Item label="Show Leaderboard On LMS">
                <Radio.Group
                  value={show_leaderboard_on_lms}
                  onChange={(e) => set_show_leaderboard_on_lms(e.target.value)}
                >
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}> No </Radio>
                </Radio.Group>
                {errors?.show_leaderboard_on_lms ? (
                  <>
                    <span style={{ color: "red" }}>
                      {errors?.show_leaderboard_on_lms}
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
