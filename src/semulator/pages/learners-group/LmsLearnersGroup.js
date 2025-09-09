import {  Card, Col, Input, Pagination, Row, Spin, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import {  LoadingOutlined } from "@ant-design/icons";
import {  LIST_LEARNER_GROUP } from '../../apis/apis';
import CulsightPageLoader from '../../../Admin-panel/components/CulsightPageLoader';

function LmsLearnersGroup() {
    const [loading, setloading] = useState(true);
    const [pagination_loading, set_pagination_loading] = useState(false);
    const [table_data, set_table_data] = useState(false);
    const [current_page, set_current_page] = useState("");
    const [total_pages, set_total_pages] = useState("");
    const [total_groups, set_total_groups] = useState("");
    const [search_query_name, set_search_query_name] = useState("");
  







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
            title: "Learner Count",
            render: (text, record) => (
                <span>
                    {record.learner_count}
                </span>
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
          
                <h2>Learners Group</h2>
  <Card>
                <Row>
                    <Col span={20}>
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

            

            </Card>
        </div>
    )
}

export default LmsLearnersGroup;



