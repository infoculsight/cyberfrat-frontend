import { App, Button, Card, Descriptions, Form, Input, Select, Spin, Upload, message } from 'antd'
import React, { useState } from 'react'
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CustomRichTextEditor from '../../components/CustomTextEditor';
import { ADD_NEWS } from '../../apis/apis';
import { useNavigate } from 'react-router-dom';


function AddAnnouncment() {
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [errors, set_errors] = useState("");
    const [imageError, setimageError] = useState("");
    const [image, set_image] = useState("");
    const [image_api, set_image_api] = useState("");
    const [title, set_title] = useState("")
    const [description, set_description] = useState("")
    const [short_description, set_short_description] = useState("")
    const [tags, set_tags] = useState([])
    const [slug, set_slug] = useState("")
    const [seo_title, set_seo_title] = useState("")
    const [seo_description, set_seo_description] = useState("")
    const [seo_keywords, set_seo_keywords] = useState([])
    const [location, set_location] = useState("")
    const [video_url, set_video_url] = useState("")
    const [source, set_source] = useState("")
    const [priority, set_priority] = useState("")



    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleChange = async (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        set_image_api(info.file);
        if (info.file.status === "done") {
            console.log(info.file.originFileObj);
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                set_image(url);
            });
        } else if (info.file.status === "error") {
            setLoading(false);
            message.error("Upload failed. Please try again.");
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            {loading ? (
                <Loading3QuartersOutlined style={{ color: "#fff" }} />
            ) : (
                <PlusOutlined style={{ color: "#fff" }} />
            )}
            <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
        </button>
    );

    const onFinish = async () => {
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("title", title);
        FORM_DATA.append("image", image_api);
        FORM_DATA.append("description", description);
        FORM_DATA.append("short_description", short_description);
        FORM_DATA.append("tags", tags);
        FORM_DATA.append("slug", slug);
        FORM_DATA.append("seo_title", seo_title);
        FORM_DATA.append("seo_description", seo_description);
        FORM_DATA.append("seo_keywords", seo_keywords);
        FORM_DATA.append("location", location);
        FORM_DATA.append("video_url", video_url);
        FORM_DATA.append("source", source);
        FORM_DATA.append("priority", priority);

        try {
            const response = await ADD_NEWS(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                navigate("/announcment");
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
        <div className='lms-body'>
            <Card>
                <span>
                    <h2> <LeftOutlined style={{ cursor: "pointer" }} onClick={() => navigate('/announcment')} />Add Announcement</h2></span>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                    validateTrigger="onSubmit"
                >
                    <Form.Item label="Upload Announcement Photo here">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                console.log(file)
                                const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                                const isLt2M = file.size <= 2 * 1024 * 1024;
                                if (!isJpgOrPng) {
                                    set_image_api('');
                                    set_image('')
                                    setimageError("Only JPG/PNG files are allowed.");
                                    return false;
                                }

                                if (!isLt2M) {
                                    set_image_api('');
                                    set_image('')
                                    setimageError("Thumbnail must be smaller than or equal to 2MB.");
                                    return false;
                                }
                                const img = new Image();
                                img.src = URL.createObjectURL(file);

                                img.onload = () => {
                                    const { width, height } = img;
                                    // Example: Minimum 300x300 pixels
                                    if (width === 600 && height === 400) {
                                        setimageError(""); // Clear errors if valid

                                        // Set preview and file for API
                                        getBase64(file, (url) => set_image(url));
                                        set_image_api(file);

                                    } else {
                                        set_image_api('');
                                        set_image('')
                                        setimageError("Image must be at least 600x400 pixels.");
                                    }

                                };
                                return false;

                            }}
                            onChange={handleChange}
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
                        {errors?.image && (
                            <span
                                style={{ color: "red", display: "block", marginTop: 8 }}
                            >
                                {errors?.image}
                            </span>
                        )}

                        <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 2MB and must be at least 600x400 pixels.</p>
                    </Form.Item>

                    <Form.Item label="Title">
                        <Input
                            value={title}
                            placeholder="Enter title"
                            onChange={(e) => set_title(e.target.value)}
                        />
                        {errors?.title ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.title}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>


                    <Form.Item>
                        <CustomRichTextEditor
                            value={description}
                            editorLabel="Description"
                            onChange={(val) => set_description(val)}
                            placeholder="Write something..."
                        />
                        {errors?.description && (
                            <span style={{ color: "red" }}>{errors?.description}</span>
                        )}
                    </Form.Item>

                    <Form.Item label="Short Description">
                        <Input
                            value={short_description}
                            placeholder="Enter short description"
                            onChange={(e) => set_short_description(e.target.value)}
                        />
                        {errors?.short_description ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.short_description}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="Tags">
                        <Select
                            mode="tags"
                            value={tags}
                            onChange={set_tags}
                            placeholder="Please select"
                            style={{ width: "100%" }}
                        />
                        {errors?.tags ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.tags}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="Slug">
                        <Input
                            value={slug}
                            placeholder="Enter Slug"
                            onChange={(e) => set_slug(e.target.value)}
                        />
                        {errors?.slug ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.slug}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="Seo Title">
                        <Input
                            value={seo_title}
                            placeholder="Enter Slug"
                            onChange={(e) => set_seo_title(e.target.value)}
                        />
                        {errors?.seo_title ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.seo_title}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <CustomRichTextEditor
                            value={seo_description}
                            editorLabel=" Seo Description"
                            onChange={(val) => set_seo_description(val)}
                            placeholder="Write something..."
                        />
                        {errors?.seo_description && (
                            <span style={{ color: "red" }}>{errors?.seo_description}</span>
                        )}
                    </Form.Item>


                    <Form.Item label="Seo keywords">
                        <Select
                            mode="tags"
                            value={seo_keywords}
                            onChange={set_seo_keywords}
                            placeholder="Please select"
                            style={{ width: "100%" }}
                        />
                        {errors?.seo_keywords ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.seo_keywords}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="location">
                        <Input
                            value={location}
                            placeholder="Enter location"
                            onChange={(e) => set_location(e.target.value)}
                        />
                        {errors?.location ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.location}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="Video Url">
                        <Input
                            value={video_url}
                            placeholder="Enter video url"
                            onChange={(e) => set_video_url(e.target.value)}
                        />
                        {errors?.video_url ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.video_url}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>

                    <Form.Item label="Source">
                        <Input
                            value={source}
                            placeholder="Enter source"
                            onChange={(e) => set_source(e.target.value)}
                        />
                        {errors?.source ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.source}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form.Item>


                    <Form.Item label="Priority">
                        <Input
                            value={priority}
                            placeholder="Enter priority"
                            onChange={(e) => set_priority(e.target.value)}
                        />
                        {errors?.priority ? (
                            <>
                                <span style={{ color: "red" }}>
                                    {errors?.priority}
                                </span>
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
            </Card>
        </div>
    )
}

export default AddAnnouncment
