// import { Button, Card, Col, Input, Pagination, Row, Select, Space, Spin, Table, Tag, } from "antd";
// import { Option } from "antd/es/mentions";
// import { LoadingOutlined, } from "@ant-design/icons";
// import React, { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LEARNER_LIST } from "../../apis/apis";
// import moment from "moment";
// import debounce from "lodash.debounce";
// import CulsightPageLoader from "../../components/CulsightPageLoader";


// function Learners(props) {

//   //USE STATE FOR PAGINATION AND LOADER
//   const navigate = useNavigate();
//   const [loader, setLoader] = useState(true);
//   const [pagination_loader, set_pagination_loader] = useState(false);
//   const [table_data, set_table_data] = useState(false);
//   const [current_page, set_current_page] = useState('');
//   const [total_pages, set_total_pages] = useState('');
//   const [total_learners, set_total_learners] = useState('');

//   //console.log(total_pages); // prevent unused variable warning


//   // fillter state

//   const [search_paceholder, set_search_paceholder] = useState('Search by name');
//   const [search_query_name, set_search_query_name] = useState('');
//   const [search_query_email, set_search_query_email] = useState('');
//   const [search_query_select, set_search_query_select] = useState('Name');

  
  
//   const LIST_API = async () => {
//     const FORM_DATA = new FormData();
//     //FORM_DATA.append("token", localStorage.getItem("token"));
//     const API_CALL = await LEARNER_LIST(FORM_DATA);
//     if (API_CALL?.data?.status) {
//       set_table_data(API_CALL?.data?.data);
//       set_current_page(API_CALL?.data?.current_page);
//       set_total_pages(API_CALL?.data?.total_pages);
//       set_total_learners(API_CALL?.data?.total_learners);
//       setLoader(false);
//     } else {
//       console.log("error");
//       setLoader(false);
//     }
//   };

//   useEffect(() => {
//     LIST_API();
//   }, []);


//   const selectBefore = (
//     <Select defaultValue="Name" onChange={(value) => {
//       if (value === 'Name') {
//         set_search_paceholder('Search by name')
//         set_search_query_select(value)
//         if (search_query_name !== '') {
//           fetchResultsName(search_query_name);
//         }
//         if (search_query_email !== '') {
//           set_search_query_name(search_query_email)
//           set_search_query_email('')
//           fetchResultsName(search_query_email);
//         }
//       } else {
//         set_search_paceholder('Search by email')
//         set_search_query_select(value)
//         if (search_query_name !== '') {
//           set_search_query_email(search_query_name)
//           set_search_query_name('')
//           fetchResultsEmail(search_query_name);
//         }
//         if (search_query_email !== '') {
//           fetchResultsEmail(search_query_email);
//         }
//       }

