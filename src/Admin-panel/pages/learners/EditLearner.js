import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Upload,
  message,
  App,
  Checkbox,
} from "antd";
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { EDIT_LEARNER, VIEW_LEARNER } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import LmsCountryDropdown from "../../components/LmsCountryDropdown";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { getWordCount, MAX_ADDRESS_WORDS, PINCODE_LENGTH, PINCODE_REGEX } from "../../../helper/CommonHelper";
import { MAX_NAME_LENGTH, nameRegex } from "../../../helper/CommonHelper";

export default function EditLearner() {
  const { id } = useParams();
  const { notification } = App.useApp();
  const [page_loader, set_page_loader] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [image, set_image] = useState("");
  const [image_api, set_image_api] = useState("");
  const [organization, set_organization] = useState("");
  const [designation, set_designation] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, setEmail] = useState("");
  const [email_send, set_email_send] = useState(false);
  const [country_code, set_country_code] = useState("IN");
  const [contact_no, set_contact_no] = useState("");
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <Loading3QuartersOutlined /> : <PlusOutlined style={{ color: "#fff" }} />}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );

  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));
      const EDIT_API_RESPONSE = await VIEW_LEARNER(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;

        set_first_name(response_data?.first_name);
        if (response_data?.image) {
          set_image(response_data.image);
        } else {
          set_image("");
        }
        set_last_name(response_data?.last_name);
        setEmail(response_data?.email);
        set_contact_no(parseInt(response_data?.contact_no));
        set_organization(response_data?.organization);
        set_designation(response_data?.designation);
        set_country_code(response_data?.country_code);
        set_address_line1(response_data?.address_line_1);
        set_address_line2(response_data?.address_line_2);
        set_pin_code(response_data?.pin_code);
        set_page_loader(false);

      }
    };

    VIEW_API();
  }, [id]);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("first_name", first_name);
    FORM_DATA.append("last_name", last_name);
    FORM_DATA.append("country_code", country_code);
    FORM_DATA.append("contact_no", contact_no);
    FORM_DATA.append("address_line_1", address_line_1);
    FORM_DATA.append("address_line_2", address_line_2);
    FORM_DATA.append("organization", organization);
    FORM_DATA.append("designation", designation);
    FORM_DATA.append("pin_code", pin_code);
    FORM_DATA.append("image", image_api);
    FORM_DATA.append("email_send", email_send);

    try {
      const response = await EDIT_LEARNER(FORM_DATA);
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
                onClick={() => navigate("/learners")} ><LeftOutlined /></span> Edit Learner</h2>
            </Col>
          </Row>

          {page_loader ? (
            <CulsightPageLoader />
          ) : (

            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onFinish}
              validateTrigger="onSubmit"
            >
              <h3>Basic Information</h3>

              <Form.Item label="Upload Your Photo here">
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
                      if (width === 490 && height === 320) {
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
                {errors?.thumbnail && (
                  <span
                    style={{ color: "red", display: "block", marginTop: 8 }}
                  >
                    {errors?.thumbnail}
                  </span>
                )}

                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 2MB and must be at least 600x400 pixels.</p>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    validateStatus={
                      errors?.first_name
                        ? "error"
                        : first_name &&
                          (!nameRegex.test(first_name) || first_name.length > MAX_NAME_LENGTH)
                          ? "error"
                          : ""
                    }
                    help={
                      errors?.first_name
                        ? errors.first_name
                        : first_name &&
                          !nameRegex.test(first_name)
                          ? "Special characters and numbers are not allowed"
                          : first_name &&
                            first_name.length > MAX_NAME_LENGTH
                            ? "First name cannot exceed 50 characters"
                            : ""
                    }
                  >
                    <Input
                      value={first_name}
                      placeholder="Enter your First Name"
                      maxLength={MAX_NAME_LENGTH}
                      onChange={(e) => {
                        const value = e.target.value;
                        set_first_name(value);
                      }}
                    />
                  </Form.Item>

                </Col>

                <Col span={12}>
                  <Form.Item label="Last Name"
                    validateStatus={
                      errors?.last_name
                        ? "error"
                        : last_name &&
                          (!nameRegex.test(last_name) || last_name.length > MAX_NAME_LENGTH)
                          ? "error"
                          : ""
                    }
                    help={
                      errors?.last_name
                        ? errors.last_name
                        : last_name &&
                          !nameRegex.test(last_name)
                          ? "Special characters and numbers are not allowed"
                          : last_name &&
                            last_name.length > MAX_NAME_LENGTH
                            ? "First name cannot exceed 50 characters"
                            : ""
                    }>
                    <Input
                      value={last_name}
                      placeholder="Enter your Last Name"
                      maxLength={MAX_NAME_LENGTH}
                      onChange={(e) => {
                        const value = e.target.value;
                        set_last_name(value);
                      }}
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
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors?.email && (
                  <span style={{ color: "red" }}>{errors?.email}</span>
                )}
              </Form.Item>

              <Form.Item label="Contact Number">
                <LmsCountryDropdown
                  country={country_code}
                  contact={contact_no}
                  set_country_code={set_country_code}
                  set_contact_no={set_contact_no}
                />
                {errors?.contact_no && (
                  <span style={{ color: "red" }}>{errors?.contact_no}</span>
                )}
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Address 1"
                    validateStatus={
                      errors?.address_line_1
                        ? "error"
                        : address_line_1 &&
                          getWordCount(address_line_1) > MAX_ADDRESS_WORDS
                          ? "error"
                          : ""
                    }
                    help={
                      <>
                        {errors?.address_line_1
                          ? errors.address_line_1
                          : address_line_1 &&
                            getWordCount(address_line_1) > MAX_ADDRESS_WORDS
                            ? `Address cannot exceed ${MAX_ADDRESS_WORDS} words`
                            : ""
                        }

                        <span style={{ float: "right" }}>
                          {address_line_1 ? getWordCount(address_line_1) : 0} / {MAX_ADDRESS_WORDS} words
                        </span>
                      </>
                    }
                  >
                    <Input
                      value={address_line_1}
                      placeholder="Enter your address (max 120 words)"
                      rows={3}
                      onChange={(e) => set_address_line1(e.target.value)}
                    />


                  </Form.Item>

                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Address 2"
                    validateStatus={
                      errors?.address_line_2
                        ? "error"
                        : address_line_2 &&
                          getWordCount(address_line_2) > MAX_ADDRESS_WORDS
                          ? "error"
                          : ""
                    }
                    help={
                      <>
                        {errors?.address_line_2
                          ? errors.address_line_2
                          : address_line_2 &&
                            getWordCount(address_line_2) > MAX_ADDRESS_WORDS
                            ? `Address cannot exceed ${MAX_ADDRESS_WORDS} words`
                            : ""
                        }

                        <span style={{ float: "right" }}>
                          {address_line_2 ? getWordCount(address_line_2) : 0} / {MAX_ADDRESS_WORDS} words
                        </span>
                      </>
                    }
                  >
                    <Input
                      value={address_line_2}
                      placeholder="Enter additional address details (max 120 words)"
                      rows={3}
                      onChange={(e) => set_address_line2(e.target.value)}
                    />

                  </Form.Item>

                </Col>

              </Row>


              <Form.Item
                label="Pin Code"
                validateStatus={
                  errors?.pin_code
                    ? "error"
                    : pin_code &&
                      (!PINCODE_REGEX.test(pin_code) ||
                        pin_code.length !== PINCODE_LENGTH)
                      ? "error"
                      : ""
                }
                help={
                  errors?.pin_code
                    ? errors.pin_code
                    : pin_code &&
                      !PINCODE_REGEX.test(pin_code)
                      ? "Only numbers are allowed"
                      : pin_code &&
                        pin_code.length !== PINCODE_LENGTH
                        ? "Pin Code must be exactly 6 digits"
                        : ""
                }
              >
                <Input
                  value={pin_code}
                  placeholder="Enter your pin code"
                  maxLength={PINCODE_LENGTH}
                  inputMode="numeric"
                  onChange={(e) => {
                    // 🔒 Allow only numbers
                    const value = e.target.value.replace(/\D/g, "");
                    set_pin_code(value);
                  }}
                />
              </Form.Item>

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
                  <Button type="primary" style={{ float: "right" }}>
                    Save{" "}
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Save
                  </Button>
                )}
              </Form.Item>

            </Form>

          )}
        </div>
      </Card>
    </div>
  );
}
