import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  message,
  App,
} from "antd";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ADD_SMTP } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function AddSmtp() {

  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [smtp_server, set_smtp_server] = useState("")
  const [smtp_user, set_smtp_user] = useState("")
  const [smtp_port, set_smtp_port] = useState("")
  const [password, set_password] = useState("");
  const [custom_header_name, set_custom_header_name] = useState("");
  const [custom_header_value, set_custom_header_value] = useState("");
  const [errors, set_errors] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);


  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("smtp_server", smtp_server);
    FORM_DATA.append("smtp_user", smtp_user);
    FORM_DATA.append("smtp_port", smtp_port);
    FORM_DATA.append("password", password);
    FORM_DATA.append("custom_header_name", custom_header_name);
    FORM_DATA.append("custom_header_value", custom_header_value);
    try {
      const response = await ADD_SMTP(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        navigate("/smtp");
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
              <h2> <span style={{ cursor: "pointer" }}
                onClick={() => navigate("/smtp")}><LeftOutlined /></span> ADD SMTP</h2>
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


                <Form.Item label="SMTP Server">
                  <Input
                    type="text"
                    value={smtp_server}
                    placeholder="Enter Smtp server"
                    onChange={(e) => set_smtp_server(e.target.value)}
                  />
                  {errors?.smtp_server ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.smtp_server}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>


                <Form.Item label="SMTP User">
                  <Input
                    type="email"
                    value={smtp_user}
                    placeholder="Enter Smtp user"
                    onChange={(e) => set_smtp_user(e.target.value)}
                  />
                  {errors?.smtp_user ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.smtp_user}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>


                <Form.Item label="SMTP Port">
                  <Input
                    placeholder="Enter Smtp port"
                    value={smtp_port}
                    onChange={(e) => set_smtp_port(e.target.value)}
                  />
                  {errors?.smtp_port ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.smtp_port}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>


                <Form.Item label=" SMTP Password">
                  <Input.Password
                    placeholder="Enter your password"
                    value={password}
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


                <h2>Custom Header Details</h2>

                <Form.Item label="Custom Header Name">
                  <Input
                    type="text"
                    placeholder="Enter header name"
                    value={custom_header_name}
                    onChange={(e) => set_custom_header_name(e.target.value)}
                  />
                  {errors?.custom_header_name ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.custom_header_name}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>


                <Form.Item label="Custom Header Value">
                  <Input
                    type="text"
                    placeholder="Enter header value"
                    value={custom_header_value}
                    onChange={(e) => set_custom_header_value(e.target.value)}
                  />
                  {errors?.custom_header_value ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.custom_header_value}</span>
                    </>
                  ) : (
                    <></>
                  )}
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
