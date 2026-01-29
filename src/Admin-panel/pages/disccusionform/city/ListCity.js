import React, { useCallback, useEffect, useState } from "react";
import {
    App,
    Button,
    Input,
    message,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag
} from "antd";
import AddCity from "./AddCity";
import EditCity from "./EditCity";
import { LIST_CITY, STATUS_CITY } from "../../../apis/apis";
import { useNavigate } from "react-router-dom";
import { formatToIST } from "../../../../helper/CommonHelper";
import { EyeFilled } from "@ant-design/icons";
import CulsightPageLoader from "../../../components/CulsightPageLoader";
import debounce from "lodash.debounce";

const { Option } = Select;

function ListCity() {
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [add_city, set_add_city] = useState(false);
    const [edit_city, set_edit_city] = useState(null);
    const [list_refresh, set_list_refresh] = useState(0);
    const [search_title, set_search_title] = useState("");
    const [loader, setLoader] = useState(false);
    const [page_size, set_page_size] = useState(10);
    const [table_data, set_table_data] = useState([]);
    const [current_page, set_current_page] = useState(1);
    const [total_pages, set_total_pages] = useState(0);
    const [total_count, set_total_count] = useState(0);
    const [onchange_call, set_onchange_call] = useState(true);
    const [pagination_loader, set_pagination_loader] = useState(false)
    const [search_query_value, set_search_query_value] = useState('');



    const selectBefore = (
        <Select defaultValue="title">
            <Option value="title">Title</Option>
        </Select>
    );

    const LIST_API = async () => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("per_page", page_size);

        const API_CALL = await LIST_CITY(FORM_DATA);

        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_count(API_CALL?.data?.total_count);
        }
        setLoader(false);
    };

    useEffect(() => {
        LIST_API();
    }, [list_refresh, page_size, onchange_call]);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Created At",
            key: "created_at",
            render: (_, record) => (
                <span style={{ fontSize: "12px" }}>
                    {formatToIST(record.created_at)}
                </span>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) =>
                record.status ? (
                    <Tag color="success">Active</Tag>
                ) : (
                    <Tag color="error">Inactive</Tag>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => set_edit_city(record.id)}

                    >
                        <EyeFilled />
                    </Button>

                    <Popconfirm
                        title="Do you really want to change the status?"
                        onConfirm={() => change_status(record?.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button color="red" variant="solid" size="small">
                            Change Status
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const change_status = async (id) => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", id);
        try {
            const response = await STATUS_CITY(FORM_DATA);
            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                set_onchange_call(onchange_call ? false : true)
                setLoader(false)

            } else {
                setLoader(false);
            }
        } catch (error) {
            message.error(
                "Server Error: " + (error?.response?.data?.message || "Unknown error")
            );
        }
    };


    const pagination_on_change = async (data, size) => {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("page", data);
        FORM_DATA.append("per_page", size);
        FORM_DATA.append("title", search_query_value);
        const API_CALL = await LIST_CITY(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_count(API_CALL?.data?.total_count);
            set_pagination_loader(false);
        } else {
            set_pagination_loader(false);
        }
    }

    const debouncedFetch = useCallback(
        debounce(async (search_value) => {
            try {
                set_pagination_loader(true);
                const FORM_DATA = new FormData();
                FORM_DATA.append("title", search_value);
                FORM_DATA.append("per_page", page_size);
                FORM_DATA.append("page", 1);

                const API_CALL = await LIST_CITY(FORM_DATA);
                if (API_CALL?.data?.status) {
                    set_table_data(API_CALL.data.data);
                    set_current_page(API_CALL.data.current_page);
                    set_total_pages(API_CALL.data.total_pages);
                    set_total_count(API_CALL.data.total_count);
                }
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                set_pagination_loader(false);
            }
        }, 500),
        [page_size]
    );

    const fetchResults = (search_value) => {
        debouncedFetch(search_value);
    };



    return (
        <div>
            {/* Top Right Button */}
            <div style={{ textAlign: "right" }}>
                {!edit_city && (
                    <Button
                        onClick={() => {
                            if (add_city) {
                                // Going back to list view
                                set_list_refresh(prev => prev + 1); // refresh list
                            }
                            set_add_city(!add_city);
                        }}
                    >
                        {add_city ? "List View" : "Add City"}
                    </Button>
                )}


                {edit_city && (
                    <Button
                        onClick={() => {
                            set_edit_city(null);
                            set_list_refresh(prev => prev + 1); // trigger list refresh
                        }}
                    >
                        List View
                    </Button>
                )}

            </div>

            {/* LIST VIEW */}
            {!add_city && !edit_city && (
                <>
                    <Input
                        addonBefore={selectBefore}
                        placeholder="Search by title"
                        value={search_title}
                        onChange={(e) => {
                            set_search_title(e.target.value);
                            fetchResults(e.target.value); // Call debounced fetch on every change
                        }}
                        style={{
                            margin: "20px 0",
                            maxWidth: "80%",
                            position: "relative",
                            top: "-50px",
                            marginBottom: "-50px",
                        }}
                    />


                    {loader ? <>
                        <CulsightPageLoader />
                    </>
                        : <>
                            <Row style={{ marginTop: "15px" }}>
                                <Table
                                    style={{ width: "100%" }}
                                    columns={columns}
                                    dataSource={table_data}
                                    rowKey="id"
                                    pagination={false}
                                />
                            </Row>
                            {total_pages > 0 ? (
                                <>
                                    <div style={{ float: "right", marginTop: "20px" }}>
                                        {" "}
                                        <Pagination
                                            current={current_page}
                                            total={total_count}
                                            pageSize={page_size}
                                            showSizeChanger
                                            pageSizeOptions={['10', '20', '50', '100']}
                                            onChange={pagination_on_change}
                                            onShowSizeChange={(current, size) => {
                                                set_page_size(size);
                                                pagination_on_change(1, size);
                                            }}
                                            style={{ display: 'inline-block' }}
                                            className="no-search-pagination"
                                        />
                                        <style>
                                            {`
                      .no-search-pagination .ant-select-selection-search-input {
                        display: none !important;
                      }
                    `}
                                        </style>
                                    </div>
                                </>
                            ) : (
                                <>

                                </>
                            )}
                        </>}

                </>
            )}

            {/* ADD CITY */}
            {add_city && (
                <AddCity
                    list_refresh={list_refresh}
                    set_list_refresh={set_list_refresh}
                    set_add_city={set_add_city}
                />
            )}

            {/* EDIT CITY */}
            {edit_city && (
                <EditCity
                    id={edit_city}
                    list_refresh={list_refresh}
                    set_edit_city={set_edit_city}
                    set_list_refresh={set_list_refresh}
                />
            )}


        </div>
    );
}

export default ListCity;
