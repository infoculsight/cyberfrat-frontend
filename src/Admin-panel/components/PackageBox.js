import { Button, Card, Popover, Spin } from "antd";
import React, { useState } from "react";
import {
  EditOutlined,
  DeleteFilled,
  UserOutlined,
  SnippetsOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function PackageBox(props) {
  const Navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={

          <div style={{ width: "100%", position: "relative" }}>
            {!imgLoaded && (
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
                src={props.package_image}
                alt="course"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(false)}
                style={{
                  width: "100%",
                  display: imgLoaded ? "block" : "none",
                }}
              />
            </div>
          </div>

        }
        actions={[
          <Popover content={"Edit Package details"}>
            <Button
              type="primary"
              size="small"
              onClick={() => Navigate("/edit-package/" + props.id)}
            >
              <EditOutlined />
            </Button>
          </Popover>,

          <Popover content={"View Package learners"}>
            <Button color="red" variant="solid" size="small" onClick={() => Navigate(`/package-learners/${props.id}`, {
              state: { from: "/packages" },
            })}>
              <UserOutlined />
            </Button>
          </Popover>,

          <Popover content={"View Package Courses"}
            onClick={() => Navigate("/package-courses/" + props.id)}>
            <Button color="red" variant="solid" size="small">
              <SnippetsOutlined />
            </Button>
          </Popover>,

          // <Popover content={"Delete course"}>
          //   <Button color="red" variant="solid" size="small">
          //     <DeleteFilled />
          //   </Button>
          // </Popover>,
        ]}
      >
        <Card.Meta style={{ height: "80px" }} title={props.package_name} description={props.package_tag_line} />
      </Card>
    </div>
  );
}
