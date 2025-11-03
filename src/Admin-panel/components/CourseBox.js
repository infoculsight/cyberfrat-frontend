import { Button, Card, Popconfirm, Popover, Spin, Tag } from "antd";
import { useState } from "react";
import {
  DeleteFilled,
  UserOutlined,
  FileOutlined,
  EyeOutlined,
  LoadingOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CourseBox(props) {
  const Navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <div style={{ position: "relative" }}>
            {props.course_ribbon && (
              <Tag
                color={
                  props.course_ribbon === "UNPUBLISHED"
                    ? "gold"
                    : props.course_ribbon === "Included in Package"
                      ? "green"
                      : "default"
                }
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 1,
                  fontWeight: "bold",
                }}
              >
                {props.course_ribbon}
              </Tag>
            )}




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

             <div style={{position:"relative", overflow:"hidden",borderRadius: "8px 8px 0px 0px", minHeight:"26vh"}}>
               <img
                src={props.course_image}
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

          </div>
        }
        actions={[

          <Popover content={"Course details"}>
            <Button
              color="default"
              variant="filled"
              size="small"
              onClick={() => Navigate("/edit-course/" + props.id)}
            >
              <EyeOutlined />
            </Button>
          </Popover>,
          <Popover content={"View course chapters"}>
            <Button
              size="small"
              color="default"
              variant="filled"
              onClick={() => {
                localStorage.setItem("course_title", props.course_title);
                Navigate("/chapters/" + props.id, {
                  state: { title: props.course_title },
                  from: window.location.pathname,
                });
              }}
            >
              <FileOutlined />{props.chapters_count}
            </Button>
          </Popover>,
         
          <Popover content={props.course_status ? "View course learners" : "View course learners (First publish the course then assign)"}>
             {props.course_status ? <>
               <Button
              size="small"
              color="default"
              variant="filled"
              onClick={() => {
                localStorage.setItem("course_title", props.course_title);
                Navigate("/course-learners/" + props.id, {
                  state: { title: props.course_title },
                  from: window.location.pathname,
                });
              }}
            >
              <UserOutlined />{props.users_count}
            </Button>
             </> :   <Button
              size="small"
              color="default"
              variant="filled"
              disabled
              // onClick={() => {
              //   localStorage.setItem("course_title", props.course_title);
              //   Navigate("/course-learners/" + props.id, {
              //     state: { title: props.course_title },
              //     from: window.location.pathname,
              //   });
              // }}
            >
              <UserOutlined />{props.users_count}
            </Button>}
          
          </Popover>,
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => props.deleteCourse()}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" color="default" variant="filled">
              <DeleteFilled />
            </Button>
          </Popconfirm>,
            <Popconfirm
            title={props.course_status ? "Are you sure you want to Unpublish this course ?" :" Are you sure you want to publish this course ?"}
            onConfirm={() => props.publishCourse(atob(props.id))}
            okText="Yes"
            cancelText="No"
          >
           <Button
              size="small"
              type="primary"
              style={{
                backgroundColor: props.course_status
                  ? "#52c41a"
                  : "#faad14",
                borderColor: props.course_status ? "#52c41a" : "#faad14",
              }}
            >
                {props.course_status ? <GlobalOutlined /> :  <LockOutlined /> }
            </Button>
          
          </Popconfirm>,

        ]}
      >
        <Card.Meta title={props.course_title} />
      </Card>
    </div>
  );
}
