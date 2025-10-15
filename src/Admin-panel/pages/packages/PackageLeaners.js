import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Modal,
  message,
  App,
} from "antd";
import { Option } from "antd/es/mentions";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LIST_PACKAGE_LEARNERS, LEARNER_PACKAGE_STATUS } from "../../apis/apis";
import moment from "moment";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import AssignPackageLearners from "./AssignPackageLearners";

function PackageLeaners(props) {
  
  const { notification } = App.useApp();
  const { package_id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_learners, set_total_learners] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search_paceholder, set_search_paceholder] = useState("Search by name");
  const [search_query_name, set_search_query_name] = useState("");
  const [search_query_email, set_search_query_email] = useState("");
  const [search_query_select, set_search_query_select] = useState("Name");
  const [assignKey, setAssignKey] = useState(0);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);

  const showModal = () => {
    setAssignKey((prev) => prev + 1);
    setIsModalVisible(true);
  };

  const handleModalCancel = async () => {
    setIsModalVisible(false);
    setLoader(true);

    const FORM_DATA = new FormData();
    FORM_DATA.append("package_id", atob(package_id));
    const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_learners(API_CALL?.data?.total_learners);
    }
    setLoader(false);
  };

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(package_id));
      const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_learners(API_CALL?.data?.total_learners);
      } else {
        console.log("error");
      }
      setLoader(false);
    };

    LIST_API();
  }, [package_id]);


  const selectBefore = (
    <Select
      defaultValue="Name"
      onChange={(value) => {
        if (value === "Name") {
          set_search_paceholder("Search by name");
          set_search_query_select(value);
          if (search_query_name !== "") {
            fetchResultsName(search_query_name);
          }
          if (search_query_email !== "") {
            set_search_query_name(search_query_email);
            set_search_query_email("");
            fetchResultsName(search_query_email);
          }
        } else {
          set_search_paceholder("Search by email");
          set_search_query_select(value);
          if (search_query_name !== "") {
            set_search_query_email(search_query_name);
            set_search_query_name("");
            fetchResultsEmail(search_query_name);
          }
          if (search_query_email !== "") {
            fetchResultsEmail(search_query_email);
          }
        }
      }}
    >
      <Option value="Name">Name</Option>
      <Option value="Email">Email</Option>
    </Select>
  );


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: "Joined On",
      key: "joining_on",
      render: (text, record) => (
        <div>
          <div>{moment(record.joining_on).format("YYYY-MM-DD")}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {moment(record.joining_on).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <span>
          {record.status ? (
            <>
              <Tag color="success">Active</Tag>
            </>
          ) : (
            <>
              <Tag color="error">Inactive</Tag>
            </>
          )}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            danger
            type="primary"
            size="small"
            onClick={() => {
              setSelectedLearner(record);
              setStatusModalVisible(true);
            }}
          >
            Change Status
          </Button>
        </Space>
      ),
    },
  ];


  const pagination_on_change = async (page) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("token", localStorage.getItem("token"));
    FORM_DATA.append("name", search_query_name);
    FORM_DATA.append("email", search_query_email);
    FORM_DATA.append("package_id", atob(package_id));
    const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_learners(API_CALL?.data?.total_learners);
    }
    set_pagination_loader(false);
  };


  const fetchResultsName = debounce(async (value) => {
    try {
      set_search_query_name(value);
      set_pagination_loader(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("token", localStorage.getItem("token"));
      FORM_DATA.append("name", value);
      FORM_DATA.append("email", "");
      FORM_DATA.append("package_id", atob(package_id));
      const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      set_pagination_loader(false);
    }
  }, 500);


  const fetchResultsEmail = debounce(async (value) => {
    try {
      set_search_query_email(value);
      set_pagination_loader(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("name", "");
      FORM_DATA.append("email", value);
      FORM_DATA.append("package_id", atob(package_id));
      const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      set_pagination_loader(false);
    }
  }, 500);


  const handleInput = (e) => {
    const value = e.target.value;
    if (search_query_select === "Name") {
      set_search_query_email("");
      fetchResultsName(value);
    } else {
      set_search_query_name("");
      fetchResultsEmail(value);
    }
  };


  return (
    <div className="lms-body">
      <Card>

        <Row>
          <Col span={12}>
            <h2><span    style={{ cursor: "pointer" }}
              onClick={() => navigate("/packages")}><LeftOutlined /></span> Package Learners</h2>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Input
              addonBefore={selectBefore}
              placeholder={search_paceholder}
              onChange={handleInput}
              size="large"
            />
          </Col>

          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Button
              type="primary"
              style={{ width: "100%" }} // Full width on small screens
              size="large"
              onClick={showModal}
            >
              Assign Package
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
            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                onChange={pagination_on_change}
                defaultCurrent={current_page}
                total={total_learners}
                total_pages={total_pages}
              />
            </div>
          </>
        )}
      </Card>
      <Modal
        title="Assign Course to Learners"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <AssignPackageLearners
          key={assignKey}
          onClose={handleModalCancel}
          package_id={package_id}
        />
      </Modal>


      <Modal
        title="Change Learner Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={[
          <Button
            key="unassign"
            danger
            type="primary"
            onClick={async () => {
              const formData = new FormData();
              formData.append("package_id", atob(package_id));
              formData.append("learner_id", selectedLearner?.id);
              try {
                const res = await LEARNER_PACKAGE_STATUS(formData);
                if (res?.data?.status) {
                  notification.success({
                    message: "Successful",
                    description: res.data.message,
                  });
                  setLoader(true);
                  const FORM_DATA = new FormData();
                  FORM_DATA.append("package_id", atob(package_id));
                  const API_CALL = await LIST_PACKAGE_LEARNERS(FORM_DATA);
                  if (API_CALL?.data?.status) {
                    set_table_data(API_CALL?.data?.data);
                    set_current_page(API_CALL?.data?.current_page);
                    set_total_learners(API_CALL?.data?.total_learners);

                    setLoader(false);
                  }
                } else {
                  message.error("Unassign failed.");
                }
              } catch (err) {
                message.error("API error while unassigning.");
              }
              setStatusModalVisible(false);
            }}
          >
            Unassign
          </Button>,
          <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
            Cancel
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to unassign{" "}
          <strong>
            {selectedLearner?.first_name} {selectedLearner?.last_name}
          </strong>{" "}
          from this package?
        </p>
      </Modal>
    </div>
  );
}

export default PackageLeaners;