//     }}>
//       <Option value="Name">Name</Option>
//       <Option value="Email">Email</Option>
//     </Select>
//   );

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       render: (text, record) => (
//         <span>
//           {record.first_name} {record.last_name}
//         </span>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       render: (text, record) => <span>{record.email}</span>,
//     },
//     {
//       title: "Last Login",
//       dataIndex: "last_login",
//       render: (text, record) => (
//         <div>
//           <div>{moment(record.last_login).format("YYYY-MM-DD")}</div>
//           <div style={{ fontSize: "12px", color: "#888" }}>
//             {moment(record.last_login).format("hh:mm A")}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Joined On",
//       key: "joining_on",
//       render: (text, record) => (
//         <div>
//           <div>{moment(record.joining_on).format("YYYY-MM-DD")}</div>
//           <div style={{ fontSize: "12px", color: "#888" }}>
//             {moment(record.joining_on).format("hh:mm A")}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Status",
//       key: "status",
//       render: (text, record) => (
//         <span>
//           {record.status ? (
//             <>
//               <Tag color="success">Active</Tag>
//             </>
//           ) : (
//             <>
//               <Tag color="error">Inactive</Tag>
//             </>
//           )}
//         </span>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Button type="primary" size="small" onClick={() => navigate("/edit-learner/" + btoa(record.id))}>Edit</Button>
//           <Button variant="solid" color="danger" size="small"> Change Status</Button>

//         </Space>
//       ),
//     },
//   ];

//   const pagination_on_change = async (data) => {
//     set_pagination_loader(true)
//     const FORM_DATA = new FormData();
//     FORM_DATA.append("page", data);
//     FORM_DATA.append("token", localStorage.getItem("token"));
//     FORM_DATA.append("name", search_query_name);
//     FORM_DATA.append("email", search_query_email);
//     const API_CALL = await LEARNER_LIST(FORM_DATA);
//     if (API_CALL?.data?.status) {
//       set_table_data(API_CALL?.data?.data);
//       set_current_page(API_CALL?.data?.current_page);
//       set_total_pages(API_CALL?.data?.total_pages);
//       set_total_learners(API_CALL?.data?.total_learners);
//       set_pagination_loader(false);
//     } else {

//       set_pagination_loader(false);
//     }
//   }
// const fetchResultsName = useCallback((value) => {
//   debounce(async () => {
//     try {
//       set_search_query_name(value);
//       set_pagination_loader(true);
//       const FORM_DATA = new FormData();
//       FORM_DATA.append("token", localStorage.getItem("token"));
//       FORM_DATA.append("name", value);
//       FORM_DATA.append("email", '');
//       const API_CALL = await LEARNER_LIST(FORM_DATA);
//       if (API_CALL?.data?.status) {
//         set_table_data(API_CALL?.data?.data);
//         set_current_page(API_CALL?.data?.current_page);
//         set_total_pages(API_CALL?.data?.total_pages);
//         set_total_learners(API_CALL?.data?.total_learners);
//       }
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       set_pagination_loader(false);
//     }
//   }, 500)(); // Call debounce immediately
// }, []);


// const fetchResultsEmail = useCallback((value) => {
//   debounce(async () => {
// try {
//       set_search_query_email(value);
//       set_pagination_loader(true);
//       const FORM_DATA = new FormData();
//       // FORM_DATA.append("token", localStorage.getItem("token"));
//       FORM_DATA.append("name", '');
//       FORM_DATA.append("email", value);
//       const API_CALL = await LEARNER_LIST(FORM_DATA);
//       if (API_CALL?.data?.status) {
//         set_table_data(API_CALL?.data?.data);
//         set_current_page(API_CALL?.data?.current_page);
//         set_total_pages(API_CALL?.data?.total_pages);
//         set_total_learners(API_CALL?.data?.total_learners);
//       }
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       set_pagination_loader(false);
//     }
  
//    }, 500)(); // Call debounce immediately
// }, []);

//   const handleInput = (e) => {
//     const value = e.target.value;
//     if (search_query_select === 'Name') {
//       set_search_query_email('')
//       fetchResultsName(value);
//     } else {
//       set_search_query_name('')
//       fetchResultsEmail(value);
//     }

//   };
//   return (
//     <div className="lms-body">
//       <Card>
//         <Row>
//           <Col span={12}>
//             <h2>Learners</h2>
//           </Col>
//           <Col span={12}>
//             <div className="learner-buttons" style={{ float: "right" }}>
//               <Button
//                 color="green"
//                 variant="solid"
//                 style={{ marginRight: "10px" }}
//                 onClick={() => navigate("/add-learner")}
//               >
//                 Add Learners
//               </Button>
//               <Button
//                 type="primary"
//                 style={{ marginRight: "10px" }}
//                 onClick={() => navigate("/import-learner")}
//               >
//                 Import Learner
//               </Button>
//               <Button
//                 color="danger"
//                 variant="solid"
//                 style={{ marginRight: "3px" }}
//               >
//                 Export Learner
//               </Button>
//             </div>
//           </Col>
//         </Row>

//         <Row>
//           <Col span={12}>
//             <Input
//               addonBefore={selectBefore}
//               placeholder={search_paceholder}
//               onChange={handleInput}
//               size="large"
//             />
//           </Col>

//           <Col span={12}>
//             {/* <div className="filters" style={{ float: "right" }}>
//               <span
//                 style={{
//                   paddingTop: "8px",
//                   marginRight: "10px",
//                   fontSize: "16px",
//                 }}
//               >
//                 Filter by:
//               </span>
//               <DatePicker
//                 onChange={onChange}
//                 placeholder="Date Joined"
//                 size="large"
//                 style={{ marginRight: "10px" }}
//               />



//               <DatePicker
//                 onChange={onChange}
//                 size="large"
//                 placeholder="Last Login"
//               />
//             </div> */}
//           </Col>
//         </Row>
//         {loader ? (
//           <>
//            <CulsightPageLoader />
//           </>
//         ) : (
//           <>
//             {pagination_loader ? (
//               <>
//                 <div style={{ textAlign: "center", padding: "60px" }}>
//                   <Spin indicator={<LoadingOutlined spin />} size="large" />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Table
//                   columns={columns}
//                   pagination={false}
//                   dataSource={table_data}
//                   style={{ marginTop: "15px" }}
//                 />

//               </>
//             )}

//             <div style={{ float: "right", marginTop: "20px" }}> <Pagination onChange={pagination_on_change} defaultCurrent={current_page} total={total_learners} /></div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

// export default Learners;
