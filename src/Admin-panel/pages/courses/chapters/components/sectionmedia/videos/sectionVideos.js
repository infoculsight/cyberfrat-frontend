import { App, Avatar, Button, List, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { SECTION_VIDEO_LIST, DELETE_SELECT_VIDEO } from '../../../../../../apis/apis';
import MediaSectionVideoList from '../../../../../media/video/MediaSectionVideoList';
import CulsightPageLoader from '../../../../../../components/CulsightPageLoader';

function SectionVideos(props) {
  const { chapter_id, section_id } = props;
  const { notification } = App.useApp();

  const [video_loader, set_video_loader] = useState(true);
  const [culsight_video, set_culsight_video] = useState(false);
  const [section_video_list_refresh, set_section_video_list_refresh] = useState(false);
  const [video_data, set_video_data] = useState([]);

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", chapter_id);
      FORM_DATA.append("section_id", section_id);
      FORM_DATA.append("section_video_list_refresh", section_video_list_refresh);
      try {
        const API_CALL = await SECTION_VIDEO_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_video_data(API_CALL?.data?.data);
        } else {
          console.error("API error:", API_CALL);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        set_video_loader(false);
      }
    };

    LIST_API();
  }, [chapter_id, section_id, culsight_video, section_video_list_refresh]);

  const handleRemoveVideo = async (video_id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("section_id", section_id);
    FORM_DATA.append("culsight_video_id", video_id);
    FORM_DATA.append("video_type", "upload");

    try {
      const response = await DELETE_SELECT_VIDEO(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Removed Successfully",
          description: response?.data?.message,
        });
        set_section_video_list_refresh(!section_video_list_refresh);
      } else {
        notification.error({
          message: "Failed to Remove",
          description: response?.data?.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error removing video:", error);
      notification.error({
        message: "Error",
        description: "Network error while removing video",
      });
    }
  };

  return (
    <>
      <h2>
        <span>Section Media </span>
        <Button size="small" variant="solid" color="green" onClick={() => set_culsight_video(true)}>
          Culsight Videos
        </Button>
      </h2>

      <MediaSectionVideoList
        section_video_list_refresh={section_video_list_refresh}
        set_section_video_list_refresh={set_section_video_list_refresh}
        culsight_video={culsight_video}
        set_culsight_video={set_culsight_video}
        section_id={section_id}
      />

      {video_loader ? (
        <CulsightPageLoader />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={video_data}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure you want to remove this video?"
                  onConfirm={() => handleRemoveVideo(item?.url)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small">Remove</Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    shape="square"
                    src={item?.thumbnail}
                  />
                }
                title={<>{item?.title}</>}
                description={
                  <p
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.description || "No description"}
                  </p>
                }
              />
            </List.Item>
          )}
        />
      )}
    </>
  );
}

export default SectionVideos;
