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
import { EDIT_LANDING, VIEW_LANDING } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";

import CulsightPageLoader from "../../components/CulsightPageLoader";
import HtmlEditorWithPreview from "../../components/HtmlEditorWithPreview";

export default function EditLandingPage() {
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [name, set_name] = useState("")
    const [description, set_description] = useState("");
    const [errors, set_errors] = useState("");




    useEffect(() => {
        const VIEW_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("id", atob(id));
            const EDIT_API_RESPONSE = await VIEW_LANDING(FORM_DATA);
            if (EDIT_API_RESPONSE?.data?.status) {
                const response_data = EDIT_API_RESPONSE?.data?.data;
                set_name(response_data?.name);
                set_description(response_data?.description);
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
        FORM_DATA.append("description", description);
        try {
            const response = await EDIT_LANDING(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                navigate("/landing-page");
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
                            <h2><span style={{ cursor: "pointer", marginRight: "5px" }}
                                onClick={() => navigate("/landing-page")}><LeftOutlined /></span>Edit Landing Page</h2>
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
                                <HtmlEditorWithPreview setHtmlCode={set_description} description="Description" htmlCode={description} />
                                {/* <Form.Item label="description">
                                    <Input.TextArea
                                        rows={6}
                                        value={description}
                                        placeholder="Enter description"
                                        onChange={(e) => set_description(e.target.value)}
                                    />
                                    {errors?.description ? (
                                        <>
                                            <span style={{ color: "red" }}>{errors?.description}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Form.Item> */}


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
