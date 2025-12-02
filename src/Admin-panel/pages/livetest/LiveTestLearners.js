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
  Modal,
  message,
  App,
} from "antd";
import { Option } from "antd/es/mentions";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LIST_LIVE_TEST_LEARNERS, LIST_LIVE_TEST_LEARNERS_STATUS } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import BulkInrollLearnersToLiveTest from "./BulkInrollLearnersToLiveTest";
import AssignLeanersToLiveTest from "./AssignLeanersToLiveTest";

function LiveTestLearners(props) {
  const { notification } = App.useApp();
  const Navigate = useNavigate();
  const location = useLocation();
  const { live_test_id } = useParams(); // Encoded ID from URL
  const { title } = location.state || {};


  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_learners, set_total_learners] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [search_paceholder, set_search_paceholder] = useState("Search by name");
  const [search_query_name, set_search_query_name] = useState("");
  const [search_query_email, set_search_query_email] = useState("");
  const [search_query_select, set_search_query_select] = useState("Name");
  const [assignKey, setAssignKey] = useState(0);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [page_size, set_page_size] = useState(10);


  const handleBack = () => {
    if (location.state?.from) {
      Navigate(location.state.from); // go back to where user came from
    } else {
      Navigate(-1); // fallback if no state
    }
  };



  const showModal = () => {
    setAssignKey((prev) => prev + 1);
    setIsModalVisible(true);
  };


  const CancelEnrollModal = () => setisModalOpen(false);


  const handleModalCancel = async () => {
    setIsModalVisible(false);
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("live_test_id", atob(live_test_id));
     FORM_DATA.append("page_size", page_size);
    const API_CALL = await LIST_LIVE_TEST_LEARNERS(FORM_DATA);
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
      FORM_DATA.append("live_test_id", atob(live_test_id));
      FORM_DATA.append("page_size", page_size);
      const API_CALL = await LIST_LIVE_TEST_LEARNERS(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_learners(API_CALL?.data?.total_learners);
      }
      setLoader(false);
    };
    LIST_API();
  }, [live_test_id,page_size]);


  const selectBefore = (
    <Select
      defaultValue="Name"
      onChange={(value) => {
        if (value === "Name") {
          set_search_paceholder("Search by name");
          set_search_query_select(value);
          if (search_query_name !== "") fetchResultsName(search_query_name);
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
          if (search_query_email !== "") fetchResultsEmail(search_query_email);
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
  
    // {
    //   title: "Course Status",
    //   key: "status",
    //   render: (text, record) => (
    //     <span>
    //     {record.course_status}
    //     </span>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            variant="solid"
            color="danger"
            size="small"
            onClick={() => {
              setSelectedLearner(record);
              setStatusModalVisible(true);
            }}
          >
           Unassign
          </Button>
        </Space>
      ),
    },
 
  ];


  const pagination_on_change = async (page,size = page_size) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("name", search_query_name);
    FORM_DATA.append("email", search_query_email);
    FORM_DATA.append("page_size", size);
    FORM_DATA.append("live_test_id", atob(live_test_id));
    const API_CALL = await LIST_LIVE_TEST_LEARNERS(FORM_DATA);
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
      FORM_DATA.append("name", value);
      FORM_DATA.append("email", "");
      FORM_DATA.append("page_size", page_size);
      FORM_DATA.append("live_test_id", atob(live_test_id));
      const API_CALL = await LIST_LIVE_TEST_LEARNERS(FORM_DATA);
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
      FORM_DATA.append("page_size", page_size);
      FORM_DATA.append("live_test_id", atob(live_test_id));
      const API_CALL = await LIST_LIVE_TEST_LEARNERS(FORM_DATA);
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
              <h2><span  style={{ cursor: "pointer" }}
              onClick={handleBack}><LeftOutlined /></span> {title} - Learners</h2>
            </Col>
           
          </Row>



        <Row gutter={[16, 16]}>
          {/* Search Input */}
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder={search_paceholder}
              onChange={handleInput}
              size="large"
            />
          </Col>

          {/* Bulk Enroll Button */}
          {/* <Col xs={24} sm={12} md={4} lg={4}>
            <Button
              type="primary"
              size="large"
              icon={<ArrowUpOutlined />}
              style={{ width: "100%" }}
              onClick={showEnrollModal}
            >
              Bulk Enroll
            </Button>
          </Col> */}

          {/* Assign Learners Button */}
          <Col span={12}>
            <Button
              type="primary"
              size="large"
              style={{float:"right" }}
              onClick={showModal}
            >
              Assign Learners
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

            {total_pages > 0 ? <>
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
            </> : <>
              <div style={{ textAlign: "center", color: "red" }}>
                <h2>No Learners Found</h2>
              </div>
            </>}



          </>
        )}
      </Card>

      <Modal
        title="Assign Live Test to Learners"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <AssignLeanersToLiveTest
          key={assignKey}
          onClose={handleModalCancel}
          live_test_id={live_test_id}
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
              formData.append("live_test_id", atob(live_test_id));
              formData.append("learner_id", selectedLearner?.id);
              try {
                const res = await LIST_LIVE_TEST_LEARNERS_STATUS(formData);
                if (res?.data?.status) {
                  notification.success({
                    message: "Successful",
                    description: res?.data?.message,
                  });
                  handleModalCancel();
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
          <strong>{selectedLearner?.first_name} {selectedLearner?.last_name}</strong> from this live test?
        </p>
      </Modal>

      <Modal
        title="Bulk Enroll Learners"
        open={isModalOpen}
        onCancel={CancelEnrollModal}
        footer={null}
        width={800}
      >
        <BulkInrollLearnersToLiveTest live_test_id={live_test_id}/>
      </Modal>

    </div>
  );
}

export default LiveTestLearners;
