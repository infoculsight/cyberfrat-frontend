import { Card, Col, Row, Button, List, Progress, App, Avatar, Popover } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
    ADD_COMMENT,
    LIST_COMMENT,
    COMMENT_REPLY
} from "../../../../apis/apis";
import CustomRichTextEditor from "../../../../components/CustomTextEditor";



function ChapterComment(props) {
    const { message } = App.useApp();
    const { notification } = App.useApp();

    const [description, set_description] = useState("");
    const [comments, set_comments] = useState([]);
    const [current_page, set_current_page] = useState(1);
    const [total_comments, set_total_comments] = useState(0);
    const [total_pages, set_total_pages] = useState(1);
    const [card_loader, set_card_loader] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);




    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const createdTimeUTC = new Date(timestamp.replace(" ", "T") + "Z");
        const nowUTC = new Date();
        const diffMs = nowUTC - createdTimeUTC;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 4) {
            if (diffMinutes < 1) return "Just now";
            if (diffMinutes < 60)
                return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        }
        const istDate = new Date(createdTimeUTC.getTime() + 5.5 * 60 * 60 * 1000);
        return istDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
        });
    };

    const fetchCommentList = useCallback(async (page = 1) => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("view_id", props.chapter_id);

        FORM_DATA.append("page", page);
        FORM_DATA.append("comment_type", "chapter");
        try {
            const API_CALL = await LIST_COMMENT(FORM_DATA);
            if (API_CALL?.data?.status) {
                const data = API_CALL.data;
                set_comments(data.comments || []);
                set_current_page(data.page || 1);
                set_total_comments(data.total_comments || 0);
                set_total_pages(data.total_pages || 1);
            } else {
                set_comments([]);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            set_card_loader(false);
        }
    }, [props.chapter_id]);

    useEffect(() => {
        if (props.chapter_id) {
            fetchCommentList(1);
        }
    }, [props.chapter_id, fetchCommentList]);


    const onFinish = async () => {
        if (!description.trim()) {
            message.warning("Please write a comment first.");
            return;
        }
        set_card_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("view_id", props.chapter_id);
        FORM_DATA.append("description", description);
        FORM_DATA.append("comment_type", "chapter");
        try {
            const response = await ADD_COMMENT(FORM_DATA);
            if (response?.data?.status) {
                notification.success({
                    message: "Success",
                    description: response?.data?.message,
                });
                set_description("");
                fetchCommentList(1);

            } else {
                message.error(response?.data?.message || "Failed to add comment");
            }
        } catch (error) {
            message.error("Server Error: " + (error?.response?.data?.message || "Unknown error"));
        } finally {
            set_card_loader(false);
        }
    };

    const submitReply = async (comment_id) => {
        if (!replyText.trim()) {
            message.warning("Please write a reply.");
            return;
        }

        setReplyLoading(true);

        const FORM_DATA = new FormData();
        FORM_DATA.append("view_id", props.chapter_id);
        FORM_DATA.append("comment_id", comment_id);
        FORM_DATA.append("description", replyText);
        FORM_DATA.append("comment_type", "chapter");

        try {
            const res = await COMMENT_REPLY(FORM_DATA);

            if (res?.data?.status) {
                notification.success({
                    message: res?.data?.message || "Reply added successfully",
                });

                setReplyText("");
                setReplyingTo(null);

                // 🔥 MUST: refresh comment list
                fetchCommentList(current_page);
            } else {
                message.error("Failed to add reply");
            }
        } catch (error) {
            message.error("Server error");
        } finally {
            setReplyLoading(false);
        }
    };
    return (
        <div style={{ marginTop: "30px" }}>
            <CustomRichTextEditor
                editorLabel="Chapter Discussions"
                value={description}
                onChange={(val) => set_description(val)}
                placeholder="Write something..."
            />
            <Button
                type="primary"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
                onClick={onFinish}
            >
                Add Comment
            </Button>

            <List
                itemLayout="horizontal"
                dataSource={comments}
                style={{ marginTop: "20px" }}
                locale={{ emptyText: "No discussions yet." }}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{item.first_name?.[0]}</Avatar>}
                            title={`${item.first_name} ${item.last_name}`}
                            description={
                                <>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: item.description,
                                        }}
                                    />
                                    <br />
                                    <span style={{ fontSize: "10px", color: "#999" }}>
                                        {formatTime(item.created_at)}
                                    </span>
                                    <br />
                                    <Button
                                        variant="filled"
                                        color="default"
                                        style={{ marginTop: "10px" }}
                                        size="small"
                                        onClick={() =>
                                            setReplyingTo(replyingTo === item.id ? null : item.id)
                                        }
                                    >
                                        Reply {item.replies?.length > 0 && `(${item.replies.length})`}
                                    </Button>

                                    {/* REPLY EDITOR */}
                                    {replyingTo === item.id && (
                                        <div style={{ width: "100%", marginTop: "10px" }}>
                                            <CustomRichTextEditor
                                                value={replyText}
                                                onChange={setReplyText}
                                                placeholder="Write a reply..."
                                            />
                                            <Button
                                                type="primary"
                                                size="small"
                                                loading={replyLoading}
                                                onClick={() => submitReply(item.id)}
                                                style={{ marginTop: "10px" }}
                                            >
                                                Submit Reply
                                            </Button>
                                        </div>
                                    )}

                                    {/* REPLIES LIST */}
                                    {item.replies?.length > 0 && (
                                        <div style={{ marginLeft: "40px", marginTop: "15px", width: "100%" }}>
                                            {item.replies.map((reply) => (
                                                <div key={reply.id} style={{ marginBottom: "10px" }}>
                                                    <strong>
                                                        {reply.first_name} {reply.last_name}
                                                    </strong>
                                                    <div dangerouslySetInnerHTML={{ __html: reply.description }} />
                                                    <div style={{ fontSize: "10px", color: "#999" }}>
                                                        {formatTime(reply.created_at)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </>
                            }
                        />

                    </List.Item>
                )}
            />
        </div>
    )
}

export default ChapterComment
