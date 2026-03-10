import React, { useEffect, useState } from "react";
import { Card, Form, Radio, Upload, Input, Button, Modal, message, Select, DatePicker, App } from "antd";
import { LeftOutlined, Loading3QuartersOutlined, PlusOutlined } from "@ant-design/icons";
import SelectVideoList from "../media/video/SelectVideoList";
import CustomRichTextEditor from "../../components/CustomTextEditor";
import { EDIT_ADS, VIEW_ADS } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import dayjs from "dayjs";

function EditAdvertisement() {
  const { id } = useParams()
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [title, set_title] = useState("")
  const [loading, setLoading] = useState(true);
  const [ads_type, set_ads_type] = useState("video");
  const [image, set_image] = useState("");
  const [description, set_description] = useState("");
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  const [image_api, set_image_api] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [difficulty, set_difficulty] = useState("low");
  const [errors, set_errors] = useState("");
  const [imageError, setimageError] = useState("");

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
        <Loading3QuartersOutlined />
      ) : (
        <PlusOutlined style={{ color: "#fff" }} />
      )}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );


  useEffect(() => {
    setLoading(true);

    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));

      const EDIT_API_RESPONSE = await VIEW_ADS(FORM_DATA);

      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_start_date(
          response_data?.meta?.start_date
            ? dayjs(response_data.meta.start_date)
            : null
        );

        set_end_date(
          response_data?.meta?.end_date
            ? dayjs(response_data.meta.end_date)
            : null
        );

        set_ads_type(response_data?.ads_type);
        set_difficulty(response_data?.priority);

        form.setFieldsValue({
          ads_type: response_data?.ads_type
        });

        if (response_data?.ads_meta?.image) {
          set_image(response_data?.ads_meta?.image);
        }

        if (response_data?.ads_type === "content") {
          set_description(response_data?.ads_meta?.description);
          set_title(response_data?.ads_meta?.title);

          form.setFieldsValue({
            title: response_data?.ads_meta?.title,
            description: response_data?.ads_meta?.description
          });
        }

        if (response_data?.ads_type === "video") {
          setSelectedVideo({
            id: response_data?.ads_meta?.video
          });
        }
      }

      setLoading(false);
    };

    VIEW_API();
  }, [id]);

  const onFinish = async () => {
    setLoading(true);

    const FORM_DATA = new FormData();

    try {

      FORM_DATA.append("ads_type", ads_type);
      FORM_DATA.append("id", atob(id));
      FORM_DATA.append("priority", difficulty);

      FORM_DATA.append(
        "start_date",
        start_date ? start_date.format("YYYY-MM-DD HH:mm:ss") : ""
      );

      FORM_DATA.append(
        "end_date",
        end_date ? end_date.format("YYYY-MM-DD HH:mm:ss") : ""
      );

      // VIDEO
      if (ads_type === "video") {
        FORM_DATA.append("video", selectedVideo?.id);
      }

      // IMAGE
      if (ads_type === "image") {
        if (image_api) {
          FORM_DATA.append("image", image_api);
        }
      }

      // CONTENT
      if (ads_type === "content") {
        FORM_DATA.append("title", title);
        FORM_DATA.append("description", description);
      }

      const response = await EDIT_ADS(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });

        navigate("/advertisement");

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


  const onTypeChange = (e) => {
    set_ads_type(e.target.value);
    form.setFieldsValue({ ads_type: e.target.value });

  };

  return (
    <div className="lms-body">
      <Card >

        {
          loading ? <>
            <CulsightPageLoader />
          </> : <>
            <h2> <span style={{ cursor: "pointer" }}
              onClick={() => navigate("/advertisement")}><LeftOutlined /></span>Edit Advertisement</h2>
            <Form form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onFinish}
              validateTrigger="onSubmit">

              {/* Ads Type */}
              <Form.Item label="Ads Type" name="ads_type">
                <Radio.Group onChange={onTypeChange}>
                  <Radio value="video">Video</Radio>
                  <Radio value="image">Image</Radio>
                  <Radio value="content">Content</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Video Upload */}
              {ads_type === "video" && (
                <Form.Item label="Select Video">
                  <Button type="dashed" onClick={() => setShowVideoModal(true)}>
                    {selectedVideo ? `Selected Video ID: ${selectedVideo.id}` : "Click to Select Video"}
                  </Button>
                  {errors?.video_id && (
                    <span style={{ color: "red" }}>{errors?.video_id}</span>
                  )}


                </Form.Item>

              )}

              {/* Audio Upload */}
              {ads_type === "image" && (
                <Form.Item label="Upload Advertisement Photo here">
                  <Upload
                    style={{ width: "250px", minHeight: "200px" }}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      console.log(file)
                      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                      // const isLt2M = file.size <= 2 * 1024 * 1024;
                      const isLt512KB = file.size <= 512 * 1024;

                      if (!isJpgOrPng) {
                        set_image_api('');
                        set_image('')
                        setimageError("Only JPG/PNG files are allowed.");
                        return false;
                      }

                      if (!isLt512KB) {
                        set_image_api('');
                        set_image('')
                        setimageError("image must be smaller than or equal to 512KB.");
                        return false;
                      }
                      const img = new Image();
                      img.src = URL.createObjectURL(file);

                      img.onload = () => {
                        const { width, height } = img;
                        // Example: Minimum 300x300 pixels
                        if (width === 490 && height === 320) {
                          setimageError(""); // Clear errors if valid

                          // Set preview and file for API
                          getBase64(file, (url) => set_image(url));
                          set_image_api(file);

                        } else {
                          set_image_api('');
                          set_image('')
                          setimageError("Image must be at least 490x320 pixels.");
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
                  <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - image must be smaller than or equal to 512KB and must be at least 490x320 pixels.</p>
                </Form.Item>
              )}

              {/* Content Fields */}
              {ads_type === "content" && (
                <>
                  <Form.Item label="Title">
                    <Input placeholder="Enter title" value={title} onChange={(e) => set_title(e.target.value)} />
                  </Form.Item>

                  <Form.Item>
                    <CustomRichTextEditor
                      value={description}
                      editorLabel="Description"
                      onChange={(val) => set_description(val)}
                      placeholder="Write something..."
                    />{" "}
                    {errors?.description && (
                      <span style={{ color: "red" }}>{errors.description}</span>
                    )}
                  </Form.Item>
                </>
              )}

              <Form.Item label="Priority">
                <Select
                  mode="tag"
                  value={difficulty}
                  onChange={set_difficulty}
                  placeholder="Please select"
                  style={{ width: "100%" }}
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "hight", label: "Hight" },
                  ]}
                />
                {errors?.difficulty && (
                  <span style={{ color: "red" }}>{errors?.difficulty}</span>
                )}</Form.Item>


              <Form.Item label="Start Date">
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(date) => {
                    set_start_date(date);
                    set_end_date(null); // reset end date
                  }}
                  value={start_date}
                />
                {errors?.start_date && <span style={{ color: "red" }}>{errors.start_date}</span>}
              </Form.Item>

              {/* END DATE */}
              <Form.Item label="End Date">
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={set_end_date}
                  value={end_date}
                  disabledDate={(current) =>
                    start_date && current.isBefore(start_date.startOf('day'))
                  }
                />
                {errors?.end_date && <span style={{ color: "red" }}>{errors.end_date}</span>}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>

            </Form>
          </>
        }

      </Card>

      <Modal
        open={showVideoModal}
        title="Select a Video"
        onCancel={() => setShowVideoModal(false)}
        footer={null}
        width={900}
      >
        <SelectVideoList
          onSelect={(video) => {
            setSelectedVideo(video);
            setShowVideoModal(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default EditAdvertisement;