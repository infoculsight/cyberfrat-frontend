import { App, Card, Spin, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
const { Text } = Typography;
export default function PackageBox(props) {
  const { notification, message } = App.useApp();
  const Navigate = useNavigate();
  const [image_loader, set_image_loader] = useState(false)

  return (
    <div>
      <Card
        //style={{ width: 300 }}
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
                alt="example"
                src={props.package_image}
                onLoad={() => set_image_loader(true)}
                onError={() => set_image_loader(false)}
                onClick={() => {
                  props?.assign ? Navigate("/package-courses/" + props.id) : message.error("You don't have access to this package. Please contact with admin")
                }}
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
        <Card.Meta title=<Text
          ellipsis={{ tooltip: props.course_title }}
          style={{
            fontSize: 14,
            maxWidth: "calc(100% - 40px)", // adjust based on checkbox width
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >{props.package_name}</Text> description={props.package_tag_line} />
      </Card>
    </div>
  );
}
