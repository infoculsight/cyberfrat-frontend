import { App, Button, Card, Col, Input, Modal, Pagination, Row, Spin, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce';
import { EyeFilled, LoadingOutlined } from "@ant-design/icons";
import { CREATE_LEARNER_GROUP, LIST_LEARNER_GROUP } from '../../apis/apis';
import CulsightPageLoader from '../../../Admin-panel/components/CulsightPageLoader';

function LmsLearnersGroup() {

    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [loading, setloading] = useState(true);
    const [pagination_loading, set_pagination_loading] = useState(false);
    const [table_data, set_table_data] = useState(false);
    const [current_page, set_current_page] = useState("");
    const [total_pages, set_total_pages] = useState("");
    const [total_groups, set_total_groups] = useState("");
    const [search_query_name, set_search_query_name] = useState("");
    const [name, set_name] = useState("")
    const [errors, set_errors] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);

    const handleOk = async () => {
        if (!name.trim()) {
            return Modal.error({ title: "Validation Error", content: "Group name is required." });
        }

        try {
            const FORM_DATA = new FormData();
            FORM_DATA.append("name", name);
            const response = await CREATE_LEARNER_GROUP(FORM_DATA);

            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                navigate("/assign-learner/" + btoa(response?.data?.data?.id));
            } else {
                setloading(false);
                set_errors(response?.data?.errors);
            }
        } catch (error) {
            console.error("API Error:", error);

        }
    };

    const handleCancel = () => setIsModalOpen(false);


    const fetchResultsName = useCallback((value) => {
        debounce(async () => {
            try {
                set_search_query_name(value);
                set_pagination_loading(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append("name", value);
                const API_CALL = await LIST_LEARNER_GROUP(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_table_data(API_CALL.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_pages(API_CALL?.data?.total_pages);
                    set_total_groups(API_CALL.data?.total_groups);
                }
                set_pagination_loading(false);
            } catch (err) {
                console.error("API Error:", err);
            }
        }, 500)();
    }, []);

    const handleInput = (e) => {
        const value = e.target.value;
        fetchResultsName(value);
    };


    const LIST_API = async () => {
        const FORM_DATA = new FormData();

        const API_CALL = await LIST_LEARNER_GROUP(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_groups(API_CALL?.data?.total_groups);
            setloading(false);
        } else {
            console.log("error");
            setloading(false);
        }
    };

    useEffect(() => {
        LIST_API();
    }, []);



    const columns = [
        {
            title: "Group Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record.name}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" size="small" onClick={() => navigate("/assign-learner/" + btoa(record.id))}><EyeFilled /></Button>
            ),
        },

    ];


    const pagination_on_change = async (data) => {
        set_pagination_loading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("name", search_query_name);
        const API_CALL = await LIST_LEARNER_GROUP(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_groups(API_CALL?.data?.total_groups);
        }
        set_pagination_loading(false);
    };


    return (
        <div className='lms-body'>


            <Card>
                <h2>Learners Group

                    <Button
                        type="primary"
                        size='large'
                        variant='solid'
                        color='green'
                        style={{ marginLeft: "10px", float: "right" }}
                        onClick={showModal}
                    >
                        Add Group
                    </Button>
                </h2><br></br>

                <Row>
                    <Col span={12}>
                        <Input
                            addonBefore={<span>Name</span>}
                            placeholder="Search by name"
                            onChange={handleInput}
                            size="large"
                        />
                    </Col>

                </Row>

                {loading ? (
                    <>
                        <CulsightPageLoader />
                    </>
                ) : (
                    <>
                        {pagination_loading ? (
                            <>
                                <div style={{ textAlign: "center", padding: "60px" }}>
                                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                                </div>
                            </>
                        ) : (
                            <>
                                <Table
                                    columns={columns}
                                    pagination={false}
                                    dataSource={table_data}
                                    style={{ marginTop: "15px" }}
                                    rowKey="id"
                                />
                            </>
                        )}

                        {total_pages > 0 ? (
                            <>
                                <div style={{ float: "right", marginTop: "20px" }}>
                                    {" "}
                                    <Pagination
                                        onChange={pagination_on_change}
                                        defaultCurrent={current_page}
                                        total={total_groups}
                                        pageSize={10}
                                    />
                                </div>
                            </>
                        ) : (
                            <>

                            </>
                        )}
                    </>
                )}

                <Modal
                    title="Add New Group"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Save"
                >
                    <Input
                        placeholder="Enter your Name"
                        onChange={(e) => set_name(e.target.value)}
                    />
                    {errors?.name ? (
                        <>
                            <span style={{ color: "red" }}>
                                {errors?.name}
                            </span>
                        </>
                    ) : (
                        <></>
                    )}
                </Modal>

            </Card>
        </div>
    )
}

export default LmsLearnersGroup;



