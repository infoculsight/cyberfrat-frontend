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
import { TOOL_SETTING } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function ToolSetting() {

  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [awarness_url, set_awarness_url] = useState("")
  const [smtp_server, set_smtp_server] = useState("")
  const [smtp_user, set_smtp_user] = useState("")
  const [smtp_port, set_smtp_port] = useState("")
  const [password, set_password] = useState("");
  const [lms_secret, set_lms_secret] = useState("");
  const [errors, set_errors] = useState("");


  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("smtp_server", smtp_server);
    FORM_DATA.append("awarness_url", awarness_url);
    FORM_DATA.append("smtp_user", smtp_user);
    FORM_DATA.append("smtp_port", smtp_port);
    FORM_DATA.append("password", password);
    FORM_DATA.append("lms_secret", lms_secret);
    try {
      const response = await TOOL_SETTING(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        setLoading(false);
        navigate("/tool-setting");
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
      const response = await TOOL_SETTING(FORM_DATA);
      if (response?.data?.status) {
        const response_data = response?.data?.data;
        set_awarness_url(response_data?.awarness_url);
        set_smtp_server(response_data?.smtp_server);
        set_smtp_user(response_data?.smtp_user);
        set_smtp_port(response_data?.smtp_port);
        set_password(response_data?.password);
        set_lms_secret(response_data?.lms_secret);
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
        <div className="lms-form">


          <Row>
            <Col span={12}>
              <h2> <span style={{ cursor: "pointer" }}
                onClick={() => navigate("/smtp")}><LeftOutlined /></span> Tool Setting</h2>
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
                <Form.Item label="Lms Secret (Connect your LMS)">
                  <Input
                    type="text"
                    value={lms_secret}
                    placeholder="Enter Smtp server"
                    onChange={(e) => set_lms_secret(e.target.value)}
                  />
                  {errors?.lms_secret ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.lms_secret}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <Form.Item label="Awareness url">
                  <Input
                    type="text"
                    value={awarness_url}
                    placeholder="Enter Smtp server"
                    onChange={(e) => set_awarness_url(e.target.value)}
                  />
                  {errors?.awarness_url ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.awarness_url}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

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
