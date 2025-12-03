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
  Select,
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
  const [smtp_for, set_smtp_for] = useState("");
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
        set_smtp_for(response_data?.smtp_for);
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
    FORM_DATA.append("smtp_for", smtp_for);
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

                <Form.Item label="SMTP For">
                  <Select
                    placeholder="Select SMTP For"
                    value={smtp_for}
                    onChange={(value) => set_smtp_for(value)}
                  >
                    <Select.Option value="courses">Courses</Select.Option>
                    <Select.Option value="packages">Packages</Select.Option>
                    <Select.Option value="list_test">List Test</Select.Option>
                  </Select>
                  {errors?.smtp_for ? (
                    <span style={{ color: "red" }}>{errors?.smtp_for}</span>
                  ) : null}
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