import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Switch,
  Upload,
} from "antd";
import {
  LeftOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CustomRichTextEditor from "../../../components/CustomTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { ADD_CHAPTER } from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import SelectVideoList from "../../media/video/SelectVideoList";

export default function AddChapter(props) { 
  const { notification } = App.useApp();
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, set_title] = useState("");
  const [introduction, set_introduction] = useState("");
  const [scorm, set_scorm] = useState("");
  const [form] = Form.useForm();
  const [errors, set_errors] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [is_mandatory, set_is_mandatory] = useState(false);


  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("title", title);
    FORM_DATA.append("introduction", introduction);
    FORM_DATA.append("scorm", scorm);
    FORM_DATA.append("course_id", atob(course_id));
    FORM_DATA.append("video_id", selectedVideo?.id || "");
    FORM_DATA.append('show_chapter_discussion_to_learner', is_mandatory ? 1 : 0);

    try {
      const response = await ADD_CHAPTER(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });

        navigate("/edit-chapter/" + btoa(response?.data?.data?.chapter_id));
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={12}>
            <h2> <span style={{ cursor: "pointer" }}
              onClick={() => navigate("/chapters/" + course_id)}><LeftOutlined /></span>Add Chapter Details</h2>
          </Col>
        </Row>

        {loading ? (
          <CulsightPageLoader />
        ) : (
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

                   <Form.Item label="Show Chapter Discussion to learners">
                 <Switch checked={is_mandatory} onChange={set_is_mandatory} />
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

                      set_scorm(file);
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
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                    disabled={loading}
                  >
                    {loading ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : "Save"}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}

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
      </Card>
    </div>
  );
}
