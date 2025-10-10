import { Card,Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
export default function PackageBox(props) {
 
   const Navigate = useNavigate();

  return (
    <div>
      <Card
        //style={{ width: 300 }}
        style={{ width: "100%", borderRadius: 8 }}
        cover={
          <img
            alt="example"
            src={props.package_image}
            //style={{ height: 250 }}
             onClick={() => {
                Navigate("/package-courses/" + props.id);
              }}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              cursor:"pointer",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        }
        // actions={[
        //   <Popover content={"Edit Package details"}>
        //     <Button
        //       type="primary"
        //       size="small"
        //       onClick={() => Navigate("/edit-package/" + props.id)}
        //     >
        //       <EditOutlined />
        //     </Button>
        //   </Popover>,

        //   <Popover content={"View Package learners"}
        //    onClick={() => Navigate("/package-learners/" + props.id)}>
        //     <Button color="red" variant="solid" size="small">
        //       <UserOutlined />
        //     </Button>
        //     </Popover>,

        //      <Popover content={"View Package Courses"}
        //    onClick={() => Navigate("/package-courses/" + props.id)}>
        //     <Button color="red" variant="solid" size="small">
        //      <SnippetsOutlined />
        //     </Button>
        //     </Popover>,

        //   <Popover content={"Delete course"}>
        //     <Button color="red" variant="solid" size="small">
        //       <DeleteFilled />
        //     </Button>
        //   </Popover>,
        // ]}
      >
        <Card.Meta title=     <Text
            ellipsis={{ tooltip: props.course_title }}
            style={{
              fontSize: 14,
              maxWidth: "calc(100% - 40px)", // adjust based on checkbox width
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >{props.package_name}</Text>  description={props.package_tag_line}/>
      </Card>
    </div>
  );
}
