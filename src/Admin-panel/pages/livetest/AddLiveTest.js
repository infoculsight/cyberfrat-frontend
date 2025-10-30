import {
    Col,
    Form,
    Input,
    Row,
    Card,
    message,
    Button,
    Spin,
    DatePicker,
    Radio,
    App,
    TimePicker
} from "antd";
import { useState } from "react";
import { Add_LIVE_TEST } from "../../apis/apis";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function AddLiveTest() {

    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [title, set_title] = useState("");
    const [form] = Form.useForm();
    const [time_limit, set_time_limit] = useState("");
    const [available_from, set_available_from] = useState(null);
    const [available_till, set_available_till] = useState(null);
    const [show_advance_options, set_show_advance_options] = useState("a");
    const [errors, set_errors] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("time_limit", time_limit);
        FORM_DATA.append("title", title);
        if (available_from) {
            FORM_DATA.append(
                "available_from",
                available_from.format("YYYY-MM-DD HH:mm:ss")
            );
        }
        if (available_till) {
            FORM_DATA.append(
                "available_till",
                available_till.format("YYYY-MM-DD HH:mm:ss")
            );
        }

        FORM_DATA.append("show_advance_options", show_advance_options);

        try {
            const response = await Add_LIVE_TEST(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response.data.message,
                });
                setLoading(false);
                navigate("/live-test")
            } else {
                setLoading(false);
                set_errors(response.data.errors);
            }
        } catch (error) {
            message.error(
                "Server Error: " + (error?.response?.data?.message || "Unknown error")
            );
            setLoading(false);
        }
    };

    return (
        <div className="lms-body">
            <Card>
                {loading ? (
                    <CulsightPageLoader />
                ) : (
                    <>
                        <h2> <span style={{ cursor: "pointer" }}
                            onClick={() => navigate("/live-test")}><LeftOutlined /></span>Live Test Details</h2>
                        <Row>
                            <Col span={24}>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    autoComplete="off"
                                    validateTrigger="onSubmit"
                                    className="live-test-form"
                                >
                                    <Form.Item label="Title">
                                        <Input
                                            value={title}
                                            onChange={(e) => set_title(e.target.value)}
                                        />
                                        {errors?.title && (
                                            <span style={{ color: "red" }}>{errors?.title}</span>
                                        )}
                                    </Form.Item>

                                    <Form.Item label="Select Exam Pattern">
                                        <Radio.Group
                                            value={show_advance_options}
                                            onChange={(e) => set_show_advance_options(e.target.value)}
                                            style={{ width: "100%" }}
                                        >
                                            <Row gutter={[16, 16]}>
                                                {[
                                                    {
                                                        key: "a",
                                                        title: "Neet UG Pattern 2025 - Single Subject",
                                                        details: [
                                                            "Maximum Marks: 180",
                                                            "+4 for correct, -1 for incorrect",
                                                            "No marks for unanswered",
                                                            "4 predefined sections",
                                                        ],
                                                    },
                                                    {
                                                        key: "b",
                                                        title: "CAT Pattern 2023",
                                                        details: [
                                                            "Maximum Marks: 198",
                                                            "Time limit: 120 mins",
                                                            "3 predefined sections",
                                                        ],
                                                    },
                                                    {
                                                        key: "c",
                                                        title: "Neet UG Pattern 2025",
                                                        details: [
                                                            "Maximum Marks: 721",
                                                            "Time limit: 180 mins",
                                                            "+4 / -1 for incorrect",
                                                            "4 predefined sections",
                                                        ],
                                                    },
                                                    {
                                                        key: "d",
                                                        title: "JEE MAINS Pattern 2025",
                                                        details: [
                                                            "Maximum Marks: 300",
                                                            "Time limit: 180 mins",
                                                            "+4 / -1 for incorrect",
                                                            "6 predefined sections",
                                                        ],
                                                    },
                                                ].map((pattern) => (
                                                    <Col xs={24} sm={12} md={12} lg={12} key={pattern.key}>
                                                        <Card
                                                            bordered
                                                            hoverable
                                                            style={{
                                                                backgroundColor:
                                                                    show_advance_options === pattern.key
                                                                        ? "#e6f7ff"
                                                                        : "#141414",
                                                                borderColor:
                                                                    show_advance_options === pattern.key
                                                                        ? "#e6f7ff"
                                                                        : "#141414",
                                                            }}
                                                            onClick={() => set_show_advance_options(pattern.key)}
                                                        >
                                                            <Radio
                                                                value={pattern.key}
                                                                style={{ display: "none" }}
                                                            />
                                                            <strong>{pattern.title}</strong>
                                                            {pattern.details.map((line, idx) => (
                                                                <p key={idx}>{line}</p>
                                                            ))}
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Radio.Group>
                                        {errors?.show_advance_options && (
                                            <span style={{ color: "red" }}>
                                                {errors?.show_advance_options}
                                            </span>
                                        )}
                                    </Form.Item>

                                    <Form.Item label="Time Limit">
                                        <TimePicker
                                            style={{ width: "100%" }}
                                            format="HH:mm"
                                            value={time_limit ? dayjs().startOf("day").add(time_limit, "minute") : null}
                                            onChange={(time) => {
                                                if (time) {
                                                    set_time_limit(time.diff(dayjs().startOf("day"), "minute"));
                                                } else {
                                                    set_time_limit("");
                                                }
                                            }}
                                        />
                                        {errors?.time_limit && (
                                            <span style={{ color: "red" }}>{errors?.time_limit}</span>
                                        )}
                                    </Form.Item>

                                    <h2>Test Open Window</h2>
                                    <Form.Item label="Available From">
                                        <DatePicker
                                            showTime
                                            value={available_from}
                                            onChange={(value) => set_available_from(value)}
                                        />
                                        {errors?.available_from && (
                                            <span style={{ color: "red" }}>{errors?.available_from}</span>
                                        )}
                                    </Form.Item>

                                    <Form.Item label="Available Till">
                                        <DatePicker
                                            showTime
                                            value={available_till}
                                            onChange={(value) => set_available_till(value)}
                                        />
                                        {errors?.available_till && (
                                            <span style={{ color: "red" }}>{errors?.available_till}</span>
                                        )}
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            style={{ float: "right" }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    Saving...{" "}
                                                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                                                </>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </Form.Item>
                                </Form>

                            </Col>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
}

export default AddLiveTest;
