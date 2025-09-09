import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Pagination,
  Input,
  Select,
  Popconfirm,
  message,
  Row,
  Col,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";  // ✅ icons import
import AddVideo from "./AddVideo";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { LIST_VIDEO, DELETE_VIDEO } from "../../../apis/apis";
import debounce from "lodash.debounce";
import EditVideo from "./EditVideo";

const { Option } = Select;

function VideoList() {
  const [add_video, set_add_video] = useState(false);
  const [edit_video, set_edit_video] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videos, set_videos] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_videos, set_total_videos] = useState(0);
  const [list_refresh, set_list_refresh] = useState(0);
  const [search_title, set_search_title] = useState("");
  const [search_key, set_search_key] = useState("title");

  const getVideos = async (page = 1, title = "") => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    if (search_key === "title") FORM_DATA.append("title", title);

    try {
      const API_CALL = await LIST_VIDEO(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_videos(API_CALL.data?.data || []);
        set_total_videos(API_CALL.data?.total_videos || 0);
        set_current_page(API_CALL?.data?.current_page || 1);
      } else {
        console.log("API Error");
      }
    } catch (error) {
      console.error("API Error", error);
    }
    setLoading(false);
  };

  const deleteVideo = async (id) => {
    try {
      const FORM_DATA = new FormData();
      FORM_DATA.append("video_id", id);

      const API_CALL = await DELETE_VIDEO(FORM_DATA);

      if (API_CALL?.data?.status) {
        message.success("Video deleted successfully");
        set_list_refresh((prev) => prev + 1);
      } else {
        message.error(API_CALL?.data?.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Delete Error", error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getVideos(current_page, search_title);
  }, [list_refresh, current_page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        getVideos(1, value);
      }, 500),
    [search_key]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    set_search_title(value);
    debouncedSearch(value);
  };

  const handleSelectChange = (val) => {
    set_search_key(val);
    debouncedSearch(search_title);
  };

  const handlePageChange = (page) => {
    set_current_page(page);
  };

  const selectBefore = (
    <Select defaultValue="title" onChange={handleSelectChange}>
      <Option value="title">Title</Option>
    </Select>
  );

  return (
    <div>
      <div style={{ textAlign: "right" }}>
      {!edit_video ?  <Button onClick={() => set_add_video(!add_video)}>
          {add_video ? "List View" : "Add Video"}
        </Button>  : <>
        <Button onClick={() => set_edit_video(false)}>
          List View
        </Button> 
        </>}
      </div>

      {!add_video && !edit_video ? (
        <Input
          addonBefore={selectBefore}
          placeholder="Search by title"
          value={search_title}
          onChange={handleSearchChange}
          style={{
            margin: "20px 0",
            maxWidth: "80%",
            position: "relative",
            top: "-50px",
            marginBottom: "-50px",
          }}
        />
      ): <>
      
      {edit_video && <><h3  style={{
            margin: "20px 0",
            maxWidth: "80%",
            position: "relative",
            top: "-50px",
            marginBottom: "-30px",
          }}>Edit Video</h3></>}
      </>}

      {add_video || edit_video ? (
        <>
        {add_video ? <><AddVideo
          list_refresh={list_refresh}
          edit_video={edit_video}
          set_edit_video={set_edit_video}
          set_list_refresh={set_list_refresh}
          set_add_video={set_add_video}
          add_video={add_video}
        /></> : <>
        <EditVideo
          list_refresh={list_refresh}
          item={edit_video}
          set_edit_video={set_edit_video}
          set_list_refresh={set_list_refresh}
        />
        
        </>}
        </>
      ) : loading ? (
        <CulsightPageLoader />
      ) : videos?.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            color: "red",
            marginTop: "20px",
          }}
        >
          Data Empty
        </p>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {videos.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item?.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item?.title}
                      src={item?.thumbnail}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                  }
                  actions={[
                    // ✅ Edit button
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => set_edit_video(item)}
                    >
                      
                    </Button>,

                    // ✅ Delete button with icon
                    <Popconfirm
                      title="Delete Video"
                      description="Are you sure you want to delete this video?"
                      onConfirm={() => deleteVideo(item?.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={
                      item?.organization_video
                        ? item?.title
                        : item.video_fail === false
                        ? item?.title + " Processing..."
                        : (
                          <span style={{ color: "red" }}>
                            Failed. Please check your internet.
                          </span>
                        )
                    }
                    description={
                      <>
                        {/* {item?.description || "No description"} */}
                        {item.video_fail && (
                          <p style={{ color: "red", margin: 0 }}>
                            Please check your internet connection.
                          </p>
                        )}
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ float: "right", marginTop: "20px" }}>
            <Pagination
              current={current_page}
              total={total_videos}
              pageSize={12}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default VideoList;
