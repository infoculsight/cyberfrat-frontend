import { Card, Col, Row, Tabs } from "antd";
import ThumbnailList from "./thumbnails/ThumbnailList";
import VideoList from "./video/VideoList";

function ThemeMedia() {
  const tabItems = [
    {
      key: "user-Videos",
      label: "Videos",
      children: <VideoList folder_name="videos" />,
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      children: <ThumbnailList folder_name="Thumbail" />,
    },
  ];

  return (
    <div className="lms-body">
      <Card>
        <h2>Cyberfrat Media</h2>
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Tabs defaultActiveKey="user-Videos" items={tabItems} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default ThemeMedia;
