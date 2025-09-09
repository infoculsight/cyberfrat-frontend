import { Card } from "antd";

export default function VideoBox(props) {
  return (
    <div>
      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="example"
            src={props.video_image}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        }
      >
          <Card.Meta title={props.video_title} />
       
      </Card>
    </div>
  );
}
