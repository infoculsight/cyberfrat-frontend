import React, { useState } from "react";
import { Card, Checkbox, Typography } from "antd";

const { Text } = Typography;

export default function AssignCourseBox(props) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (props.onAssignCourse) {
      props.onAssignCourse(e, {
        id: atob(props.id),
        title: props.course_title,
      });
    }
  };

  return (
    <div>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="course"
            src={props.course_image}
            style={{
              width: "100%",
              height: "100px",
              objectFit: "cover",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
          }}
        >
          <Checkbox checked={checked} onChange={handleCheckboxChange} />
          <Text
            ellipsis={{ tooltip: props.course_title }}
            style={{
              fontSize: 14,
              maxWidth: "calc(100% - 40px)", // adjust based on checkbox width
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.course_title}
          </Text>
        </div>
      </Card>
    </div>
  );
}
