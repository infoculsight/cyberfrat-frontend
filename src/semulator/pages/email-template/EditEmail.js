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
import { EDIT_EMAIL, VIEW_EMAIL } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";

import CulsightPageLoader from "../../components/CulsightPageLoader";
import HtmlEditorWithPreview from "../../components/HtmlEditorWithPreview";

export default function AddSmtp() {
    const {id} = useParams();
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [name, set_name] = useState("")
    const [envelope_sender, set_envelope_sender] = useState("")
    const [subject, set_subject] = useState("")
    const [message_value, set_message_value] = useState("");
    const [html_type,set_html_type] =useState(null)

    const [errors, set_errors] = useState("");

  
    useEffect(() => {
      const VIEW_API = async () => {
        const TOKEN = localStorage.getItem("token");
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", atob(id));
        FORM_DATA.append("token", TOKEN);
  
        const EDIT_API_RESPONSE = await VIEW_EMAIL(FORM_DATA);
        if (EDIT_API_RESPONSE?.data?.status) {
          const response_data = EDIT_API_RESPONSE?.data?.data;
          set_name(response_data?.name);
          set_envelope_sender(response_data?.envelope_sender);
          set_subject(response_data?.subject);
          set_message_value(response_data?.message_value);
         set_html_type(response_data?.html_type === true ? 1 : 0);

       
          setLoading(false);
  
        }
      };
  
      VIEW_API();
    }, [id]);

    
    const onFinish = async () => {
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", atob(id));
        FORM_DATA.append("name", name);
        FORM_DATA.append("envelope_sender", envelope_sender);
        FORM_DATA.append("subject", subject);
        FORM_DATA.append("message_value", message_value);
        FORM_DATA.append("html_type", html_type);
        try {
            const response = await EDIT_EMAIL(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                navigate("/email-template");
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

    const extractNameOnly = (value) => {
           return value.replace(/[<>@.]/g, "");
    };
    return (
        <div className="lms-body">
            <Card>
                <div className="lms-form">


                    <Row>
                        <Col span={12}>
                            <h2><span        style={{ cursor: "pointer",marginRight:"5px" }}
                                onClick={() => navigate("/email-template")}><LeftOutlined /></span>Edit Email Template</h2>
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


                                <Form.Item label="Name">
                                    <Input
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => set_name(e.target.value)}
                                    />
                                    {errors?.name ? (
                                        <>
                                            <span style={{ color: "red" }}>{errors?.name}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Form.Item>


                                <Form.Item label="Envelope Sender">
                                    <Input
                                    value={envelope_sender}
                                        placeholder="Enter envelope sender"
                                         onChange={(e) => set_envelope_sender(extractNameOnly(e.target.value))}
                                    />
                                    {errors?.envelope_sender ? (
                                        <>
                                            <span style={{ color: "red" }}>{errors?.envelope_sender}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Form.Item>

                                <Form.Item label="Subject">
                                    <Input
                                        placeholder="Enter subject"
                                        onChange={(e) => set_subject(e.target.value)}
                                        value={subject}
                                    />
                                    {errors?.subject ? (
                                        <>
                                            <span style={{ color: "red" }}>{errors?.subject}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Form.Item>

                                {/* <Form.Item label="HTMl Type">
                                    <Radio.Group
                                        onChange={(e) => set_html_type(e.target.value)}
                                        value={html_type}
                                    >
                                        <Radio value={1}>HTML</Radio>
                                        <Radio value={0}>Text</Radio>
                                    </Radio.Group>
                                </Form.Item> */}

                                <HtmlEditorWithPreview  setHtmlCode={set_message_value} description='Message' htmlCode={message_value} />
                                {/* <Form.Item label="Message">
                                    <Input.TextArea
                                    value={message_value}
                                        rows={6}
                                        placeholder="Enter message_value"
                                        onChange={(e) => set_message_value(e.target.value)}
                                    />
                                    {errors?.message_value ? (
                                        <>
                                            <span style={{ color: "red" }}>{errors?.message_value}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Form.Item>
 */}

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
