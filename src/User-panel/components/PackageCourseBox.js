import { Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function PackageCourseBox(props) {
  
  const Navigate = useNavigate();
  return (
    <div>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="example"
            src={props.course_image}
            onClick={() => {
                localStorage.setItem("course_title", props.course_title);
                Navigate("/chapters/" + props.id, {
                  state: { title: props.course_title },
                });
              }}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              cursor:"pointer",
            }}
          />
        }
      >
          <Card.Meta title={ <span style={{ textTransform: "capitalize" }}>{props.course_title} </span>} />
       
      </Card>
    </div>
  );
}
