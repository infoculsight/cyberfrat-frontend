
import { Button, Card, Col, Row, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChartOutlined } from "@ant-design/icons";
import { PHISHING_DASHBOARD, LIST_CAMPAIGN } from "../apis/apis";
import CulsightPageLoader from '../components/CulsightPageLoader';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

function Dashboard() {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [table_data, set_table_data] = useState(false);
  const [email_send, set_email_send] = useState('');
  const [email_open, set_email_open] = useState('');
  const [email_clicked, set_email_clicked] = useState('');
  const [data_submit, set_data_submit] = useState('');
  const [email_resend, set_email_resend] = useState('');
  const [Email_Sended_Chart, set_Email_Sended_Chart] = useState('')
  const [Email_Open_Chart, set_Email_Open_Chart] = useState('')
  const [Email_Clicked_Chart, set_Email_Clicked_Chart] = useState('')
  const [Data_Submit_Chart, set_Data_Submit_Chart] = useState('')
  const [Resend_Chart, set_Resend_Chart] = useState('')
  const [total_cam, set_total_cam] = useState(0)
  const [hover_show, set_hover_show] = useState(true)

const adjustZeroValue = (value) => {
  const parsed = parseInt(value);
  return parsed === 0 ? 0.0001 : parsed;
};

  const CAMPAIGN_TRACKING_API = async () => {
    const formData = new FormData();
    const API_CALL = await PHISHING_DASHBOARD(formData);
    if (API_CALL?.data?.status) {
      console.log("email_send", API_CALL?.data?.email_send)
      set_email_send(API_CALL?.data?.email_send);
      set_email_open(API_CALL?.data?.email_open);
      set_email_clicked(API_CALL?.data?.email_clicked);
      set_data_submit(API_CALL?.data?.data_submit);
      set_email_resend(API_CALL?.data?.email_resend);
      set_total_cam(API_CALL?.data?.total_user)
      if(adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_send)) ===0.0001){
        set_hover_show(false)
      }
      set_Email_Sended_Chart([
        { name: 'Remain', value: adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_send)), },
        { name: 'Email Sended', value: parseInt(API_CALL?.data?.email_send) }
      ])
      set_Email_Open_Chart([
        { name: 'Remain', value: adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_open)) },
        { name: 'Email Opened', value: parseInt(API_CALL?.data?.email_open) }

      ])
      set_Email_Clicked_Chart([
        { name: 'Remain', value: adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_clicked)) },
        { name: 'Email Clicked', value: parseInt(API_CALL?.data?.email_clicked) }

      ])
      set_Data_Submit_Chart([
        { name: 'Remain', value: adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.data_submit)) },
        { name: 'Data Submit', value: parseInt(API_CALL?.data?.data_submit) }
      ])
      set_Resend_Chart([
        { name: 'Remain', value: adjustZeroValue(parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_resend)) },
        { name: 'Email Resend', value: parseInt(API_CALL?.data?.email_resend) }
      ])
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };


  // LIST API
  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      const API_CALL = await LIST_CAMPAIGN(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_table_data(API_CALL?.data?.data);
        CAMPAIGN_TRACKING_API()
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };

    LIST_API();
  }, []);


  // TABLE COLUMNS
  const columns = [
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
      title: "SMTP",
      render: (text, record) => <span>{record.smtp_name}</span>,
    },
    {
      title: "User Group",
      render: (text, record) => <span>{record.group_name} ({record.group_type === 1 ? "LMS Group": "Local Group"})</span>,
    },
    {
      title: "Email Template",
      dataIndex: "email_template",
      render: (text, record) => <span>{record.email_template_name}</span>,
    },
    {
      title: "User Count",
      dataIndex: "user_count",
      render: (text, record) => <span>{record.total_users}</span>,
    },
    {
      title: "Status",
      dataIndex: "campaign_status",
      render: (campaign_status) => (
        campaign_status
          ? <Tag color="green">Active</Tag>
          : <Tag color="red">Inactive</Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => navigate("/view-campaign/" + btoa(record.id))}><BarChartOutlined /></Button>
      ), btoa
    },

  ];


  return (

    
    <div className='lms-body'>
      <h2>Overview <span style={{ float: "right", color: "#77ee77" }}>Total Users Tracking: {total_cam}</span></h2>
      <Row gutter={[16, 16]}>
        <Col xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '40%' }} lg={{ flex: '20%' }}>
          <Card>
            {loader ? <>Loadding..</> : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Email_Sended_Chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55} // Makes it a donut chart
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  // label
                  >
                    <Cell key={`Sended-cell-1`} fill={"grey"} />
                    <Cell key={`Sended-cell-1`} fill={"rgb(130 230 68)"} />
                  </Pie>
                 {hover_show &&  <RechartsTooltip />}
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "rgb(130 230 68)" }}>Email Sent ({email_send})</h3>
            </>}

          </Card>
        </Col >
        <Col xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '40%' }} lg={{ flex: '20%' }}>
          <Card>
            {loader ? <>Loadding..</> : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Email_Open_Chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55} // Makes it a donut chart
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  // label
                  >
                    <Cell key={`Sended-cell-1`} fill={"grey"} />
                    <Cell key={`Sended-cell-1`} fill={"#ecec66"} />
                  </Pie>
                   {hover_show &&  <RechartsTooltip />}
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#ecec66" }}>Email Opened ({email_open})</h3>
            </>}

          </Card>
        </Col>
        <Col xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '40%' }} lg={{ flex: '20%' }}>
          <Card>
            {loader ? <>Loadding..</> : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Email_Clicked_Chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55} // Makes it a donut chart
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  // label
                  >
                    <Cell key={`Sended-cell-1`} fill={"grey"} />
                    <Cell key={`Sended-cell-1`} fill={"#eab451"} />
                  </Pie>
                   {hover_show &&  <RechartsTooltip />}
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#eab451" }}>Clicked Link ({email_clicked})</h3>
            </>}

          </Card>
        </Col>
        <Col xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '40%' }} lg={{ flex: '20%' }}>
          <Card>
            {loader ? <>Loadding..</> : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Data_Submit_Chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55} // Makes it a donut chart
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  // label
                  >
                    <Cell key={`Sended-cell-1`} fill={"grey"} />
                    <Cell key={`Sended-cell-1`} fill={"#f97d7d"} />
                  </Pie>
                    {hover_show &&  <RechartsTooltip />}
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#f97d7d" }}>Submitted Data ({data_submit})</h3>
            </>}

          </Card>
        </Col>
        <Col xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '40%' }} lg={{ flex: '20%' }}>
          <Card>
            {loader ? <>Loadding..</> : <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Resend_Chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55} // Makes it a donut chart
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  // label
                  >
                    <Cell key={`Sended-cell-1`} fill={"grey"} />
                    <Cell key={`Sended-cell-1`} fill={"#f97d7d"} />
                  </Pie>
                   {hover_show &&  <RechartsTooltip />}
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#f97d7d" }}>Spam Emails ({email_resend})</h3>
            </>}

          </Card>
        </Col>
      </Row>


      <Card style={{ marginTop: "30px" }}>


        <Row gutter={16}>
          <Col span={20}>
            <h2>Latest Campaign</h2>
            {/* <Input
              addonBefore={<span>Name</span>}
              placeholder="Search by name"
              onChange={handleInput}
              size="large"
            /> */}
          </Col>
          <Col span={4}>
            <Button
              type='primary'
              variant='solid'
              color='green'
              style={{ width: '100%' }}
              size='mideum'
              onClick={() => navigate('/campaign')}
            >
              All Campaign
            </Button>
          </Col>
        </Row>
        {loader ? (
          <>
            <CulsightPageLoader />
          </>
        ) : (
          <>
            <Table
              columns={columns}
              pagination={false}
              dataSource={table_data}
              style={{ marginTop: "15px" }}
            />
          </>
        )}



      </Card>
    </div>


  );
}

export default Dashboard;
