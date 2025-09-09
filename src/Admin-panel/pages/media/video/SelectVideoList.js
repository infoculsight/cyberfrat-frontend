import React, { useEffect, useState, useMemo } from "react";
import { List, Avatar, Pagination, Input, Select, Modal } from "antd";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import { LIST_VIDEO } from "../../../apis/apis";
import debounce from "lodash.debounce";

const { Option } = Select;

function SelectVideoList({ onSelect }) {
  const [loading, setLoading] = useState(true);
  const [videos, set_videos] = useState([]);
  const [current_page, set_current_page] = useState(1);
  const [total_videos, set_total_videos] = useState(0);
  const [search_title, set_search_title] = useState("");
  const [search_key, set_search_key] = useState("title");

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getVideos = async (page = 1, title = "") => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    if (search_key === "title") FORM_DATA.append("title", title);

    try {
      const API_CALL = await LIST_VIDEO(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_videos(API_CALL.data?.data);
        set_total_videos
(API_CALL.data?.total_videos
);
        set_current_page(API_CALL?.data?.current_page);
      }
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos(current_page, search_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current_page, search_key]);

  const debouncedSearch = useMemo(() => {
    return debounce((value) => {
      getVideos(1, value);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_key]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handlePageChange = (page) => {
    set_current_page(page);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    set_search_title(value);
    debouncedSearch(value);
  };

  const handleSearchKeyChange = (val) => {
    set_search_key(val);
    debouncedSearch(search_title);
  };

  const selectBefore = (
    <Select defaultValue="title" onChange={handleSearchKeyChange}>
      <Option value="title">Title</Option>
    </Select>
  );

  const confirmVideoSelection = (item) => {
    setSelectedVideo(item);
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    if (onSelect && selectedVideo) {
      onSelect(selectedVideo);
    }
    setConfirmModal(false);
  };

  return (
    <div>
      <Input
        addonBefore={selectBefore}
        placeholder="Search by title"
        value={search_title}
        onChange={handleSearchChange}
        style={{ margin: "20px 0" }}
      />

      {loading ? (
        <CulsightPageLoader />
      ) : videos?.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: 18, color: "red" }}>
          Data Empty
        </p>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={videos}
            renderItem={(item) => (
              <>
               {item?.organization_video && <>
                    <List.Item
                onClick={() => confirmVideoSelection(item)}
                style={{ cursor: "pointer" }}
              >
               
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" size={80} src={item?.thumbnail} />
                  }
                  title={
                    item?.organization_video ? item?.title : "Processing..."
                  }
                  description={
                    <p
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 0,
                      }}
                    >
                      {item?.description || "No description"}
                    </p>
                  }
                />
              </List.Item>
                </>}
              </>
          
            )}
          />

          <div style={{ float: "right", marginTop: "20px" }}>
            <Pagination
              current={current_page}
              total={total_videos
}
              pageSize={12}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}

      <Modal
        open={confirmModal}
        title="Confirm Video Selection"
        onCancel={() => setConfirmModal(false)}
        onOk={handleConfirm}
        okText="Yes, Select"
        cancelText="Cancel"
      >
        {selectedVideo && (
          <div>
            <p>
              <b>Title:</b> {selectedVideo.title}
            </p>
            <img
              src={selectedVideo.thumbnail}
              alt="Thumbnail"
              style={{ width: 200, borderRadius: 8 }}
            />
            <p style={{ marginTop: 10 }}>
              Are you sure you want to select this video?
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SelectVideoList;
