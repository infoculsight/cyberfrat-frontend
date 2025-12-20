import { List, Progress } from 'antd';
import { useEffect, useState } from 'react';
import { SECTION_VIDEO_LIST } from '../../../../../apis/apis';
import CulsightPageLoader from '../../../../../components/CulsightPageLoader';
import VideoPage from './VideoPage';
import { PlayCircleFilled } from "@ant-design/icons";

function SectionVideos(props) {
  const { chapter_id, section_id, set_next_view, set_single_progress, video_row, set_course_watch_percent } = props;

  const [video_loader, set_video_loader] = useState(true);
  const [video_data, set_video_data] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [video_api_refresh, set_video_api_refresh] = useState(false);
  const [cuurent_video_id, set_current_video_id] = useState('');

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));
      try {
        const API_CALL = await SECTION_VIDEO_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          if (API_CALL?.data?.data?.progress) {
            set_single_progress(API_CALL?.data?.data?.progress)
            set_next_view(true)
            set_video_data([]);
          } else {
            set_video_data(API_CALL?.data?.data);
            set_single_progress(API_CALL?.data?.data[0]?.progress)
          }
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
  }, [chapter_id, section_id, video_api_refresh, set_next_view]);

 


  return (
    <>
      {video_loader ? (
        <CulsightPageLoader />
      ) : (
        <>
          {video_data?.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={video_data}
              renderItem={(item) => (
                <List.Item style={{ padding: '10px 0' }}>
                  <List.Item.Meta
                    description={
                      <>
                        {selectedVideoId === item?.id ? (
                          <>
                            <VideoPage
                              video_id={item?.url}
                              chapter_id={chapter_id}
                              last_progress={item?.progress}
                              title={item?.title}
                              video_api_refresh={video_api_refresh}
                              set_video_api_refresh={set_video_api_refresh}
                              set_current_video_id={set_current_video_id}
                              row_id={item?.id}
                              set_course_watch_percent={set_course_watch_percent}
                              video_row={video_row}
                            />
                            <div style={{ marginTop: 8 }}>
                              <Progress percent={item?.progress} status="active" strokeColor="#FFD700" />
                            </div>
                          </>
                        ) : (
                          <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
                            {/* Responsive video thumbnail container */}
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "56.25%", 
                                backgroundColor: "black",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                alt="thumbnail"
                                src={item?.thumbnail}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover", 
                                }}
                              />

                              <PlayCircleFilled
                                onClick={() => setSelectedVideoId(item?.id)}
                                style={{
                                  fontSize: "80px", 
                                  position: "absolute",
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  cursor: "pointer",
                                }}
                              />
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <Progress percent={item?.progress} status="active" strokeColor="#FFD700" />
                            </div>
                          </div>

                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />

          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default SectionVideos;
