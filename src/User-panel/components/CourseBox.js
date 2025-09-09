import {  Card, Progress, Tag } from "antd";
// import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CourseBox(props) {
  const Navigate = useNavigate();
  // const { notification } = App.useApp();


  // const initialWishlistState = localStorage.getItem(`wishlist_${props.id}`);
  // const [isWishlisted, setIsWishlisted] = useState(
  //   initialWishlistState !== null ? JSON.parse(initialWishlistState) : (props.in_wishlist || false)
  // );

//   const handleWishlist = async () => {
//   try {
//     const FORM_DATA = new FormData();
//     FORM_DATA.append("course_id", atob(props.id));
//     const API_CALL = await ADD_COURSE_TO_WISHLIST(FORM_DATA);

//     if (API_CALL?.data?.status) {
//       const backendMessage = API_CALL.data.message || "Wishlist updated successfully.";
//       notification.success({
//         message: "Successful",
//         description: backendMessage,
//         placement: "topRight",
//       });

//       const newWishlistStatus = !isWishlisted;
//       setIsWishlisted(newWishlistStatus);
//       localStorage.setItem(`wishlist_${props.id}`, JSON.stringify(newWishlistStatus));

//       message.success(backendMessage);
//     } else {
//       const errorMsg = API_CALL?.data?.message || `Could not update wishlist for ${props.course_title}.`;
//       notification.error({
//         message: "Failed",
//         description: errorMsg,
//         placement: "topRight",
//       });
//     }
//   } catch (error) {
//     notification.error({
//       message: "Error",
//       description: "Something went wrong while updating wishlist.",
//       placement: "topRight",
//     });
//   } 
// };

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
                  color="green"
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
              </div>
            }
          />

          <Progress percent={props.progress} status="active" style={{ marginTop: "10px" }} />
        </Card>
 

    </div>
  );
}
