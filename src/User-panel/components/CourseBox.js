import {  Card, Progress, Tag ,Button} from "antd";
 import {DownloadOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CourseBox(props) {
  const Navigate = useNavigate();
  // const { notification } = App.useApp();



  return (
    <div style={{ position: "relative" }}>
   
     
        <Card
          style={{ width: "100%", borderRadius: 8 }}
          cover={
            <div style={{ position: "relative" }}>
              <img
                alt="example"
                src={props.course_image}
                onClick={() => {
                  localStorage.setItem("course_title", props.course_title);
                  Navigate("/chapters/" + props.id, {
                    state: { title: props.course_title },
                    from: window.location.pathname,
                  });
                }}
                style={{
                  width: "100%",
                  height: "200px",
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
                <span>{props.course_title}</span>
                {/* <span
                  style={{ cursor: "pointer", color: "#f5222d", fontSize: 16 }}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                </span> */}
                  <Button
                variant="solid"
                color="green"
                size="small"
                //</div>disabled={!props.certificate}
                //onClick={handleDownload}
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
