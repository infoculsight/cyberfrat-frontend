import { Card, Spin, Tag, Typography, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function PackageBox(props) {
  const Navigate = useNavigate();
  const [image_loader, set_image_loader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    if (props.expired) {
      // Show expired modal
      setIsModalOpen(true);
    } else {
      // Normal navigation
      props?.assign
        ? Navigate("/package-courses/" + props.id)
        : Navigate("/unassign-courses/" + props.id);
    }
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



  return (
    <div>
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
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              </div>
            )}

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px 8px 0 0",
                minHeight: "26vh",
              }}
            >
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
                  Expired
                </div>
              )}

              <img
                alt="example"
                src={props.package_image}
                onLoad={() => set_image_loader(true)}
                onError={() => set_image_loader(false)}
                onClick={handleImageClick}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  display: image_loader ? "block" : "none",
                }}
              />
            </div>
          </div>
        }
      >
        <Card.Meta
          title={
            <div
              style={{
                textAlign: "center",
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Text
                ellipsis={{ tooltip: props.package_name }}
                style={{
                  fontSize: 14,
                  maxWidth: "calc(100% - 120px)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textTransform: "capitalize",
                }}
              >
                {props.package_name}
              </Text>

              {props.showAssignTag &&
                (props?.assign ? (
                  <Tag color="gold" size="small">
                    Assigned
                  </Tag>
                ) : (
                  <Tag color="red" variant="solid" size="small">
                    UnAssigned
                  </Tag>
                ))}
            </div>
          }
          description={
            <div>
            <Text
              ellipsis={{ tooltip: props.package_tag_line }}
              style={{
                fontSize: 14,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.package_tag_line}
            </Text>

                <span
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color:"Gold",
                    marginTop: 2,
                  }}
                >
                 Valid Till = 
                </span>{" "}{formatDateTime(props.validity)}
              </div>
          }
        />
      
      </Card>

      {/* Expired Modal */}
      <Modal
        title="Package Expired"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText="OK"
      >
        <p>This package has expired and cannot be accessed.</p>
      </Modal>
    </div>
  );
}
