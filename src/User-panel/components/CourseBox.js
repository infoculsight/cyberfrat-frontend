import { Card, Progress, Tag, Button,Typography } from "antd";
import { DownloadOutlined, } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const { Text } = Typography;
export default function CourseBox(props) {
  const Navigate = useNavigate();
  // const { notification } = App.useApp();

  const handleDownload = () => {
    const url = props.certificate;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.course_title}_Certificate.pdf`;
    link.click();
  };


  return (
    <div style={{ position: "relative" }}>


      <Card
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <div style={{ position: "relative" }}>
            <img
              alt="example"
              src={props.course_image}
              onClick={() => Navigate("/view-course/" + props.id)}
              style={{
                width: "100%",
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                cursor: "pointer",
                display: "block",
              }}
            />
            {props.course_ribbon ? <>
              <Tag
                color="#f7d40add"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  fontWeight: "bold",
                }}
              >
                In Package
              </Tag>
            </> : <>
              {""}
            </>}

          </div>
        }
      >
        <Card.Meta
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
              <span>{props.course_title}</span></Text>

              <Button
                type="primary"
                size="small"
                disabled={!props.certificate}
                onClick={handleDownload}
              >

                Certificate <DownloadOutlined />
              </Button>
            </div>
          }
        />

        <Progress strokeColor="#FFD700" percent={props.progress} status="active" style={{ marginTop: "10px" }} />
      </Card>


    </div>
  );
}


{/* <span
                  style={{ cursor: "pointer", color: "#f5222d", fontSize: 16 }}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                </span> */}
