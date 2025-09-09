import { Card } from "antd";

export default function PackageCourseBox(props) {
  return (
    <div>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="example"
            src={props.course_image}
            style={{
                    display: "block",
                    width: "100%",
                    borderRadius: "8px 8px 0 0",
                  }}
          />
        }
      >
          <Card.Meta title={props.course_title} />
       
      </Card>
    </div>
  );
}
