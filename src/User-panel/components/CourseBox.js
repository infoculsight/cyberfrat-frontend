import { Card, Progress, Tag, Button, Typography, Spin, Modal } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const { Text } = Typography;

export default function CourseBox(props) {
  const Navigate = useNavigate();
  const [image_loader, set_image_loader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleDownload = () => {
    const printWindow = window.open(props.certificate, "_blank");
    printWindow.onload = () => {
      printWindow.print();
    };
  };



  function formatDateTime(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  }


  function renderValidity(validity) {
    if (!validity) return null;

    if (typeof validity === "string" && validity.toLowerCase() === "lifetime") {
      return "LifeTime";
    }

    return formatDateTime(props.validity);
  }



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

              {/* Ribbon */}
              {props.expired && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: -30,
                    transform: "rotate(-45deg)",
                    backgroundColor: "red",
                    color: "white",
                    padding: "3px 40px",
                    fontWeight: "bold",
                    zIndex: 10,
                    fontSize: 12,
                    height: "20px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span>
                    Expired
                  </span>

                </div>
              )}
              <img
                alt="course"
                src={props.course_image}
                onLoad={() => set_image_loader(true)}
                onError={() => set_image_loader(false)}
                onClick={() => {
                  if (props.expired) {
                    setIsModalOpen(true);
                  } else {
                    Navigate("/view-course/" + props.id);
                  }
                }}
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

        <div
          style={{
            visibility: props.validity ? "visible" : "hidden",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "gold",
            }}
          >
            Valid Till =
          </span>{" "}
          {props.validity && renderValidity(props.validity)}
        </div>


      </Card>

      {/* Expired Modal */}
      <Modal
        title="Course Expired"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText="OK"
      >
        <p>This course has expired and cannot be accessed.</p>
      </Modal>
    </div>
  );
}
