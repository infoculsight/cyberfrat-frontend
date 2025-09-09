import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  message,
  App,
} from "antd";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { EDIT_USER, VIEW_USER } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import LmsCountryDropdown from "../../components/LmsCountryDropdown";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function EditUser() {
  const { id } = useParams();
  const { notification } = App.useApp();
  const [page_loader, set_page_loader] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [email ,set_email] = useState("")
  const [organization, set_organization] = useState("");
  const [designation, set_designation] = useState("");
  const [name, set_name] = useState("");
  
  const [country_code, set_country_code] = useState("IN");
  const [contact_no, set_contact_no] = useState("");
  const [address, set_address] = useState("");
  const [pin_code, set_pin_code] = useState("");
  const [errors, set_errors] = useState("");
 



  useEffect(() => {
    const VIEW_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));

      const EDIT_API_RESPONSE = await VIEW_USER(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;

        set_name(response_data?.name);
        set_email(response_data?.email);
        set_contact_no(parseInt(response_data?.contact_no));
        set_organization(parseInt(response_data?.organization));
        set_designation(parseInt(response_data?.designation));
        set_country_code(response_data?.country_code);
        set_contact_no(response_data?.contact_no);
        set_address(response_data?.address);
        set_pin_code(response_data?.pin_code);
        set_page_loader(false);

      }
    };

    VIEW_API();
  }, [id]); 

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("name",name);
    FORM_DATA.append("email",email);
    FORM_DATA.append("country_code", country_code);
    FORM_DATA.append("contact_no", contact_no);
    FORM_DATA.append("address", address);
    FORM_DATA.append("organization", organization);
    FORM_DATA.append("designation", designation);
    FORM_DATA.append("pin_code", pin_code);
   
    try {
      const response = await EDIT_USER(FORM_DATA);
      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        navigate("/users");
      } else {
        setLoading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="lms-body">
      <Card>
        <div className="lms-form">
        
          <Row>
            <Col span={12}>
              <h2><span   style={{cursor: "pointer",marginRight:"5px"}}
              onClick={() => navigate("/users")} ><LeftOutlined /></span>Edit User</h2>
            </Col>
          </Row>
          {page_loader ? (
            <CulsightPageLoader />
          ) : (

           <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                validateTrigger="onSubmit"
              >
                <h3>Basic Information</h3>


               
                    <Form.Item label=" Name">
                      <Input
                        placeholder="Enter your Name"
                        value={name}
                        onChange={(e) => set_name(e.target.value)}
                      />
                      {errors?.name ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  
                  <Row gutter={[16]}>
                  <Col span={12}>
                    <Form.Item label="Organization">
                      <Input
                      value={organization}
                        placeholder="Enter Organization"
                        onChange={(e) => set_organization(e.target.value)}
                      />
                      {errors?.organization ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.organization}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Designation">
                      <Input
                        placeholder="Enter designation"
                        value={designation}
                        onChange={(e) => set_designation(e.target.value)}
                      />
                      {errors?.designation ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.designation}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <h3>Contact Information</h3>

                <Form.Item label="Email">
                  <Input
                    type="email"
                    value={email}
                    placeholder="Enter  email"
                    onChange={(e) => set_email(e.target.value)}
                  />
                  {errors?.email ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.email}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

                <Form.Item label="Contact Number">
                  <LmsCountryDropdown
                      country={country_code}
                      contact={contact_no}
                      set_country_code={set_country_code}
                      set_contact_no={set_contact_no}
                   
                  />
                  {errors?.contact_no ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.contact_no}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

               
                    <Form.Item label="Address">
                      <Input
                      value={address}
                        placeholder="Enter your address"
                        onChange={(e) => set_address(e.target.value)}
                      />  {errors?.address ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.address}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
               

                <Form.Item label="Pin Code">
                  <Input
                    placeholder="Enter your pin code"
                    value={pin_code}
                    onChange={(e) => set_pin_code(e.target.value)}
                  />
                  {errors?.pin_code ? (
                    <>
                      <span style={{ color: "red" }}>{errors?.pin_code}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Item>

            

                <Form.Item>
                  {loading ? (
                    <>
                      <Button type="primary" style={{ float: "right" }}>
                        Save{" "}
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                        />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="primary"
                        style={{ float: "right" }}
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </>
                  )}
                </Form.Item>
                
              </Form>
            
          )}
        </div>
      </Card>
    </div>
  );
}
