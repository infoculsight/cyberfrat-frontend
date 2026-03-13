import {
    Button,
    Card,
    Form,
    message,
    App,
    InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { LMS_SETTING } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function LmsSetting() {
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    //  Max Minutes + CPE Combined State
    const [maxData, setMaxData] = useState({
        max_minutes: "",
        value: "",
    });

    const [indexes, setIndexes] = useState([
        { min_minutes: "", max_minutes: "", value: "" },
        { min_minutes: "", max_minutes: "", value: "" },
        { min_minutes: "", max_minutes: "", value: "" },
        { min_minutes: "", max_minutes: "", value: "" },
    ]);

    // Add Index
    const addIndex = () => {
        setIndexes([
            ...indexes,
            { min_minutes: "", max_minutes: "", value: "" },
        ]);
    };

    // Remove Index
    const removeIndex = (index) => {
        const updated = indexes.filter((_, i) => i !== index);
        setIndexes(updated);
    };

    // Handle Change
    const handleChange = (i, key, value) => {
        const updated = [...indexes];
        updated[i][key] = value;
        setIndexes(updated);
    };

    // Submit
const onFinish = async () => {
    setLoading(true);

    const FORM_DATA = new FormData();

    // per_hour directly append karo
    FORM_DATA.append("per_hour", JSON.stringify({
        max_minutes: maxData.max_minutes,
        value: maxData.value   
    }));

    // indexes directly append karo
    indexes.forEach((item, i) => {
        FORM_DATA.append(
            `index_${i + 1}`,
            JSON.stringify({
                min_minutes: item.min_minutes,
                max_minutes: item.max_minutes,
                value: item.value
            })
        );
    });

    try {
        const response = await LMS_SETTING(FORM_DATA);

        if (response?.data?.status) {
            notification.success({
                message: "Successful",
                description: response?.data?.message,
            });

            navigate("/lms-setting");
        } else {
            message.error(
                response?.data?.message || "Something went wrong"
            );
        }
    } catch (error) {
        message.error(
            "Server Error: " +
            (error?.response?.data?.message || "Unknown error")
        );
    }

    setLoading(false);
};

    // Load Existing Data
    useEffect(() => {
        const viewApi = async () => {
            setLoading(true);
            const FORM_DATA = new FormData();

            try {
                const response = await LMS_SETTING(FORM_DATA);

                if (response?.data?.status) {
                    const meta =
                        response?.data?.data?.meta|| {};
                    let loadedIndexes = [];

                    Object.keys(meta).forEach((key) => {
                        if (key.startsWith("index_")) {
                            const parsed =
                                typeof meta[key] === "string"
                                    ? JSON.parse(meta[key])
                                    : meta[key];

                            loadedIndexes.push(parsed);
                        }
                    });

                    // Load max_minutes JSON
                    if (meta?.per_hour) {
                        const parsedMax =
                            typeof meta.per_hour ===
                                "string"
                                ? JSON.parse(meta.per_hour)
                                : meta.per_hour;

                        setMaxData(parsedMax);
                    }

                    if (loadedIndexes.length > 0) {
                        setIndexes(loadedIndexes);
                    }
                }
            } catch (error) {
                message.error(
                    "Server Error: " +
                    (error?.response?.data?.message ||
                        "Unknown error")
                );
            }

            setLoading(false);
        };

        viewApi();
    }, []);

    return (
        <div className="lms-body">
            <Card>
                <h2>App Setting</h2>

                {loading ? (
                    <CulsightPageLoader />
                ) : (
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                    >
                        {/* Max Minutes */}
                        <Card
                            title="Max Minutes Setting"
                            style={{ marginBottom: 16 }}
                        >
                            <InputNumber
                                style={{
                                    width: "100%",
                                    marginBottom: 8,
                                }}
                                placeholder="Enter Max Minutes"
                                min={1}
                                value={maxData.max_minutes}
                                onChange={(value) =>
                                    setMaxData({
                                        ...maxData,
                                        max_minutes: value,
                                    })
                                }
                            />

                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Enter CPE"
                                min={0}
                                value={maxData.value}
                                onChange={(value) =>
                                    setMaxData({
                                        ...maxData,
                                        value: value,
                                    })
                                }
                            />
                        </Card>

                        {/* Dynamic Indexes */}
                        {indexes.map((item, i) => (
                            <Card
                                key={i}
                                style={{ marginBottom: 16 }}
                                title={`Index ${i + 1}`}
                                extra={
                                    i >= 4 && (
                                        <Button
                                            danger
                                            size="small"
                                            onClick={() =>
                                                removeIndex(i)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    )
                                }
                            >
                                <InputNumber
                                    style={{
                                        width: "100%",
                                        marginBottom: 8,
                                    }}
                                    placeholder="Min Minutes"
                                    value={item.min_minutes}
                                    min={0}
                                    onChange={(value) =>
                                        handleChange(
                                            i,
                                            "min_minutes",
                                            value
                                        )
                                    }
                                />

                                <InputNumber
                                    style={{
                                        width: "100%",
                                        marginBottom: 8,
                                    }}
                                    placeholder="Max Minutes"
                                    value={item.max_minutes}
                                    min={0}
                                    onChange={(value) =>
                                        handleChange(
                                            i,
                                            "max_minutes",
                                            value
                                        )
                                    }
                                />

                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="CPE Value"
                                    value={item.value}
                                    min={0}
                                    onChange={(value) =>
                                        handleChange(
                                            i,
                                            "value",
                                            value
                                        )
                                    }
                                />
                            </Card>
                        ))}

                        {/* Add Index */}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={addIndex}
                                block
                            >
                                + Add Index
                            </Button>
                        </Form.Item>

                        {/* Save Button */}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ float: "right" }}
                                loading={loading}
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
}