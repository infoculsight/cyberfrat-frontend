import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Upload,
  message,
  App,
} from "antd";
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ADD_LEARNER } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import LmsCountryDropdown from "../../components/LmsCountryDropdown";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function AddLearners() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [image, set_image] = useState("");
  const [image_api, set_image_api] = useState("");
  const [email_send, set_email_send] = useState(false);
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [organization, set_organization] = useState("");
  const [designation, set_designation] = useState("");
  const [email, setEmail] = useState("");
  const [country_code, set_country_code] = useState("IN");
  const [contact_no, set_contact_no] = useState("");
  // const [password, set_password] = useState("");
  // const [confirm_password, set_confirm_password] = useState("");
  const [address_line_1, set_address_line1] = useState("");
  const [address_line_2, set_address_line2] = useState("");
  const [pin_code, set_pin_code] = useState("");
  const [errors, set_errors] = useState("");
  const [imageError, setimageError] = useState("");

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
      console.log(info.file.originFileObj);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        set_image(url);
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
    FORM_DATA.append("first_name", first_name);
    FORM_DATA.append("last_name", last_name);
    FORM_DATA.append("email", email);
    FORM_DATA.append("country_code", country_code);
    FORM_DATA.append("contact_no", contact_no);
    FORM_DATA.append("organization", organization);
    FORM_DATA.append("designation", designation);
    // FORM_DATA.append("password", password);
    // FORM_DATA.append("confirm_password", confirm_password);
    FORM_DATA.append("address_line_1", address_line_1);
    FORM_DATA.append("address_line_2", address_line_2);
    FORM_DATA.append("pin_code", pin_code);
    FORM_DATA.append("image", image_api);
    FORM_DATA.append("email_send", email_send);
    try {
      const response = await ADD_LEARNER(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        navigate("/learners");
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
        <div className="lms-form">


          <Row>
            <Col span={12}>
              <h2><span style={{ cursor: "pointer" }}
                onClick={() => navigate("/learners")}><LeftOutlined /></span> Add Learner</h2>
            </Col>
          </Row>
          {loading ? (
            <>
              <CulsightPageLoader />
            </>
          ) : (
            <>

              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                validateTrigger="onSubmit"
              >
                <h3 >Basic Information</h3>

                <Form.Item label="Upload Your Photo here">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      console.log(file)
                      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                      const isLt2M = file.size <= 2 * 1024 * 1024;
                      if (!isJpgOrPng) {
                        set_image_api('');
                        set_image('')
                        setimageError("Only JPG/PNG files are allowed.");
                        return false;
                      }

                      if (!isLt2M) {
                        set_image_api('');
                        set_image('')
                        setimageError("Thumbnail must be smaller than or equal to 2MB.");
                        return false;
                      }
                      const img = new Image();
                      img.src = URL.createObjectURL(file);

                      img.onload = () => {
                        const { width, height } = img;
                        // Example: Minimum 300x300 pixels
                        if (width === 600 && height === 400) {
                          setimageError(""); // Clear errors if valid

                          // Set preview and file for API
                          getBase64(file, (url) => set_image(url));
                          set_image_api(file);

                        } else {
                          set_image_api('');
                          set_image('')
                          setimageError("Image must be at least 600x400 pixels.");
                        }

                      };
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

                  {/* Error message under the uploader */}
                  {imageError && (
                    <span
                      style={{ color: "red", display: "block", marginTop: 8 }}
                    >
                      {imageError}
                    </span>
                  )}
                  {/* Server-side validation error */}
                  {errors?.image && (
                    <span
                      style={{ color: "red", display: "block", marginTop: 8 }}
                    >
                      {errors?.image}
                    </span>
                  )}

                  <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 2MB and must be at least 600x400 pixels.</p>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="First Name">
                      <Input
                        value={first_name}
                        placeholder="Enter your First Name"
                        onChange={(e) => set_first_name(e.target.value)}
                      />
                      {errors?.first_name ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.first_name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Last Name">
                      <Input
                        value={last_name}
                        placeholder="Enter your Last Name"
                        onChange={(e) => set_last_name(e.target.value)}
                      />
                      {errors?.last_name ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.last_name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Organization">
                      <Input
                        value={organization}
                        placeholder="Enter Organization"
                        onChange={(e) => set_organization(e.target.value)}
                      />
                      {errors?.organization ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.organization}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Designation">
                      <Input
                        value={designation}
                        placeholder="Enter designation"
                        onChange={(e) => set_designation(e.target.value)}
                      />
                      {errors?.designation ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.designation}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <h3>Contact Information</h3>

                <Form.Item label="Email">
                  <Input
                    type="email"
                    value={email}
                    placeholder="Enter learner email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors?.email ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.email}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <Form.Item label="Contact Number">
                  <LmsCountryDropdown
                    country={country_code}
                    contact={contact_no}
                    set_country_code={set_country_code}
                    set_contact_no={set_contact_no}
                  />
                  {errors?.contact_no ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.contact_no}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Address 1">
                      <Input
                        value={address_line_1}
                        placeholder="Enter your 1st address"
                        onChange={(e) => set_address_line1(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Address 2">
                      <Input
                        value={address_line_2}
                        placeholder="Enter your 2nd address"
                        onChange={(e) => set_address_line2(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Pin Code">
                  <Input
                    value={pin_code}
                    placeholder="Enter your pin code"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 6) {
                        set_pin_code(value);
                      }
                    }}
                  />
                  {errors?.pin_code ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.pin_code}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <h3>Security Information</h3>
{/* 
                <Form.Item label="Password">
                  <Input.Password
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => set_password(e.target.value)}
                  />
                  {errors?.password ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.password}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <Form.Item label="Confirm Password">
                  <Input.Password
                    value={confirm_password}
                    placeholder="Confirm password"
                    onChange={(e) => set_confirm_password(e.target.value)}
                  />
                  {errors?.confirm_password ? (
                    <>
                      <span style={{ color: "red" }}>
                        {errors?.confirm_password}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item> */}

                <Form.Item>
                  <Checkbox
                    checked={email_send}
                    onChange={(e) => set_email_send(e.target.checked)}
                  >
                    Send email to user (notify user about creation as learner)
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  {loading ? (
                    <>
                      <Button type="primary" style={{ float: "right" }}>
                        Save{" "}
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                        />
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
        </div>
      </Card>
    </div>
  );
}
