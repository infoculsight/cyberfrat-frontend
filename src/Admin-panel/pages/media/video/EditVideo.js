import React, { useEffect, useState } from 'react';
import { EDIT_VIDEO_VIEW } from '../../../apis/apis';
import { App, Button, Col, Form, Input, Row } from 'antd';
import CustomRichTextEditor from '../../../components/CustomTextEditor';

function EditVideo(props) {
    const { notification } = App.useApp();
    const [description, set_description] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, set_errors] = useState("");
    const [title, set_title] = useState("");
    const [form] = Form.useForm();
    useEffect(() => {
        set_description(props?.item?.description)
        set_title(props?.item?.title)
    }, [ ])
    const onFinish = async () => {
        const formData = new FormData();
        formData.append("id", props?.item?.id);
        formData.append("description", description);
        formData.append("title", title);
        formData.append("description", description);

        try {
            const response = await EDIT_VIDEO_VIEW(formData);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: "Video is updated",
                });
                props?.set_edit_video(false);
               props?.set_list_refresh(true)
            } else {
                setLoading(false);
                set_errors(response?.data?.errors);
            }
        } catch (error) {
           
            console.error(error);
        }
    };

    return (
        <>
            <Form layout="vertical" autoComplete="off" form={form} onFinish={onFinish} validateTrigger="onSubmit">
                <Row gutter={[16, 16]}>


                    <Col xs={24} sm={24} md={16} lg={16}>
                        <Form.Item label="Title">
                            <Input
                                placeholder="Enter video title"
                                value={title}
                                onChange={(e) => set_title(e.target.value)}
                            />
                            {errors?.title && (
                                <span style={{ color: "red" }}>{errors?.title}</span>
                            )}
                        </Form.Item>

                        <Form.Item>
                            <CustomRichTextEditor
                                style={{ marginTop: "50px" }}
                                value={description}
                                editorLabel="Description"
                                onChange={(val) => set_description(val)}
                                placeholder="Write something..."
                            />
                            {errors?.description && (
                                <span style={{ color: "red" }}>{errors?.description}</span>
                            )}
                        </Form.Item>
                        {loading ? <> <Button type="primary" title="Fill first all required field." disabled={true}>
                            Save
                        </Button></> : <>

                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </>}


                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default EditVideo;