import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Spin,
  Table,
  Tag,
  Space,
  Popconfirm,
  App,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChartOutlined, LoadingOutlined } from "@ant-design/icons";
import debounce from 'lodash.debounce';
import { LIST_CAMPAIGN, SOFT_DELETE } from "../../apis/apis";
import CulsightPageLoader from '../../components/CulsightPageLoader';

function Campaign() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_campaigns, set_total_campaigns] = useState("");
  const [search_query_name, set_search_query_name] = useState("");

  // LIST API
  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LIST_CAMPAIGN(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_campaigns(API_CALL?.data?.total_campaigns);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  // SEARCH API
  const fetchResultsName = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_name(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("name", value);
        const API_CALL = await LIST_CAMPAIGN(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_campaigns(API_CALL.data?.total_campaigns);
        }
        set_pagination_loader(false);
      } catch (err) {
        console.error("API Error:", err);
      }
     }, 500)();
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsName(value);
  };

  // DELETE HANDLER
  const handleDelete = async (id) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", id);

    try {
      const response = await SOFT_DELETE(FORM_DATA); 
      if (response?.data?.status) {
        message.success("Campaign deleted successfully");
        LIST_API(); // refresh list
      } else {
        message.error("Failed to delete campaign");
      }
    } catch (error) {
    
      message.error("Something went wrong");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "SMTP",
      dataIndex: "smtp_name",
      render: (text, record) => <span>{record.smtp_name}</span>,
    },
    {
      title: "User Group",
      dataIndex: "group_name",
      render: (text, record) => <span>{record.group_name} ({record.group_type === 1 ? "LMS Group": "Local Group"})</span>,
    },
    {
      title: "Email Template",
      dataIndex: "email_template_name",
      render: (text, record) => <span>{record.email_template_name}</span>,
    },
    {
      title: "User Count",
      dataIndex: "total_users",
      render: (text, record) => <span>{record.total_users}</span>,
    },
    {
      title: "Status",
      dataIndex: "campaign_status",
      render: (campaign_status) =>
        campaign_status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
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
            onClick={() => navigate("/view-campaign/" + btoa(record.id))}
            icon={<BarChartOutlined />}
          />
          <Popconfirm
            title="Are you sure to delete this campaign?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // PAGINATION HANDLER
  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("name", search_query_name);
    const API_CALL = await LIST_CAMPAIGN(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_campaigns(API_CALL?.data?.total_campaigns);
    }
    set_pagination_loader(false);
  };


  return (
    <div className='lms-body'>
      <h2>Campaign</h2>
      <Card>
        <Row gutter={16}>
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
              type='primary'
              style={{ width: '100%' }}
              size='large'
              onClick={() => navigate('/add-campaign')}
            >
              Add Campaign
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
                rowKey="id"
              />
            )}

            {total_pages > 0 && (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  onChange={pagination_on_change}
                  defaultCurrent={current_page}
                  total={total_campaigns}
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

export default Campaign;
