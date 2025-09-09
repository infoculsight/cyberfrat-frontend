import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CAMPAIGN_TRACKING } from '../../apis/apis';
import { useNavigate, useParams } from 'react-router-dom';
import CampaignUsers from './CampaignUsers';
import { LeftOutlined } from "@ant-design/icons";

function ViewCampaign(props) {
  const navigate = useNavigate();
  const { id } = useParams()
  const [loader, setLoader] = useState(true);
  const [email_send, set_email_send] = useState('');
  const [email_open, set_email_open] = useState('');
  const [email_clicked, set_email_clicked] = useState('');
  const [data_submit, set_data_submit] = useState('');
  const [campaign_name, set_campaign_name] = useState('');
  const [smtp_name, set_smtp_name] = useState('');
  const [group_name, set_group_name] = useState('');
  const [email_template_name, set_email_template_name] = useState('');
  const [group_type, set_group_type] = useState('');



  const [Email_Sended_Chart, set_Email_Sended_Chart] = useState('')
  const [Email_Open_Chart, set_Email_Open_Chart] = useState('')
  const [Email_Clicked_Chart, set_Email_Clicked_Chart] = useState('')
  const [Data_Submit_Chart, set_Data_Submit_Chart] = useState('')

  // LIST API

  useEffect(() => {
    const CAMPAIGN_TRACKING_API = async () => {
      const formData = new FormData();
      formData.append("campaign_id", atob(id));
      const API_CALL = await CAMPAIGN_TRACKING(formData);
      if (API_CALL?.data?.status) {
        console.log("email_send", API_CALL?.data?.email_send)
        set_email_send(API_CALL?.data?.email_send);
        set_email_open(API_CALL?.data?.email_open);
        set_email_clicked(API_CALL?.data?.email_clicked);
        set_data_submit(API_CALL?.data?.data_submit);
        set_campaign_name(API_CALL?.data?.campaign_name);
        set_smtp_name(API_CALL?.data?.smtp_name);
        set_group_name(API_CALL?.data?.group_name);
        set_email_template_name(API_CALL?.data?.email_template_name)
        set_group_type(API_CALL?.data?.group_type)
        set_Email_Sended_Chart([
          { name: 'Remain', value: parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_send) },
          { name: 'Email Sended', value: parseInt(API_CALL?.data?.email_send) }
        ])
        set_Email_Open_Chart([
          { name: 'Remain', value: parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_open) },
          { name: 'Email Opened', value: parseInt(API_CALL?.data?.email_open) }

        ])
        set_Email_Clicked_Chart([
          { name: 'Remain', value: parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.email_clicked) },
          { name: 'Email Clicked', value: parseInt(API_CALL?.data?.email_clicked) }

        ])
        set_Data_Submit_Chart([
          { name: 'Remain', value: parseInt(API_CALL?.data?.total_user) - parseInt(API_CALL?.data?.data_submit) },
          { name: 'Data Submit', value: parseInt(API_CALL?.data?.data_submit) }
        ])


        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    };



    CAMPAIGN_TRACKING_API();
  }, [id]);



  return (
    <div className="lms-body">
      <Row style={{marginBottom:"15px"}} gutter={15}>
        <Col span={24}>
          <h2> <span style={{ cursor: "pointer" }}
            onClick={() => navigate("/campaign")}><LeftOutlined /></span> Campaign - {campaign_name}</h2>
          

           
        </Col>
        <Col span={8}>
         <Card>

          <h3>Email Template: <b style={{color:"rgb(130 230 68)"}}>{email_template_name}</b></h3>
          </Card>
        </Col>
          <Col span={8}>
         <Card>

          <h3>Smtp Name: <b style={{color:"rgb(130 230 68)"}}>{smtp_name}</b></h3>
          </Card>
        </Col>
           <Col span={8}>
         <Card>

          <h3>Group Name:  <b style={{color:"rgb(130 230 68)"}}>{group_name} ({group_type === 1 ? "LMS Group": "Local Group"})</b></h3>
          
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
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
                    <Cell key={`dash-cell-1`} fill={"grey"} />
                    <Cell key={`dash-cell-1`} fill={"rgb(130 230 68)"} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "rgb(130 230 68)" }}>Email Sent ({email_send})</h3>
            </>}

          </Card>
        </Col>
        <Col span={6}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#ecec66" }}>Email Opened ({email_open})</h3>
            </>}

          </Card>
        </Col>
        <Col span={6}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#eab451" }}> Clicked Link ({email_clicked})</h3>
            </>}

          </Card>
        </Col>
        <Col span={6}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ textAlign: "center", color: "#f97d7d" }}>Submitted Data ({data_submit})</h3>
            </>}

          </Card>
        </Col>
      </Row>
      <br></br>
      <CampaignUsers campaign_id={atob(id)} />

    </div>
  );
}

export default ViewCampaign;
