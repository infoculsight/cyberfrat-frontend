import {
  App,
  Card,
  Checkbox,
  Col,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import { Option } from "antd/es/mentions";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ASSIGN_LIVE_TEST_LEARNER } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import ConfirmationAssignLiveTest from "./ConfirmationAssignLiveTest"

function AssignLeanersToLiveTest(props) {
  const { notification } = App.useApp();

  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_learners, set_total_learners] = useState("");

  // ⭐ NEW — PER PAGE STATE
  const [page_size, set_page_size] = useState(10);

  const [search_paceholder, set_search_paceholder] = useState("Search by name");
  const [search_query_name, set_search_query_name] = useState("");
  const [search_query_email, set_search_query_email] = useState("");
  const [search_query_select, set_search_query_select] = useState("Name");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [accessDetails, setAccessDetails] = useState({});

  // FIRST LOAD API
  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("live_test_id", atob(props.live_test_id));
      FORM_DATA.append("per_page", page_size); // ⭐ ADD

      const API_CALL = await ASSIGN_LIVE_TEST_LEARNER(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
      setLoader(false);
    };

    fetchData();
  }, []);

  const refreshList = () => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("live_test_id", atob(props.live_test_id));
    FORM_DATA.append("per_page", page_size); // ⭐ ADD

    ASSIGN_LIVE_TEST_LEARNER(FORM_DATA).then((API_CALL) => {
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
      setLoader(false);
    });
  };

  // SEARCH INPUT
  const selectBefore = (
    <Select
      defaultValue="Name"
      onChange={(value) => {
        set_search_query_select(value);
        if (value === "Name") {
          set_search_paceholder("Search by name");
          if (search_query_email !== "") {
            set_search_query_name(search_query_email);
            set_search_query_email("");
            fetchResultsName(search_query_email);
          } else if (search_query_name !== "") {
            fetchResultsName(search_query_name);
          }
        } else {
          set_search_paceholder("Search by email");
          if (search_query_name !== "") {
            set_search_query_email(search_query_name);
            set_search_query_name("");
            fetchResultsEmail(search_query_name);
          } else if (search_query_email !== "") {
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
      title: "Add Learner",
      dataIndex: "checkbox",
      render: (text, record) => (
        <Checkbox onChange={(e) => handleCheckboxChange(e, record)} />
      ),
    },
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
  ];

  const handleCheckboxChange = (e, record) => {
    if (e.target.checked) {
      setSelectedLearner(record);
      setIsModalVisible(true);
    }
  };

  // ⭐ PAGINATION API (WITH PER PAGE)
  const pagination_on_change = async (page, size = page_size) => {
    set_pagination_loader(true);

    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("name", search_query_name);
    FORM_DATA.append("email", search_query_email);
    FORM_DATA.append("live_test_id", atob(props.live_test_id));
    FORM_DATA.append("per_page", size);

    const API_CALL = await ASSIGN_LIVE_TEST_LEARNER(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.learners);
      set_current_page(API_CALL?.data?.current_page);
      set_total_learners(API_CALL?.data?.total_learners);
    }

    set_pagination_loader(false);
  };

  const onShowSizeChange = async (current, size) => {
    set_page_size(size);
    pagination_on_change(1);
  };


  // SEARCH BY NAME
  const fetchResultsName = debounce(async (value) => {
    try {
      set_search_query_name(value);
      set_pagination_loader(true);

      const FORM_DATA = new FormData();
      FORM_DATA.append("name", value);
      FORM_DATA.append("email", "");
      FORM_DATA.append("live_test_id", atob(props.live_test_id));
      FORM_DATA.append("per_page", page_size); // ⭐ ADD

      const API_CALL = await ASSIGN_LIVE_TEST_LEARNER(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
    } finally {
      set_pagination_loader(false);
    }
  }, 500);

  // SEARCH BY EMAIL
  const fetchResultsEmail = debounce(async (value) => {
    try {
      set_search_query_email(value);
      set_pagination_loader(true);

      const FORM_DATA = new FormData();
      FORM_DATA.append("name", "");
      FORM_DATA.append("email", value);
      FORM_DATA.append("live_test_id", atob(props.live_test_id));
      FORM_DATA.append("per_page", page_size); // ⭐ ADD

      const API_CALL = await ASSIGN_LIVE_TEST_LEARNER(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      }
    } finally {
      set_pagination_loader(false);
    }
  }, 500);

  // SEARCH INPUT HANDLER
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
            <h2>Add Learners To Live Test</h2>
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
                rowKey="id"
                style={{ marginTop: "15px" }}
              />
            )}

            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                current={current_page}
                total={total_learners}
                pageSize={page_size}
                showSizeChanger
                pageSizeOptions={["10", "20", "50", "100"]}
                onChange={pagination_on_change}
                onShowSizeChange={(current, size) => {
                  set_page_size(size);
                  pagination_on_change(1, size); // FIXED
                }}
                style={{ display: "inline-block" }}
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
        )}

        <Modal
          title="Confirm Assign"
          open={isModalVisible}
          confirmLoading={confirmLoading}
          onOk={async () => {
            setConfirmLoading(true);
            const FORM_DATA = new FormData();
            FORM_DATA.append("live_test_id", atob(props.live_test_id));
            FORM_DATA.append("learner_id", selectedLearner?.id);
            FORM_DATA.append(
              "access_type",
              accessDetails?.access_type || "LifeTime"
            );

            if (accessDetails?.access_type === "FixedDate") {
              FORM_DATA.append("access_value", accessDetails.expiry_date);
            }

            if (accessDetails?.access_type === "MaxViewingHours") {
              FORM_DATA.append("access_value", accessDetails.max_viewing_hours);
            }

            try {
              const API_CALL = await ASSIGN_LIVE_TEST_LEARNER(FORM_DATA);
              if (API_CALL?.data?.status) {
                notification.success({
                  message: "Learner Assigned",
                  description: `${selectedLearner.first_name} has been assigned successfully.`,
                  placement: "topRight",
                });

                refreshList();
              }
            } catch (error) {
              notification.error({
                message: "API Error",
                description: "Something went wrong while assigning the learner.",
                placement: "topRight",
              });
            }
            setConfirmLoading(false);
            setIsModalVisible(false);
            setSelectedLearner(null);
            setAccessDetails({});
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedLearner(null);
          }}
          okText="Assign"
          cancelText="Cancel"
        >
          <ConfirmationAssignLiveTest
            first_name={selectedLearner?.first_name}
            last_name={selectedLearner?.last_name}
            onAccessDetailsChange={(data) => setAccessDetails(data)}
          />
        </Modal>
      </Card>
    </div>
  );
}

export default AssignLeanersToLiveTest;
