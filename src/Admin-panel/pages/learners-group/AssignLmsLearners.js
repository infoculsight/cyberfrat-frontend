import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import { Option } from "antd/es/mentions";
import {
  LeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EDIT_LEARNER_GROUP,
  LEARNER_GROUP_LIST,
  VIEW_LEARNER_GROUP,
} from "../../apis/apis";

import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function AssignLearners() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_learners, set_total_learners] = useState("");
  const [search_query_key, set_search_query_key] = useState("name");
  const [search_query_value, set_search_query_value] = useState("");
  const [group_name, set_group_name] = useState("");
  const [group_id, set_group_id] = useState("");
  const [selected_learners, set_selected_learners] = useState([]);

  useEffect(() => {
    const id = atob(window.location.pathname.split("/").pop());
    set_group_id(id);
  }, []);

  useEffect(() => {
    const VIEW_LEARNER_GROUP_API = async () => {
      try {
        const formData = new FormData();
        formData.append("id", group_id);
        const response = await VIEW_LEARNER_GROUP(formData);
        if (response?.data?.status) {
          set_group_name(response?.data?.data?.name);
          set_selected_learners(response?.data?.data?.learner_ids || []);
        } else {
          message.error("Failed to fetch group details.");
        }
      } catch (error) {
        message.error("Server error while fetching group.");
      }
    };

    if (group_id) {
      VIEW_LEARNER_GROUP_API();
    }
  }, [group_id]);

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("id", group_id);
      formData.append("name", group_name);
      formData.append("learner_list", selected_learners.join(","));
      const response = await EDIT_LEARNER_GROUP(formData);
      if (response?.data?.status) {
        notification.success({
          message: "Success",
          description: response?.data?.message,
        });

        navigate("/learners-group");
      } else {
        message.error(response?.data?.message || "Failed to update group.");
      }
    } catch (error) {
      message.error("Server error while updating group.");
    }
  };

  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append(search_key, search_value);
        const API_CALL = await LEARNER_GROUP_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_table_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_learners(API_CALL?.data?.total_learners);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        set_pagination_loader(false);
      }
    }, 500)();
  }, []);

  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LEARNER_GROUP_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_learners(API_CALL?.data?.total_learners);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);


  const selectBefore = (
    <Select
      defaultValue="Name"
      onChange={(value) => {
        if (value === "Name") {
          set_search_query_key("name");
          fetchResults("name", search_query_value);
        }
        if (value === "Email") {
          set_search_query_key("email");
          fetchResults("email", search_query_value);
        }
        if (value === "Phone") {
          set_search_query_key("contact_no");
          fetchResults("contact_no", search_query_value);
        }
      }}
    >
      <Option value="Name">Name</Option>
      <Option value="Email">Email</Option>
      <Option value="Phone">Phone</Option>
    </Select>
  );

  const columns = [
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selected_learners.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              set_selected_learners([...selected_learners, record.id]);
            } else {
              set_selected_learners(selected_learners.filter((id) => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <span>
          {record.first_name}   {record.last_name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record) => <span>{record.email}</span>,
    },
    {
      title: "Phone",
      dataIndex: "contact_no",
      render: (_, record) => <span>{record.contact_no || "No Data"}</span>,
    }
  ];

  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);

    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await LEARNER_GROUP_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_learners(API_CALL?.data?.total_learners);
    }
    set_pagination_loader(false);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value);
    fetchResults(search_query_key, value);
  };

  return (
    <div className="lms-body">
      <Card>
        <Row>
          <Col span={24}>
            <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/learners-group")}>
              <LeftOutlined /> Go to back
            </h3>
          </Col>
          <Col span={23} style={{ marginTop: "15px" }}>
            <label htmlFor="">Name</label>
            <Input
              placeholder="Enter group name"
              value={group_name}
              onChange={(e) => set_group_name(e.target.value)}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: "15px" }}>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder="Search by name"
              onChange={handleInput}
              size="large"
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
              rowKey="id"
            />

            {total_pages > 0 ? (
              <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                  onChange={pagination_on_change}
                  current={current_page}
                  total={total_learners}
                  pageSize={10}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "red" }}>
                <h2>No Learner Found</h2>
              </div>
            )}
          </>
        )}

        <Button type="primary" onClick={handleOk} style={{ marginTop: "20px" }}>
          Save
        </Button>
      </Card>
    </div>
  );
}

export default AssignLearners;
