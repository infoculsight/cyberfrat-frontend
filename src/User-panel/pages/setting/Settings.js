import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import CulsightPageLoader from "../../../User-panel/components/CulsightPageLoader";
import { EDIT_LEARNER, VIEW_PROFILE } from "../../apis/apis";
import { UploadOutlined } from "@ant-design/icons";
import LmsCountryDropdown from "../../../User-panel/components/LmsCountryDropdown";


function Settings() {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, set_email] = useState("");
  const [contact_no, set_contact_no] = useState("");
  const [image, set_image] = useState("");
  const [image_file, set_image_file] = useState(null);
  const [country_code, set_country_code] = useState("IN");
  const [imageError, setImageError] = useState("");


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };


  const props = {
    name: "avatar",
    accept: ".jpg,.jpeg,.png",
    showUploadList: false,
    beforeUpload: (file) => {
      const isValidType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";

      if (!isValidType) {
        setImageError("Only JPG/PNG files are allowed.");
        return Upload.LIST_IGNORE;
      }

      const isLt500KB = file.size <= 512000;
      if (!isLt500KB) {
        setImageError("Image must be 500KB or smaller.");
        return Upload.LIST_IGNORE;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        if (width === 600 && height === 400) {
          setImageError("");
          getBase64(file, (url) => set_image(url));
          set_image_file(file);
        } else {
          setImageError("Image must be exactly 600x400 pixels.");
        }
      };

      return false; // Prevent automatic upload
    },
  };


  const fetchProfile = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    const EDIT_API_RESPONSE = await VIEW_PROFILE(FORM_DATA);

    if (EDIT_API_RESPONSE?.data?.status) {
      const response_data = EDIT_API_RESPONSE?.data?.data;
      set_first_name(response_data?.first_name);
      set_last_name(response_data?.last_name);
      set_email(response_data?.email);
      set_contact_no(parseInt(response_data?.contact_no));
      set_country_code(response_data?.country_code);
      if (response_data?.image) {
          set_image(response_data.image);
        } else {
          set_image("");
        }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("first_name", first_name);
    FORM_DATA.append("last_name", last_name);
    FORM_DATA.append("contact_no", contact_no);
    FORM_DATA.append("country_code", country_code);
    if (image_file) {
      FORM_DATA.append("image", image_file);
    }

    try {
      const response = await EDIT_LEARNER(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        await fetchProfile();
      } else {
        setLoading(false);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
      setLoading(false);
    }
  };

  return (
    <div className="lms-body">
      <Card>
       
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  {loading ? (
                    <CulsightPageLoader />
                  ) : (
                    <>
                      <Row>
                        <Col span={4}>
                        {image ? <>
                          <img
                            src={image}
                            alt="Profile Pic"
                            style={{
                              width: 150,
                              height: 150,
                              margin: "20px auto",
                              marginTop: "-20px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </> : <>
                         <div
                            
                            style={{
                              width: 150,
                              height: 150,
                              margin: "20px auto",
                              marginTop: "-20px",
                              backgroundColor:"#ccc",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          ></div>
                           </>}
                        
                        </Col>
                        <Col span={20}>
                          <h2 style={{ margin: "0px", padding: "0px", marginTop: "15px" }}>
                            {first_name} {last_name}
                          </h2>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24} style={{ display: "flex" }}>
                          <Upload {...props}>
                            <Button
                              icon={<UploadOutlined />}
                              type="text"
                              style={{ marginTop: "-5px" }}
                            >
                              Click to Upload
                            </Button>
                          </Upload>
                        </Col>
                          {imageError && (
                            <p style={{ color: "red", marginTop: 8 }}>{imageError}</p>
                          )}
                      </Row>
                      <Row style={{ marginTop: "30px" }}>
                        <Col span={24}>
                          <span style={{ color: "gray" }}>
                            Maximum size: 500KB, Supported Formats: JPG, PNG, JPEG.
                          </span>
                        </Col>
                      </Row>
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid gray",
                          marginTop: "15px",
                        }}
                      />
                      <Form
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onFinish}
                        form={form}
                        validateTrigger="onSubmit"
                      >
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Form.Item label="First Name">
                              <Input
                                value={first_name}
                                onChange={(e) => set_first_name(e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Last Name">
                              <Input
                                value={last_name}
                                onChange={(e) => set_last_name(e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item label="Email ID">
                          <Input value={email} disabled />
                        </Form.Item>
                        <Form.Item label="Contact Number">
                          <LmsCountryDropdown
                            country={country_code}
                            contact={contact_no}
                            set_country_code={set_country_code}
                            set_contact_no={set_contact_no}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Edit
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
         
      </Card>
    </div>
  );
}

export default Settings;
