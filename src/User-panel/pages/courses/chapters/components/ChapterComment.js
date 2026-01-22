import { Card, Col, Row, Button, List, App, Avatar } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
    ADD_COMMENT,
    LIST_COMMENT,
    COMMENT_REPLY
} from "../../../../apis/apis";
import CustomRichTextEditor from "../../../../components/CustomTextEditor";

function ChapterComment(props) {
    const { message, notification } = App.useApp();

    const [description, set_description] = useState("");
    const [comments, set_comments] = useState([]);
    const [current_page, set_current_page] = useState(1);
    const [card_loader, set_card_loader] = useState(true);

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    const [openReplies, setOpenReplies] = useState(null); // 🔥 NEW

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

        return createdTimeUTC.toLocaleString("en-IN", {
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
            const res = await LIST_COMMENT(FORM_DATA);
            if (res?.data?.status) {
                set_comments(res.data.comments || []);
                set_current_page(res.data.page || 1);
            } else {
                set_comments([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            set_card_loader(false);
        }
    }, [props.chapter_id]);

    useEffect(() => {
        if (props.chapter_id) fetchCommentList(1);
    }, [props.chapter_id, fetchCommentList]);

    const onFinish = async () => {
        if (!description.trim()) {
            message.warning("Please write a comment first.");
            return;
        }

        const FORM_DATA = new FormData();
        FORM_DATA.append("view_id", props.chapter_id);
        FORM_DATA.append("description", description);
        FORM_DATA.append("comment_type", "chapter");

        try {
            const res = await ADD_COMMENT(FORM_DATA);
            if (res?.data?.status) {
                notification.success({ message: res.data.message });
                set_description("");
                fetchCommentList(1);
            } else {
                message.error("Failed to add comment");
            }
        } catch {
            message.error("Server error");
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
                notification.success({ message: res.data.message });
                setReplyText("");
                setReplyingTo(null);
                setOpenReplies(comment_id); // auto-open replies
                fetchCommentList(current_page);
            } else {
                message.error("Failed to add reply");
            }
        } catch {
            message.error("Server error");
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div style={{ marginTop: 30 }}>
            <CustomRichTextEditor
                editorLabel="Chapter Discussions"
                value={description}
                onChange={set_description}
                placeholder="Write something..."
            />

            <Button type="primary" onClick={onFinish} style={{ marginBottom: 20 }}>
                Add Comment
            </Button>

            <List
                dataSource={comments}
                locale={{ emptyText: "No discussions yet." }}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{item.first_name?.[0]}</Avatar>}
                            title={`${item.first_name} ${item.last_name}`}
                            description={
                                <>
                                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                    <div style={{ fontSize: 10, color: "#999" }}>
                                        {formatTime(item.created_at)}
                                    </div>

                                    {/* Reply Button */}
                                    <Button
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        onClick={() =>
                                            setReplyingTo(replyingTo === item.id ? null : item.id)
                                        }
                                    >
                                        Reply
                                    </Button>

                                    {/* View Replies Button */}
                                    {item.replies?.length > 0 && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() =>
                                                setOpenReplies(openReplies === item.id ? null : item.id)
                                            }
                                        >
                                            {openReplies === item.id
                                                ? "Hide Replies"
                                                : `View Replies (${item.replies.length})`}
                                        </Button>
                                    )}

                                    {/* Reply Editor */}
                                    {replyingTo === item.id && (
                                        <div style={{ marginTop: 10 }}>
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
                                                style={{ marginTop: 8 }}
                                            >
                                                Submit Reply
                                            </Button>
                                        </div>
                                    )}

                                    {/* Replies List */}
                                    {openReplies === item.id && (
                                        <div
                                            style={{
                                                marginLeft: 40,
                                                marginTop: 10,
                                                borderLeft: "2px solid #eee",
                                                paddingLeft: 10,
                                            }}
                                        >
                                            {item.replies.map((reply) => (
                                                <div key={reply.id} style={{ marginBottom: 12 }}>
                                                    <strong>
                                                        {reply.first_name} {reply.last_name}
                                                    </strong>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: reply.description,
                                                        }}
                                                    />
                                                    <div style={{ fontSize: 10, color: "#999" }}>
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
    );
}

export default ChapterComment;
