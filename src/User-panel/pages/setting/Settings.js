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
  Modal
} from "antd";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CulsightPageLoader from "../../../User-panel/components/CulsightPageLoader";
import { EDIT_LEARNER, VIEW_PROFILE, RESET_PASSWORD } from "../../apis/apis";
import { UploadOutlined } from "@ant-design/icons";
import LmsCountryDropdown from "../../../User-panel/components/LmsCountryDropdown";
import { logout } from "../../../authService";

function Settings() {
  const { user, setUser } = useOutletContext();
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [error, set_error] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

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

      return false;
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
      set_image(response_data?.image || "");

      setUser((prev) => ({
        ...prev,
        user_info: {
          ...prev?.user_info,
          name: `${response_data?.first_name} ${response_data?.last_name}`,
          email: response_data?.email,
          image: response_data?.image,
        },
      }));

      const updatedUser = {
        ...user,
        user_info: {
          ...user?.user_info,
          name: `${response_data?.first_name} ${response_data?.last_name}`,
          email: response_data?.email,
          image: response_data?.image,
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
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
    if (image_file) FORM_DATA.append("image", image_file);

    try {
      const response = await EDIT_LEARNER(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        await fetchProfile();
        setUser(prev => ({
          ...prev,
          user_info: {
            ...prev.user_info,
            name: `${first_name} ${last_name}`
          }
        }));

        const updatedUser = {
          ...user,
          user_info: {
            ...user.user_info,
            name: `${first_name} ${last_name}`
          }
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        const backendError = response?.data?.message || "Something went wrong!";
        notification.error({
          message: "Error",
          description: backendError,
        });
        setLoading(false);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
      setLoading(false);
    }
  };

 const handlePasswordSubmit = async () => {

  set_error({ new_password: "", confirm_password: "" });
  setPasswordLoading(true);

  const FORM_DATA = new FormData();
  FORM_DATA.append("email", email);
   FORM_DATA.append("current_password", currentPassword)
  FORM_DATA.append("new_password", newPassword);
  FORM_DATA.append("confirm_password", confirmPassword);

try {
  const response = await RESET_PASSWORD(FORM_DATA);

  if (response?.data?.status) {
    notification.success({
      message: "Successfull",
      description:response?.data?.message
    });

    setIsModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    set_error({ new_password: "", confirm_password: "", current_password: "" });

  } else {
    const errors = response?.data?.errors || {};

    // Correctly set all backend errors
    set_error({
      current_password: errors.current_password || "",
      new_password: errors.new_password || "",
      confirm_password: errors.confirm_password || "",
    });

    const errorMsg = Object.values(errors).join(" | ") || response?.data?.message || "Something went wrong!";
    notification.error({
      message: "Error",
      description: errorMsg,
    });
  }
} catch (err) {
  const backendError = err?.response?.data?.message || "Server error! Please try again.";
  notification.error({
    message: "Error",
    description: backendError,
  });
} finally {
  setPasswordLoading(false);
}

};


  return (
    <div className="lms-body" style={{ padding: "10px" }}>
      {/* <Card> */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              {loading ? (
                <CulsightPageLoader />
              ) : (
                <>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{
                      position: "relative",
                      padding:"30px"
                    }}
                  >

                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 10
                      }}
                    >
                      <Button size="small" type="primary" onClick={() => setIsModalOpen(true)}>
                        Reset Password
                      </Button>
                    </div>


                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={4}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt="Profile Pic"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "10px"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            backgroundColor: "#ccc",
                            borderRadius: "50%",
                            marginBottom: "10px"
                          }}
                        />
                      )}

                      <Upload {...props}>
                        <Button icon={<UploadOutlined />} type="default" size="small">
                          Upload Photo
                        </Button>
                      </Upload>
                      {imageError && <p style={{ color: "red", marginTop: 6 }}>{imageError}</p>}
                      <span style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}>
                        Max 500KB • JPG/PNG
                      </span>
                    </Col>


                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={4}
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <h2 style={{ margin: 0, fontSize: "20px" }}>
                        {first_name} {last_name}
                      </h2>
                    </Col>

                  </Row>


                  <hr style={{ margin: "20px 0" }} />

                  <Form layout="vertical" autoComplete="off" onFinish={onFinish} form={form} validateTrigger="onSubmit">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="First Name">
                          <Input value={first_name} onChange={(e) => set_first_name(e.target.value)} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Last Name">
                          <Input value={last_name} onChange={(e) => set_last_name(e.target.value)} />
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

                    <Form.Item style={{ textAlign: "center" }}>
                      <Button type="primary" htmlType="submit">
                        Save Changes
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
            </Card>
          </Col>
        </Row>

        <Modal
          title="Reset Password"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            set_error({ current_password: "", new_password: "", confirm_password: "" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          footer={null}
        >
          <Form layout="vertical" onFinish={handlePasswordSubmit}>
            <Form.Item label="Current Password">
              <Input.Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              {error.current_password && <p style={{ color: "red" }}>{error.current_password}</p>}
            </Form.Item>

            <Form.Item label="New Password">
              <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              {error.new_password && <p style={{ color: "red" }}>{error.new_password}</p>}
            </Form.Item>

            <Form.Item label="Confirm Password">
              <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {error.confirm_password && <p style={{ color: "red" }}>{error.confirm_password}</p>}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={passwordLoading} style={{ width: "100%" }}>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      {/* </Card> */}
    </div>
  );
}

export default Settings;
