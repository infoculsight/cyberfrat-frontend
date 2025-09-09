import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Radio,
  message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  LIST_EMAIL,
  LIST_GROUP,
  LIST_LANDING_PAGE,
  LIST_SMTP,
  ADD_CAMPAIGN,
  LIST_LEARNER_GROUP
} from '../../apis/apis';

function AddCampaign() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, set_loading] = useState(false);
  const [smtp_List, set_Smtp_List] = useState([]);


  const [group_type, set_group_type] = useState(0);
  const [user_group_list, set_user_group_list] = useState([]);
  const [email_list, set_email_list] = useState([]);
  const [landing_page, set_landing_page] = useState([]);
  const [name, set_name] = useState("");
  const [smtp_id, set_smtp_id] = useState(null);
  const [user_group_id, set_user_group_id] = useState(null);
  const [email_template_id, set_email_template_id] = useState(null);
  const [landing_page_id, set_landing_page_id] = useState(null);
  const [errors, set_errors] = useState("");



  // API Calls
  const SMTP_LIST_API = async () => {
    const API_CALL = await LIST_SMTP(new FormData());
    if (API_CALL?.data?.status) {
      set_Smtp_List(API_CALL.data.data.map(item => ({
        label: item.smtp_user,
        value: item.id
      })));
    }
  };

  const handleSearchSMTP = async (searchText) => {
    set_loading(true);
    try {
      const formData = new FormData();
      formData.append("smtp_user", searchText); // backend expects "name" in FormData
      const response = await LIST_SMTP(formData);
      if (response?.data?.status) {
        const options = response.data.data.map((item) => ({
          label: item.smtp_user,
          value: item.id,
        }));
        set_Smtp_List(options);
      } else {
        set_Smtp_List([]);
      }
    } catch (error) {
      console.error("Error searching SMTP list:", error);
      set_Smtp_List([]);
    } finally {
      set_loading(false);
    }
  };



  const GROUP_LIST_API = async () => {
    if (group_type === 0) {
      const API_CALL = await LIST_GROUP(new FormData());
      if (API_CALL?.data?.status) {
        set_user_group_list(API_CALL.data.data.map(item => ({
          label: item.name,
          value: item.id
        })));
      }
    } else {
      const API_CALL = await LIST_LEARNER_GROUP(new FormData());
      if (API_CALL?.data?.status) {
        set_user_group_list(API_CALL.data.data.map(item => ({
          label: item.name,
          value: item.id
        })));
      }
    }

  };

  const handleSearchGroupList = async (searchText) => {
    set_loading(true);
    try {
      const formData = new FormData();
      formData.append("name", searchText);

      let response;

      if (group_type === 0) {
        response = await LIST_GROUP(formData);
      } else {
        response = await LIST_LEARNER_GROUP(formData);
      }

      if (response?.data?.status) {
        const options = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        set_user_group_list(options);
      } else {
        set_user_group_list([]);
      }
    } catch (error) {
      console.error("Error searching group list:", error);
      set_user_group_list([]);
    } finally {
      set_loading(false);
    }
  };


  const EMAIL_LIST_API = async () => {
    const API_CALL = await LIST_EMAIL(new FormData());
    if (API_CALL?.data?.status) {
      set_email_list(API_CALL.data.data.map(item => ({
        label: item.name,
        value: item.id
      })));
    }
  };


  const handleSearchEmail = async (searchText) => {
    set_loading(true);
    try {
      const formData = new FormData();
      formData.append("name", searchText); // backend expects "name" in FormData
      const response = await LIST_EMAIL(formData);
      if (response?.data?.status) {
        const options = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        set_email_list(options);
      } else {
        set_email_list([]);
      }
    } catch (error) {
      set_email_list([]);
    } finally {
      set_loading(false);
    }
  };


  const LANDING_PAGE_API = async () => {
    const API_CALL = await LIST_LANDING_PAGE(new FormData());
    if (API_CALL?.data?.status) {
      set_landing_page(API_CALL.data.data.map(item => ({
        label: item.name,
        value: item.id
      })));
    }
  };

  const handleSearchLandingPage = async (searchText) => {
    set_loading(true);
    try {
      const formData = new FormData();
      formData.append("name", searchText);
      const response = await LIST_LANDING_PAGE(formData);
      if (response?.data?.status) {
        const options = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        set_landing_page(options);
      } else {
        set_landing_page([]);
      }
    } catch (error) {

      set_landing_page([]);
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    GROUP_LIST_API();
  }, [group_type]);
  useEffect(() => {
    SMTP_LIST_API();
    EMAIL_LIST_API();
    LANDING_PAGE_API();
  }, []);

  const onFinish = async () => {
    set_loading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("smtp_id", smtp_id);
    formData.append("group_type", group_type);
    formData.append("user_group_id", user_group_id);
    formData.append("email_template_id", email_template_id);
    formData.append("landing_page_id", landing_page_id);
    formData.append("campaign_status", 1);

    try {
      const response = await ADD_CAMPAIGN(formData);
      if (response?.data?.status) {
        message.success("Campaign added successfully");
        navigate("/campaign");
      } else {
        set_loading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };


  return (
    <div className='lms-body'>
      <Card>
        <h2>
          <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => navigate("/campaign")}>
            <LeftOutlined />
          </span>
          Add Campaign
        </h2>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          validateTrigger="onSubmit"
        >
          <Form.Item label="Campaign Name">
            <Input
              type="text"
              placeholder="Enter Campaign Name"
              value={name}
              onChange={(e) => set_name(e.target.value)}
            />  {errors?.name ? (
              <>
                <span style={{ color: "red" }}>{errors?.name}</span>
              </>
            ) : (
              <></>
            )}
          </Form.Item>


          <Form.Item label="Select SMTP">
            <Select
              showSearch
              size="large"
              placeholder="Select SMTP"
              value={smtp_id}
              onChange={(value) => set_smtp_id(value)}
              onSearch={handleSearchSMTP}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
              options={smtp_List}
            />
          </Form.Item>



          <Form.Item label="Group Type">
            <Radio.Group value={group_type}
              onChange={(e) => set_group_type(e.target.value)}>
              <Radio value={0}>local Group</Radio>
              <Radio value={1}>Learner Group</Radio>

            </Radio.Group>
          </Form.Item>

          <Form.Item label={group_type === 0 ? "Select Users Group" : "Select Learners Group"}>
            <Select
              showSearch
              size='large'
              options={user_group_list}
              placeholder="Select Users Group"
              value={user_group_id}
              onChange={(value) => set_user_group_id(value)}
              onSearch={handleSearchGroupList}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
            />
          </Form.Item>

          <Form.Item label="Select Email Template">
            <Select
              showSearch
              size='large'
              options={email_list}
              placeholder="Select Email Template"
              value={email_template_id}
              onChange={(value) => set_email_template_id(value)}
              onSearch={handleSearchEmail}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
            />
          </Form.Item>

          <Form.Item label="Select Landing Page">
            <Select
              showSearch
              size='large'
              options={landing_page}
              placeholder="Select Landing Page"
              value={landing_page_id}
              onChange={(value) => set_landing_page_id(value)}
              onSearch={handleSearchLandingPage}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
            />
          </Form.Item>

          {/* <Form.Item label="Campaign Status">
            <Radio.Group
              value={campaign_status}
              onChange={(e) => set_campaign_status(e.target.value)}
            >
              <Radio value={1}>Active</Radio>
              <Radio value={0}>Inactive</Radio>
            </Radio.Group>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              {loading ? (
                <Spin indicator={<LoadingOutlined spin />} size="small" />
              ) : (
                "Save"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AddCampaign;
