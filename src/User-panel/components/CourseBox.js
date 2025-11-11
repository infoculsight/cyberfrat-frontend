import { Card, Progress, Tag, Button, Typography, Spin } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Text } = Typography;

export default function CourseBox(props) {
  const Navigate = useNavigate();
  const [image_loader, set_image_loader] = useState(false);



const handleDownload = () => {
  if (!props.certificate) return;
  window.open(props.certificate, "_blank");
};



  return (
    <div style={{ position: "relative" }}>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <div style={{ width: "100%", position: "relative" }}>

            {!image_loader && (
              <div
                style={{
                  width: "100%",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              </div>
            )}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "8px 8px 0px 0px", minHeight: "26vh" }}>
              <img
                alt="course"
                src={props.course_image}
                onLoad={() => set_image_loader(true)}
                onError={() => set_image_loader(false)}
                onClick={() => Navigate("/view-course/" + props.id)}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  cursor: "pointer",
                  display: image_loader ? "block" : "none",
                }}
              />
            </div>
            {props.course_ribbon && (
              <Tag
                color="#f7d40add"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  fontWeight: "bold",
                }}
              >
                In Package
              </Tag>
            )}
          </div>
        }
      >
        <Card.Meta
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                ellipsis={{ tooltip: props.course_title }}
                style={{
                  fontSize: 14,
                  maxWidth: "calc(100% - 120px)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{props.course_title}</span>
              </Text>

              <Button
                type="primary"
                size="small"
                disabled={!props.certificate}
                onClick={handleDownload}
              >
                Certificate <DownloadOutlined />
              </Button>
            </div>
          }
        />

        <Progress
          strokeColor="#FFD700"
          percent={props.progress}
          status="active"
          style={{ marginTop: 10 }}
        />
      </Card>
    </div>
  );
}
