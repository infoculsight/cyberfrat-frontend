import React, { useCallback, useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Input,
    Table,
    Pagination,
    Spin,
    Button
} from "antd";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import moment from "moment";
import { LIST_LEARNER_ALL_PACKAGE } from "../../apis/apis";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function LearnerPackages() {
    const { learner_id } = useParams();
    const location = useLocation();
    const Navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [pagination_loader, setPaginationLoader] = useState(false);
    const [table_data, setTableData] = useState([]);
    const [current_page, setCurrentPage] = useState(1);
    const [total_pages, setTotalPages] = useState(0);
    const [total_packages, setTotalCourses] = useState(0);
    const [search_query, setSearchQuery] = useState("");

    // 🔙 Back Button Logic
    const handleBack = () => {
        if (location.state?.from) {
            Navigate(location.state.from);
        } else {
            Navigate(-1);
        }
    };

    useEffect(() => {
        const LIST_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("learner_id", learner_id);
            try {
                const API_CALL = await LIST_LEARNER_ALL_PACKAGE(FORM_DATA);
                if (API_CALL?.data?.status) {
                    setTableData(API_CALL?.data?.data);
                    setCurrentPage(API_CALL?.data?.current_page);
                    setTotalPages(API_CALL?.data?.total_pages);
                    setTotalCourses(API_CALL?.data?.total_packages);
                }
            } catch (err) {
                console.error("Error fetching learner courses:", err);
            } finally {
                setLoader(false);
            }
        };
        LIST_API();
    }, [learner_id]);

    // 🔍 Search
    const fetchResults = useCallback(
        debounce(async (value) => {

            try {
                setSearchQuery(value);
                setPaginationLoader(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append("title", value);
                FORM_DATA.append("learner_id", learner_id);

                const API_CALL = await LIST_LEARNER_ALL_PACKAGE(FORM_DATA);
                if (API_CALL?.data?.status) {
                    setTableData(API_CALL?.data?.data);
                    setCurrentPage(API_CALL?.data?.current_page);
                    setTotalPages(API_CALL?.data?.total_pages);
                    setTotalCourses(API_CALL?.data?.total_packages);
                }
            } catch (err) {
                console.error("Search Error:", err);
            } finally {
                setPaginationLoader(false);
            }
        }, 500),
        []
    );

    const handleInput = (e) => {
        const value = e.target.value;
        fetchResults(value);
    };

    // 🔁 Pagination
    const pagination_on_change = async (page) => {
        setPaginationLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", page);
        FORM_DATA.append("title", search_query);
        FORM_DATA.append("learner_id", learner_id);
        try {
            const API_CALL = await LIST_LEARNER_ALL_PACKAGE(FORM_DATA);
            if (API_CALL?.data?.status) {
                setTableData(API_CALL?.data?.data);
                setCurrentPage(API_CALL?.data?.current_page);
                setTotalPages(API_CALL?.data?.total_pages);
                setTotalCourses(API_CALL?.data?.total_packages);
            }
        } catch (err) {
            console.error("Pagination Error:", err);
        } finally {
            setPaginationLoader(false);
        }
    };

    // 🧾 Table Columns (Action column removed)
    const columns = [
        {
            title: "Assigned On",
            dataIndex: "assigned_on",
            render: (text, record) => (
                <span>{moment(record.assigned_on).format("YYYY-MM-DD")}</span>
            ),
        },
        {
            title: "Package Name",
            dataIndex: "title",
            render: (text, record) => <span>{record.title}</span>,
        },
        {
            title: "Status",
            dataIndex: "package_status",
            render: (text, record) => <span>{record.package_status}</span>,
        },
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (text, record) => (
                <img
                    src={record.thumbnail}
                    alt="Course Thumbnail"
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                    }}
                />
            ),
        },

        {
          title: "Action",
          dataIndex: "Report",
          key: "Report",
          render: (_, record) => (
            <Button type="link" onClick={() => { Navigate(`/package-learner-report/${btoa(record.package_id)}/${btoa(learner_id)}`) }}>
              View Report
            </Button>
          ),
        },

    ];

    return (
        <div className="lms-body">
            <Card>
                <Row>
                    <Col span={24}>
                        <h2>
                            <span style={{ cursor: "pointer" }} onClick={handleBack}>
                                <LeftOutlined />
                            </span>{" "}
                            Learner Packages
                        </h2>
                    </Col>
                </Row>

                <div style={{ padding: 20 }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={24} md={18} lg={20}>
                            <Input
                                addonBefore={<span>Title</span>}
                                onChange={handleInput}
                                placeholder="Search by Title"
                                size="large"
                                style={{ width: "100%" }}
                            />
                        </Col>
                    </Row>

                    {loader ? (
                        <CulsightPageLoader />
                    ) : pagination_loader ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <Spin indicator={<LoadingOutlined spin />} size="large" />
                        </div>
                    ) : (
                        <>
                            <Table
                                columns={columns}
                                pagination={false}
                                dataSource={table_data}
                                style={{ marginTop: "15px" }}
                            />
                            {total_pages > 0 && (
                                <div style={{ float: "right", marginTop: "20px" }}>
                                    <Pagination
                                        onChange={pagination_on_change}
                                        defaultCurrent={current_page}
                                        total={total_packages}
                                        pageSize={10}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default LearnerPackages;
