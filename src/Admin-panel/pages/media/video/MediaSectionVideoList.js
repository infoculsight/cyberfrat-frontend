import React, { useCallback, useEffect, useState } from "react";
import {
    App,
    Avatar,
    Checkbox,
    List,
    Pagination,
    Modal,
    Button,
    Input,
    Select,
    Popconfirm,
} from "antd";
import {
    ADD_SECTION_VIDEO,
    DELETE_SELECT_VIDEO,
    LIST_VIDEO,
} from "../../../apis/apis";
import AddVideo from "./AddVideo";
import debounce from "lodash.debounce";
import { Option } from "antd/es/mentions";
import CulsightPageLoader from "../../../components/CulsightPageLoader";

function MediaSectionVideoList(props) {
    const {
        section_id,
        culsight_video,
        set_culsight_video,
        section_video_list_refresh,
        set_section_video_list_refresh,
    } = props;
    
    const { notification } = App.useApp();
    const [add_video, set_add_video] = useState(false);
    const [loader, setLoading] = useState(true);
    const [videos, set_videos] = useState([]); 
    const [current_page, set_current_page] = useState(1);
    const [total_pages, set_total_pages] = useState(0);
    const [total_videos, set_total_videos] = useState(0);
    const [list_refresh, set_list_refresh] = useState(true);

    const [search_query_value, set_search_query_value] = useState("");

    const ADD_VIDEO = async (culsight_video_id) => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("section_id", section_id);
        FORM_DATA.append("culsight_video_id", culsight_video_id);
        FORM_DATA.append("video_type", "upload");
        try {
            const response = await ADD_SECTION_VIDEO(FORM_DATA);
            if (response?.data?.status) {
                notification.success({
                    message: "Added Successfully",
                    description: response?.data?.message,
                });
                set_list_refresh(!list_refresh);
                set_section_video_list_refresh(!section_video_list_refresh);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const REMOVE_VIDEO = async (video_id) => {
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
                set_list_refresh(!list_refresh);
                set_section_video_list_refresh(!section_video_list_refresh);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        const LIST_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("list_refresh", list_refresh);
            FORM_DATA.append("section_id", section_id);
            FORM_DATA.append("page", current_page);
            FORM_DATA.append("title", search_query_value);
            try {
                const API_CALL = await LIST_VIDEO(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_videos(API_CALL.data?.data);
                    set_total_videos(API_CALL.data?.total_videos);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                } else {
                    console.log("API error:", API_CALL);
                }
            } catch (error) {
                console.error("API error:", error);
            }
            setLoading(false);
        };

        LIST_API();
    }, [list_refresh, section_id,current_page,search_query_value]);

    const pagination_on_change = async (page) => {
        set_current_page(page);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", page);
        FORM_DATA.append("title", search_query_value);
        FORM_DATA.append("section_id", section_id);
        try {
            const API_CALL = await LIST_VIDEO(FORM_DATA);
            if (API_CALL?.data?.status) {
                set_videos(API_CALL.data?.data);
                set_total_videos(API_CALL.data?.total_videos);
                set_current_page(API_CALL?.data?.current_page);
                set_total_pages(API_CALL?.data?.total_pages);
            } else {
                console.log("API error:", API_CALL);
            }
        } catch (error) {
            console.error("API error:", error);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        set_culsight_video(false);
    };

    const fetchResults = useCallback(
        (search_key, search_value) => {
            debounce(async () => {
                setLoading(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append(search_key, search_value);
                FORM_DATA.append("section_id", section_id);
                try {
                    const API_CALL = await LIST_VIDEO(FORM_DATA);
                    if (API_CALL?.data?.status) {
                        set_videos(API_CALL.data?.data);
                        set_total_videos(API_CALL.data?.total_videos);
                        set_current_page(API_CALL?.data?.current_page);
                        set_total_pages(API_CALL?.data?.total_pages);
                    } else {
                        console.log("API error:", API_CALL);
                    }
                } catch (error) {
                    console.error("API error:", error);
                }
                setLoading(false);
            }, 500)();
        },
        [section_id]
    );

    const handleInput = (e) => {
        const value = e.target.value;
        set_search_query_value(value);
        fetchResults("title", value);
    };

    const selectBefore = (
        <Select
            defaultValue="title"
            onChange={(value) => {
                if (value === "title") {
                    set_search_query_value("title");
                    fetchResults("title", search_query_value);
                }
            }}
        >
            <Option value="title">Title</Option>
        </Select>
    );

    return (
        <>

            <Modal
                title="Select Video"
                closable={{ "aria-label": "Custom Close Button" }}
                open={culsight_video}
                width={700}
                onCancel={handleCancel}
                footer={
                    <div style={{ float: "right", position: "relative", top: "-20px" }}>
                        <Pagination
                            onChange={pagination_on_change}
                            size="small"
                            defaultPageSize={5}
                            current={current_page}
                            total={total_videos}
                            total_pages={total_pages}
                        />
                    </div>
                }
            >
                <div
                    style={{
                        textAlign: "right",
                        position: "relative",
                        top: "-37px",
                    }}
                >
                    <Button
                        style={{
                            textAlign: "right",
                            position: "relative",
                            right: "37px",
                        }}
                        onClick={() => set_add_video(!add_video)}
                    >
                        {add_video ? "List View" : "Add Video"}
                    </Button>
                </div>

                {add_video ? (
                    <AddVideo
                        list_refresh={list_refresh}
                        set_list_refresh={set_list_refresh}
                        set_add_video={set_add_video}
                        add_video={add_video}
                    />
                ) : (
                    <>
                        <Input
                            addonBefore={selectBefore}
                            placeholder="Search by name"
                            onChange={handleInput}
                            style={{ position: "relative", top: "-15px" }}
                            size="large"
                        />
                        {loader ? (
                            <CulsightPageLoader />
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={videos}
                                renderItem={(item) => (
                                    <>
                                        {!item?.organization_video && (
                                            <List.Item>
                                                <Checkbox
                                                    style={{ marginRight: "20px" }}
                                                    disabled={true}
                                                />
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            size={{
                                                                xs: 24,
                                                                sm: 32,
                                                                md: 40,
                                                                lg: 64,
                                                                xl: 80,
                                                                xxl: 100,
                                                            }}
                                                            shape="square"
                                                            src={item?.thumbnail}
                                                        />
                                                    }
                                                    title={
                                                        <>
                                                            {item?.title}
                                                            <span
                                                                style={{
                                                                    color: "orange",
                                                                    float: "right",
                                                                }}
                                                            >
                                                                Video converting in live streaming...
                                                            </span>
                                                        </>
                                                    }
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
                                        {item?.organization_video && (
                                            <List.Item>
                                                <Popconfirm
                                                    title={
                                                        item?.section_video_checked
                                                            ? "Remove this video?"
                                                            : "Add this video?"
                                                    }
                                                    onConfirm={() =>
                                                        item?.section_video_checked
                                                            ? REMOVE_VIDEO(item?.organization_video)
                                                            : ADD_VIDEO(item?.organization_video)
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Checkbox
                                                        style={{ marginRight: "20px" }}
                                                        checked={item?.section_video_checked}
                                                    />
                                                </Popconfirm>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            size={{
                                                                xs: 24,
                                                                sm: 32,
                                                                md: 40,
                                                                lg: 64,
                                                                xl: 80,
                                                                xxl: 100,
                                                            }}
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
                                    </>
                                )}
                            />
                        )}
                    </>
                )}
            </Modal>

        </>
    );
}

export default MediaSectionVideoList;
