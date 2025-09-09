import React, { useEffect } from "react";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Upload,
} from "antd";
import {
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { EDIT_CHAPTER } from "../../../../apis/apis";
import CustomRichTextEditor from "../../../../components/CustomTextEditor";
import SelectVideoList from "../../../media/video/SelectVideoList";

export default function EditChapterDetails(props) {
  const { notification } = App.useApp();

  const { set_course_id } = props;
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [title, set_title] = useState("");
  const [introduction, set_introduction] = useState("");
  const [scorm, set_scorm] = useState(null);
  const [form] = Form.useForm();
  const [errors, set_errors] = useState("");
  // Video modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);



  useEffect(() => {
    const response_data = props.chapter_details;
    set_title(response_data?.title);
    set_introduction(response_data?.introduction);
    set_course_id(response_data?.course_id);
    setSelectedVideo(response_data?.video)
   

    if (response_data?.scorm) {
      const fileName = response_data.scorm.split("/").pop();
      const file = {
        uid: "-1",
        name: fileName,
        status: "done",
        url: response_data.scorm,
      };
      set_scorm(file);
    } else {
      set_scorm(null);
    }
  }, [props.chapter_details, set_course_id]);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
 
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("title", title);
    FORM_DATA.append("introduction", introduction);
    FORM_DATA.append("video_id", selectedVideo?.id || "");
    if (scorm && scorm.originFileObj instanceof File) {
      FORM_DATA.append("scorm", scorm.originFileObj);
    } else {
      FORM_DATA.append("scorm", "");
    }

    try {
      const response = await EDIT_CHAPTER(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        setLoading(false);
        if (props.page_refresh) {
          props.set_page_refresh(false);
        } else {
          props.set_page_refresh(true);
        }
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
    <div>
      <Row>
        <Col span={24}>
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            validateTrigger="onSubmit"
            onFinish={onFinish}
          >
            <Form.Item label="Title">
              <Input
                value={title}
                onChange={(e) => set_title(e.target.value)}
              />
              {errors?.title && (
                <span style={{ color: "red" }}>{errors?.title}</span>
              )}
            </Form.Item>

            <Form.Item>
            <CustomRichTextEditor
              value={introduction}
              editorLabel="Introduction"
              onChange={(val) => set_introduction(val)}
              placeholder="Write something..."
            />
            {errors?.introduction && (
              <span style={{ color: "red" }}>{errors?.introduction}</span>
            )}
            </Form.Item>

            <Form.Item label="Select Video">
              <Button type="dashed" onClick={() => setShowVideoModal(true)}>
                {selectedVideo ? `Selected: ${selectedVideo.title}` : "Click to Select Video"}
              </Button>
              {errors?.video_id && (
                <span style={{ color: "red" }}>{errors?.video_id}</span>
              )}
              {selectedVideo && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={selectedVideo.thumbnail}
                    alt="Thumbnail"
                    width={150}
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item label="File (PDF)">
              <Upload
                accept=".pdf"
                beforeUpload={(file) => {
                  const isPDF = file.type === "application/pdf";
                  const isLt10M = file.size / 1024 / 1024 < 10;

                  if (!isPDF) {
                    message.error("You can only upload PDF files!");
                    return Upload.LIST_IGNORE;
                  }

                  if (!isLt10M) {
                    message.error("File must be smaller than 10MB!");
                    return Upload.LIST_IGNORE;
                  }

                  const newFile = {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                  };
                  set_scorm(newFile);
                  message.success(`${file.name} selected successfully.`);
                  return false;
                }}
                showUploadList={true}
                fileList={scorm ? [scorm] : []}
                onRemove={() => set_scorm(null)}
              >
                <Button icon={<UploadOutlined />}>Select PDF</Button>
              </Upload>
              {errors?.scorm && (
                <span style={{ color: "red" }}>{errors?.scorm}</span>
              )}
            </Form.Item>

            <Form.Item>
              {loading ? (
                <>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    update
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Update
                  </Button>
                </>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
       {/* VIDEO SELECT MODAL */}
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
