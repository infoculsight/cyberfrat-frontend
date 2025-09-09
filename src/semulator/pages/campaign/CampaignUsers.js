import { Card, Col, Input, Pagination, Row, Select, Spin, Table, Modal, Button, Steps } from "antd";
import { Option } from "antd/es/mentions";
import { LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { LIST_CAMPAIGN_USER } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";

const { Step } = Steps;

function CampaignUsers(props) {
  const { campaign_id } = props;

  // State variables
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_users, set_total_users] = useState("");

  // Search filter state
  const [search_query_key, set_search_query_key] = useState("Email");
  const [search_query_value, set_search_query_value] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showModal = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const fetchResults = useCallback(
    (search_key, search_value) => {
      debounce(async () => {
        try {
          set_pagination_loader(true);
          const FORM_DATA = new FormData();
          FORM_DATA.append("campaign_id", campaign_id);
          FORM_DATA.append(search_key, search_value);
          const API_CALL = await LIST_CAMPAIGN_USER(FORM_DATA);
          if (API_CALL?.data?.status) {
            set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.current_page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_users(API_CALL?.data?.total_users);
          }
        } catch (err) {
          console.error("API Error:", err);
        } finally {
          set_pagination_loader(false);
        }
      }, 500)(); // Call debounce immediately
    },
    [campaign_id]
  );

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("campaign_id", campaign_id);
      const API_CALL = await LIST_CAMPAIGN_USER(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_users(API_CALL?.data?.total_users);
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };

    LIST_API();
  }, [campaign_id]);

  const selectBefore = (
    <Select
      defaultValue="Email"
      onChange={(value) => {
        if (value === "Email") {
          set_search_query_key("email");
          fetchResults("email", search_query_value);
        }
      }}
    >
      <Option value="Email">Email</Option>
    </Select>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => <span>{record.name}</span>,
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
    },
    {
      title: "Status",
      render: (_, record) => (
        <>
          {record?.tracking_data?.tracking_status === 0 && (
            <span style={{ color: "#14e114" }}>Email Sent</span>
          )}
          {record?.tracking_data?.tracking_status === 1 && (
            <span style={{ color: "yellow" }}>Email Opened</span>
          )}
          {record?.tracking_data?.tracking_status === 2 && (
            <span style={{ color: "orange" }}>Clicked Link</span>
          )}
          {record?.tracking_data?.tracking_status === 3 && (
            <span style={{ color: "#f97d7d" }}>Submitted Data</span>
          )}
          {record?.tracking_data?.tracking_status === 200 && (
            <span style={{ color: "#f2ff00" }}>Spam Email</span>
          )}
          {record?.tracking_data?.tracking_status === 522 && (
            <span style={{ color: "#f2ff00" }}>Spam + Copyright</span>
          )}
          {record?.tracking_data?.tracking_status === 523 && (
            <span style={{ color: "#ad3a05ff" }}>Bot Detection</span>
          )}
        </>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Details
        </Button>
      ),
    },
  ];

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("campaign_id", campaign_id);
    FORM_DATA.append("page", data);
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL = await LIST_CAMPAIGN_USER(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_users(API_CALL?.data?.total_users);
    }
    set_pagination_loader(false);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value);
    if (search_query_key === "Email") {
      fetchResults("email", value);
    }
  };

  return (
    <Card>
      <Row>
        <Col span={12}>
          <h2>Campaign User List</h2>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Input
            addonBefore={selectBefore}
            style={{ width: "100%" }}
            placeholder="Search by email"
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
            rowKey={(record) => record.email}
          />

          {total_pages > 0 && (
            <div style={{ float: "right", marginTop: "20px" }}>
              <Pagination
                onChange={pagination_on_change}
                current={current_page}
                total={total_users}
                pageSize={10}
              />
            </div>
          )}
        </>
      )}

      {/* Modal with Steps */}
      <Modal
        title="User Steps"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedUser?.tracking_data?.tracking_status < 200 ? (
          <Steps
            direction="vertical"
            current={Math.min(selectedUser.tracking_data.tracking_status || 0, 3)}
          >
            <Step title="Email Sent" description="User received the email." />
            <Step title="Email Opened" description={selectedUser.tracking_data.tracking_status > 0 && selectedUser.tracking_data.tracking_status < 200 ? <> User opened the email.</> : 'Remain'} />
            <Step title="Clicked Link" description={selectedUser.tracking_data.tracking_status > 1  && selectedUser.tracking_data.tracking_status < 200 ? <>
              {selectedUser?.tracking_data?.clicked_broswer}
            </> : 'Remain'} />
            <Step title="Submitted Data" description={selectedUser.tracking_data.tracking_status > 2  && selectedUser.tracking_data.tracking_status < 200 ? <>

              <h3 style={{ color: "#59f259" }}>Form Data</h3>
              {selectedUser?.tracking_data?.form_submit && Object.entries(selectedUser?.tracking_data?.form_submit).map(([key, value], index) => 
                (<>
                 <div key={index}> <span><b style={{color:"#ff9696", textTransform:"capitalize", fontSize:"12px"}}>{key}</b></span> = <span><b style={{color:"rgb(123 225 209)", textTransform:"capitalize", fontSize:"12px"}}>{value}</b></span><br></br></div>
                </>)
              )}
                <br></br>
              {selectedUser?.tracking_data?.clicked_broswer}
            </> : 'Remain'} />
          </Steps>
        ) : (
          <p>No tracking data available.</p>
        )}
      </Modal>
    </Card>
  );
}

export default CampaignUsers;
