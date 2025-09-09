import { Button, Card, Popover } from "antd";
import React from "react";
import {
  EditOutlined,
  DeleteFilled,
  UserOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function PackageBox(props) {
  const Navigate = useNavigate();

  return (
    <div>
      <Card
        //style={{ width: 300 }}
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="example"
            src={props.package_image}
            //style={{ height: 250 }}
            style={{
              display: "block",
              width: "100%",
              borderRadius: "8px 8px 0 0",
              minHeight:"26vh"
            }}
          />
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

          <Popover content={"Delete course"}>
            <Button color="red" variant="solid" size="small">
              <DeleteFilled />
            </Button>
          </Popover>,
        ]}
      >
        <Card.Meta style={{ height: "80px" }} title={props.package_name} description={props.package_tag_line} />
      </Card>
    </div>
  );
}
