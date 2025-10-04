import React, { useEffect } from "react";
import {
  Col,
  Progress,
  Row,
} from "antd";
import { useState } from "react";


export default function ViewChapterDetails(props) {
  const { set_course_id } = props;
  const [image, setimage] = useState("");
  const [title, set_title] = useState("");
  const [introduction, set_introduction] = useState("");
  const [c_progress, set_c_progress] = useState("");

  useEffect(() => {
    const response_data = props.chapter_details;
    set_title(response_data?.title);
    set_introduction(response_data?.introduction);
    set_course_id(response_data?.course_id);
    set_c_progress(response_data?.progress)
    if (response_data?.image) {
      setimage(response_data.image);
    } else {
      setimage("");
    }
  }, [props.chapter_details, set_course_id]); 
  
  
  return (
    <div>
      <Row>
        <Col span={24}>

          <div className="section-details section-details-right-padding">
            <h3>
              <span style={{ color: "#6ca9ff", fontSize: "20px" }}>{title}</span>
            </h3>
            <p>
              <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                Introduction:
              </span>
              <img src={image} alt="Section" />
              <div dangerouslySetInnerHTML={{ __html: introduction }} />
            </p>
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={c_progress}
                status="active"
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
