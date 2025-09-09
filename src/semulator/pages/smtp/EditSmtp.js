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
import { EDIT_SMTP, VIEW_SMTP } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";

import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function EditSmtp() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [smtp_server, set_smtp_server] = useState("")
  const [smtp_user, set_smtp_user] = useState("")
  const [password, set_password] = useState("");
  const [smtp_port, set_smtp_port] = useState("")
  const [custom_header_name, set_custom_header_name] = useState("");
  const [custom_header_value, set_custom_header_value] = useState("");
  const [errors, set_errors] = useState("");


  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));
      const EDIT_API_RESPONSE = await VIEW_SMTP(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_smtp_server(response_data?.smtp_server);
        set_smtp_user(response_data?.smtp_user);
        set_smtp_port(response_data?.smtp_port);
        set_password(response_data?.password);
        set_custom_header_name(response_data?.custom_header_name);
        set_custom_header_value(response_data?.custom_header_value);
        setLoading(false);

      }
    };

    VIEW_API();
  }, [id]);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("smtp_server", smtp_server);
    FORM_DATA.append("smtp_user", smtp_user);
    FORM_DATA.append("smtp_port", smtp_port);
    FORM_DATA.append("password", password);
    FORM_DATA.append("custom_header_name", custom_header_name);
    FORM_DATA.append("custom_header_value", custom_header_value);
    try {
      const response = await EDIT_SMTP(FORM_DATA);

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
              <h2><span style={{ cursor: "pointer" }}
                onClick={() => navigate("/smtp")}><LeftOutlined /></span>Edit SMTP</h2>
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
                    placeholder="Enter Smtp server"
                    value={smtp_server}
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
                <Form.Item label="SMTP Port">
                  <Input

                    value={smtp_port}
                    placeholder="Enter Smtp port"
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


                <h2>Custom Header Details</h2>

                <Form.Item label="Custom Header Name">
                  <Input
                    type="text"
                    value={custom_header_name}
                    placeholder="Enter header name"
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
                    value={custom_header_value}
                    placeholder="Enter header value"
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
