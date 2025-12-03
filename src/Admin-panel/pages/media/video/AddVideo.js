import React, { useState } from "react";
import { App, Button, Col, Form, Input, Progress, Row, Upload } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ADD_VIDEO_VIEW, GET_AWS_SIGN_UPLOAD_VIDEO } from "../../../apis/apis";
import axios from "axios";
import CustomRichTextEditor from "../../../components/CustomTextEditor";

function AddVideo(props) {
  const { notification, message } = App.useApp();
  const { set_add_video, list_refresh, set_list_refresh } = props;
  const [errors, set_errors] = useState("");
  const [thumbnail, set_thumbnail] = useState("");
  const [total_video_length, set_total_video_length] = useState(0);
  const [thumbnail_api, set_thumbnail_api] = useState("");
  const [description, set_description] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, set_title] = useState("");
  const [organization_video, set_organization_video] = useState('');
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [video_uploading_message,set_video_uploading_message] = useState("")
  const [thumbnailError, setthumbnailError] = useState("");

  const [upload_button_enable, set_upload_button_enable] = useState(false)


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
    set_thumbnail_api(info.file);
    if (info.file.status === "done") {
      const fileObj = info.file.originFileObj;
      set_thumbnail_api(fileObj);
      getBase64(fileObj, (url) => {
        setLoading(false);
        set_thumbnail(url);
      });
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("Upload failed. Please try again.");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? (
        <LoadingOutlined style={{ color: "#fff" }} />
      ) : (
        <PlusOutlined style={{ color: "#fff" }} />
      )}
      <div style={{ marginTop: 8, color: "#fff" }}>Upload</div>
    </button>
  );

const handleChangeVideo = async (info) => {
  if (info.file.status === "uploading") {
    setLoading(true);
    return;
  }

  

  setUploading(true);
  setProgress(0);

  const formData = new FormData();
  formData.append("filename", info.file.name);
  formData.append("type", info.file.type);

  //  Get duration before uploading
  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = function () {
        reject("Invalid video file.");
      };
      video.src = URL.createObjectURL(file);
    });
  };

  try {
    const durationInSeconds = await getVideoDuration(info.file);
    set_total_video_length(durationInSeconds);

    const response = await GET_AWS_SIGN_UPLOAD_VIDEO(formData);

    if (response?.data?.status) {
      //  Step 1: Upload to S3
      await axios.put(response?.data?.uploadUrl, info.file, {
        headers: {
          "Content-Type": info.file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          if(percent >= 100){
            set_video_uploading_message("Uploading and Verifying...");
          }
          
          setProgress(percent >= 100 ? 99 : percent);
          
        },
      });
        set_organization_video(response?.data?.fileKey);
        set_upload_button_enable(true);
        setProgress(100); 

    } else {
      setLoading(false);
      set_errors(response?.data?.errors);
    }
  } catch (error) {
    console.error(error);
    setUploading(false);
  }
};


  const onFinish = async () => {
    set_upload_button_enable(false)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("thumbnail", thumbnail_api);
    formData.append("description", description);
    formData.append("organization_video", organization_video);
    formData.append("total_video_length", total_video_length);

    try {
      const response = await ADD_VIDEO_VIEW(formData);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: "Video is uploaded",
        });
        set_add_video(false);
        list_refresh ? set_list_refresh(false) : set_list_refresh(true);
        setLoading(false);
      } else {
        setLoading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 16 }}>
       <Form layout="vertical" autoComplete="off" form={form} onFinish={onFinish} validateTrigger="onSubmit">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                style={{ width: "100%", height: "32vh", overflow: "hidden" }}
                beforeUpload={(file) => {
                  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                   const isLt512KB = file.size <= 512 * 1024;
                  if (!isJpgOrPng) {
                    set_thumbnail_api('');
                    set_thumbnail('')
                    setthumbnailError("Only JPG/PNG files are allowed.");
                    return false;
                  }

                  if (!isLt512KB) {
                    set_thumbnail_api('');
                    set_thumbnail('')
                    setthumbnailError("Thumbnail must be smaller than or equal to 512KB.");
                    return false;
                  }
                  const img = new Image();
                  img.src = URL.createObjectURL(file);

                  img.onload = () => {
                    const { width, height } = img;
                    if (width === 490 && height === 320) {
                      setthumbnailError("");
                      getBase64(file, (url) => set_thumbnail(url));
                      set_thumbnail_api(file);
                    } else {
                      set_thumbnail_api('');
                      set_thumbnail('')
                      setthumbnailError("Image must be at least 490x320 pixels.");
                    }

                  };
                  return false;

                }}
                onChange={handleChange}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
              {errors?.thumbnail && (
                <span style={{ color: "red" }}>{errors?.thumbnail}</span>
              )}
              {thumbnailError && (
                <span
                  style={{ color: "red", display: "block", marginTop: 8 }}
                >
                  {thumbnailError}
                </span>
              )}
              <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 512KB and must be at least 490x320 pixels.</p>

            </Form.Item>
          </Col>

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
            
            <Form.Item label="Video File">
              <Upload
                name="video"
                accept=".mp4"
                className="block-style"
                beforeUpload={(file) => {
                const isMp4 = file.type === "video/mp4";
                  if (!isMp4) {
                      notification.error({
                      message: "Failed",
                      description: "You can only upload MP4 files!",
                    });
                    return Upload.LIST_IGNORE; //  stop karega
                  }

                  const maxSizeInBytes = 3 * 1024 * 1024 * 1024; // 1 GB
                  if (file.size > maxSizeInBytes) {
                     notification.error({
                      message: "Failed",
                      description: "Video file must be smaller than or equal to 3 GB.",
                    });
                    return Upload.LIST_IGNORE; //  stop karega
                  }

                  return false; //  allow karega
                }}
                onChange={handleChangeVideo}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} block>Select MP4</Button>
              </Upload>
              {uploading && <Progress percent={progress} status="active" />}
              {errors?.organization_video && (
                <span style={{ color: "red" }}>{errors?.organization_video}</span>
              )}
            </Form.Item>
            {progress === 99 && <>  <p style={{color:"orange", position:"relative", top:"-17px"}}>{video_uploading_message}</p></>}
            {progress === 100 && <>  <p style={{color:"rgb(101, 231, 196)", position:"relative", top:"-17px"}}>Upload successful & verified</p></>}
            {progress === 100 ? (
              <>
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
              </>
            ) : (
              <Button type="primary" disabled>
                Upload
              </Button>
            )}
            
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddVideo;
