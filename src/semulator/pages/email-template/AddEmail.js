import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Spin,
    message,
    App,
} from "antd";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ADD_EMAIL } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import HtmlEditorWithPreview from "../../components/HtmlEditorWithPreview";

export default function AddSmtp() {
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [name, set_name] = useState("");
    const [envelope_sender, set_envelope_sender] = useState("");
    const [subject, set_subject] = useState("");
    const [message_value, set_message_value] = useState("");
    const [html_type, set_html_type] = useState(1);
    const [errors, set_errors] = useState("");
    const [spamModalVisible, setSpamModalVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const onFinish = async () => {
        setLoading(true);
        setSpamModalVisible(true); // Show Modal

        const FORM_DATA = new FormData();
        FORM_DATA.append("name", name);
        FORM_DATA.append("envelope_sender", envelope_sender);
        FORM_DATA.append("subject", subject);
        FORM_DATA.append("html_type", html_type);
        FORM_DATA.append("message_value", message_value);

        try {
            const response = await ADD_EMAIL(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                setSpamModalVisible(false); // Hide Modal
                navigate("/email-template");
            } else {
                setLoading(false);
                setSpamModalVisible(false);
                set_errors(response?.data?.errors);
            }
        } catch (error) {
            setSpamModalVisible(false);
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
                        <Col span={24}>
                            <h2>
                                <span
                                    style={{ cursor: "pointer", marginRight: "5px" }}
                                    onClick={() => navigate("/email-template")}
                                >
                                    <LeftOutlined />
                                </span>
                                ADD Email Template
                            </h2>
                            {errors?.smtp_error && (
                                <span style={{ color: "red" }}>{errors?.smtp_error}</span>
                            )}
                        </Col>
                    </Row>

                    {loading ? (
                        <CulsightPageLoader />
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                            validateTrigger="onSubmit"
                        >
                            <Form.Item label="Name">
                                <Input
                                    value={name}
                                    placeholder="Enter name"
                                    onChange={(e) => set_name(e.target.value)}
                                />
                                {errors?.name && (
                                    <span style={{ color: "red" }}>{errors?.name}</span>
                                )}
                            </Form.Item>

                            <Form.Item label="Envelope Sender">
                                <Input
                                    value={envelope_sender}
                                    placeholder="Enter envelope sender"
                                    onChange={(e) =>
                                        set_envelope_sender(extractNameOnly(e.target.value))
                                    }
                                />
                                {errors?.envelope_sender && (
                                    <span style={{ color: "red" }}>{errors?.envelope_sender}</span>
                                )}
                            </Form.Item>

                            <Form.Item label="Subject">
                                <Input
                                    placeholder="Enter subject"
                                    value={subject}
                                    onChange={(e) => set_subject(e.target.value)}
                                />
                                {errors?.subject && (
                                    <span style={{ color: "red" }}>{errors?.subject}</span>
                                )}
                            </Form.Item>

                            <HtmlEditorWithPreview
                                setHtmlCode={set_message_value}
                                description="Message"
                                htmlCode={message_value}
                            />

                            <Form.Item>
                                <Button
                                    type="primary"
                                    style={{ float: "right" }}
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </Card>

            <Modal
                open={spamModalVisible}
                title="Checking for Spam..."
                footer={null}
                closable={false}
                centered
            >
                <p>Please wait while we check for spam...</p>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Spin size="large" />
                </div>
            </Modal>
        </div>
    );
}
