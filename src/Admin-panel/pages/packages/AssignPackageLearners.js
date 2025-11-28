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
import { ASSIGN_PACKAGE } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function AssignPackageLearners(props) {
  const { notification } = App.useApp();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_learners, set_total_learners] = useState("");

  const [page_size, set_page_size] = useState(10); 

  const [search_paceholder, set_search_paceholder] = useState("Search by name");
  const [search_query_name, set_search_query_name] = useState("");
  const [search_query_email, set_search_query_email] = useState("");
  const [search_query_select, set_search_query_select] = useState("Name");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("package_id", atob(props.package_id));
      FORM_DATA.append("per_page", page_size); 

      const API_CALL = await ASSIGN_PACKAGE(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
        set_current_page(API_CALL?.data?.current_page);
        set_total_learners(API_CALL?.data?.total_learners);
      } else {
        console.log("error");
      }
      setLoader(false);
    };

    fetchData();
  }, [props.package_id, page_size]);  

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

  const handleCheckboxChange = async (e, record) => {
    if (e.target.checked) {
      setSelectedLearner(record);
      setIsModalVisible(true);
    }
  };

  // ✅ UPDATED pagination with page_size
  const pagination_on_change = async (page, size = page_size) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("per_page", size);   // FIXED
    FORM_DATA.append("name", search_query_name);
    FORM_DATA.append("email", search_query_email);
    FORM_DATA.append("package_id", atob(props.package_id));

    const API_CALL = await ASSIGN_PACKAGE(FORM_DATA);

    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.learners);
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
      FORM_DATA.append("name", value);
      FORM_DATA.append("per_page", page_size);  
      FORM_DATA.append("package_id", atob(props.package_id));
      const API_CALL = await ASSIGN_PACKAGE(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
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
      FORM_DATA.append("per_page", page_size);   // ✅ Added
      FORM_DATA.append("package_id", atob(props.package_id));
      const API_CALL = await ASSIGN_PACKAGE(FORM_DATA);

      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.learners);
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
            <h2>Add Learners To Package</h2>
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
                onChange={pagination_on_change}
                showSizeChanger                      
                pageSizeOptions={["10", "20", "50", "100"]} 
                onShowSizeChange={(current, size) => {
                  set_page_size(size);
                  pagination_on_change(1, size);      
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
          title="Confirm Assignment"
          open={isModalVisible}
          onOk={async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append("package_id", atob(props.package_id));
            FORM_DATA.append("learner_id", selectedLearner?.id);

            try {
              const API_CALL = await ASSIGN_PACKAGE(FORM_DATA);
              if (API_CALL?.data?.status) {
                notification.success({
                  message: "Learner Assigned",
                  description: `${selectedLearner.first_name} has been assigned successfully.`,
                  placement: "topRight",
                });
              } else {
                notification.error({
                  message: "Assignment Failed",
                  description: `Could not assign ${selectedLearner.first_name}.`,
                  placement: "topRight",
                });
              }
            } catch (error) {
              notification.error({
                message: "API Error",
                description:
                  "Something went wrong while assigning the learner.",
                placement: "topRight",
              });
            }
            setIsModalVisible(false);
            setSelectedLearner(null);
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedLearner(null);
          }}
          okText="Assign"
          cancelText="Cancel"
        >
          <p>
            Do you really want to assign{" "}
            <strong>
              {selectedLearner?.first_name} {selectedLearner?.last_name}
            </strong>{" "}
            to this package?
          </p>
        </Modal>
        
      </Card>
    </div>
  );
}

export default AssignPackageLearners;
