import { Button, Card, Col, Input, Pagination, Row, Spin, Table, App } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { EyeFilled, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom'
import { LIST_EMAIL, DELETE_EMAIL } from '../../apis/apis';
import debounce from 'lodash.debounce';
import CulsightPageLoader from '../../components/CulsightPageLoader';

function EmailList() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_email_template, set_total_email_template] = useState("");
  const [search_query_name, set_search_query_name] = useState("");

  // LIST API
  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LIST_EMAIL(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_email_template(API_CALL?.data?.total_email_template);
      setLoader(false);
    } else {

      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  // SEARCH API with debounce
  const fetchResultsName = useCallback(debounce(async (value) => {
    try {
      set_search_query_name(value);
      set_pagination_loader(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("name", value);
      const API_CALL = await LIST_EMAIL(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_email_template(API_CALL.data?.total_email_template);
      }
      set_pagination_loader(false);
    } catch (err) {
      console.error("API Error:", err);
    }
  }, 500), []);

  // SEARCH INPUT
  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsName(value);
  };

  // PAGINATION
  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("name", search_query_name);
    const API_CALL = await LIST_EMAIL(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_email_template(API_CALL?.data?.total_email_template);
    }
    set_pagination_loader(false);
  };

  // DELETE WITH CONFIRMATION
  const handleDelete = (id) => {
    modal.confirm({
      title: "Are you sure you want to delete this email template?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", id);
        try {
          const response = await DELETE_EMAIL(FORM_DATA);
          if (response?.data?.status) {
            message.success("Email template deleted successfully");
            LIST_API();
          } else {
            message.error("Failed to delete template");
          }
        } catch (err) {
          console.error("Delete error:", err);
          message.error("Something went wrong");
        }
      }
    });
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (text, record) => <span>{record.subject}</span>,
    },
     {
      title: "User Count",
      render: (text, record) => <span>{record.email_template_count}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate("/edit-email/" + btoa(record.id))}
            icon={<EyeFilled />}
          />
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='lms-body'>
      <Row>
        <Col span={12}>
          <h2>Email Templates</h2>
        </Col>
      </Row>

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
          <Col span={4}>
            <Button
              size='large'
              type='primary'
              style={{ marginLeft: "10px", width: "100%" }}
              onClick={() => navigate("/add-email")}
            >
              Add Email
            </Button>
          </Col>
        </Row>

        {loader ? (
          <CulsightPageLoader />
        ) : (
          <>
            {pagination_loader ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              </div>
            ) : (
              <Table
                columns={columns}
                pagination={false}
                dataSource={table_data}
                style={{ marginTop: "15px" }}
              />
            )}

            {total_pages > 0 && (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  onChange={pagination_on_change}
                  current={current_page}
                  total={total_email_template}
                  pageSize={10}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default EmailList;
