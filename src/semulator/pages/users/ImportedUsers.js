import { Button, Card, Col, Input,  Pagination, Row, Select, Space, Spin, Table, Tag } from "antd";
import { Option } from "antd/es/mentions";
import { EyeFilled, LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IMPORT_TRACKING_LIST, LIST_IMPORT_USER } from "../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../components/CulsightPageLoader";
import { formatToIST } from "../../../helper/CommonHelper";


function ImportedUsers() {
 
    const {tracking_id} = useParams()
  //USE STATE FOR PAGINATION AND LOADER
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [table_data, set_table_data] = useState(false);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_users, set_total_users] = useState("");
 

  // fillter state
  const [search_query_key, set_search_query_key] = useState('name');
  const [search_query_value, set_search_query_value] = useState('');


 



  const fetchResults = useCallback((search_key, search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append(search_key, search_value);
        const API_CALL =  tracking_id ? await LIST_IMPORT_USER(FORM_DATA) : await IMPORT_TRACKING_LIST(FORM_DATA);
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
  }, [tracking_id]);



  useEffect(() => {
  setLoader(true);
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      
      const API_CALL = await IMPORT_TRACKING_LIST(FORM_DATA);
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
      const USERS_LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("import_tracking_id", atob(tracking_id));
      const API_CALL = await LIST_IMPORT_USER(FORM_DATA);
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

    if(tracking_id){
        USERS_LIST_API()
    }else{
 LIST_API();
    }
   
  }, [tracking_id]);


  const selectBefore = (
    <Select defaultValue="Name" onChange={(value) => {
      if (value === 'Name') {
        set_search_query_key('name')
        fetchResults('name', search_query_value)
      }
      if (value === 'Email') {
        set_search_query_key('email')
        fetchResults('email', search_query_value)
      }
      if (value === 'Phone') {
        set_search_query_key('contact_no')
        fetchResults('contact_no', search_query_value)
      }
    }}>
      <Option value="Name">Name</Option>
      <Option value="Email">Email</Option>
      <Option value="Phone">Phone</Option>
    </Select>
  );

  const users_columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: "Phone",
      dataIndex: "contact_no",
      render: (text, record) => <span>{record.contact_no || "No Data"}</span>,
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
          <Button type="primary" size="small" onClick={() => navigate("/edit-user/" + btoa(record.id))}><EyeFilled /></Button>
          {/* <Popconfirm
            title="Are you sure to Change Status this user?"
            onConfirm={() => change_status(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="red" variant="solid" size="small">Change Status</Button>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];


   const columns = [
      {
      title: "Created Date",
      render: (text, record) => (
        <span>
         {formatToIST(record.created_at)}
        </span>
      ),
    },
    {
      title: "Tracking ID",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.import_tracking_id}
        </span>
      ),
    },
  
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => navigate("/imported-users/" + btoa(record.import_tracking_id))}>View Details</Button>
        </Space>
      ),
    },
  ];

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append(search_query_key, search_query_value);
    const API_CALL =  tracking_id ? await LIST_IMPORT_USER(FORM_DATA) : await IMPORT_TRACKING_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_table_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_users(API_CALL?.data?.total_users);
      set_pagination_loader(false);
    } else {
      set_pagination_loader(false);
    }
  }



  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value)
    if (search_query_key === 'name') {
      fetchResults('name', value)
    }
    if (search_query_key === 'email') {
      fetchResults('email', value)
    }
    if (search_query_key === 'contact_no') {
      fetchResults('contact_no', value)
    }
  };


  return (
    <div className="lms-body">

      <Row>
        <Col span={12}>
          <h2>{tracking_id ? <><span  style={{ cursor: "pointer",marginRight:"5px"}}
              onClick={() => navigate("/imported-users")}><LeftOutlined /></span> Imported Users</> : "Imported Tracking List" }</h2>
        </Col>

      </Row>
      <Card>
        {tracking_id &&  <Row>
          <Col span={12}>
            <Input
              addonBefore={selectBefore}
              placeholder="Search by name"
              onChange={handleInput}
              size="large"
            />
          </Col>
        </Row>
}
        {loader ? (
          <>
            <CulsightPageLoader />
          </>
        ) : (
          <>
            {pagination_loader ? (
              <>
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
              </>
            ) : (
              <>
                <Table
                  columns={tracking_id ? users_columns : columns}
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
                    total={total_users}
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
  );
}

export default ImportedUsers;
