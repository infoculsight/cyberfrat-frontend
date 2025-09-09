import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Upload,
  message,
  App,
} from "antd";
import { LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { EDIT_INSTRUCTOR, VIEW_INSTRUCTOR } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import LmsCountryDropdown from "../../components/LmsCountryDropdown";
import CulsightPageLoader from "../../components/CulsightPageLoader";

export default function EditInstructor() {
  const { id } = useParams();
  const { notification } = App.useApp();
  const [page_loader, set_page_loader] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [image, set_image] = useState("");
  const [image_api, set_image_api] = useState("");
  const [first_name, set_first_name] = useState("");
  const [organization, set_organization] = useState("");
  const [designation, set_designation] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, setEmail] = useState("");
  const [country_code, set_country_code] = useState("IN");
  const [contact_no, set_contact_no] = useState("");
  const [address_line_1, set_address_line1] = useState("");
  const [address_line_2, set_address_line2] = useState("");
  const [pin_code, set_pin_code] = useState("");
  const [errors, set_errors] = useState("");
  const [imageError, setimageError] = useState("");


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };


  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <Loading3QuartersOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );



  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", atob(id));
      const EDIT_API_RESPONSE = await VIEW_INSTRUCTOR(FORM_DATA);
      if (EDIT_API_RESPONSE?.data?.status) {
        const response_data = EDIT_API_RESPONSE?.data?.data;
        set_first_name(response_data?.first_name);
        if (response_data?.image) {
          set_image(response_data.image);
        } else {
          set_image("");
        }
        set_last_name(response_data?.last_name);
        setEmail(response_data?.email);
        set_contact_no(parseInt(response_data?.contact_no));
        set_country_code(response_data?.country_code);
        set_address_line1(response_data?.address_line_1);
        set_address_line2(response_data?.address_line_2);
        set_pin_code(response_data?.pin_code);
        set_page_loader(false);
      }
    };

    fetchData();
  }, [id]);

  

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", atob(id));
    FORM_DATA.append("first_name", first_name);
    FORM_DATA.append("last_name", last_name);
    FORM_DATA.append("country_code", country_code);
    FORM_DATA.append("contact_no", contact_no);
    FORM_DATA.append("organization", organization);
    FORM_DATA.append("designation", designation);
    FORM_DATA.append("address_line_1", address_line_1);
    FORM_DATA.append("address_line_2", address_line_2);
    FORM_DATA.append("pin_code", pin_code);
    FORM_DATA.append("image", image_api);
    try {
      const response = await EDIT_INSTRUCTOR(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        navigate("/instructors");
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
            <h2> <span style={{ cursor: "pointer" }} onClick={() => navigate("/instructors")}><LeftOutlined /></span>Edit Instructor</h2>
          </Col>

        </Row>
          
          {page_loader ? (
            <>
              <CulsightPageLoader />
            </>
          ) : (
            <>
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                validateTrigger="onSubmit"
              >
                <h3>Basic Information</h3>

                  <Form.Item label="Upload Your Photo here">
                               <Upload
                                 name="avatar"
                                 listType="picture-card"
                                 className="avatar-uploader"
                                 showUploadList={false}
                                  beforeUpload={(file) => {
                                   console.log(file)
                                   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                                   const isLt2M = file.size <= 512000;
                                   if (!isJpgOrPng) {
                                     setimageError("Only JPG/PNG files are allowed.");
                                     return false;
                                   }
               
                                   if (!isLt2M) {
                                     setimageError("Thumbnail must be smaller than or equal to 500KB.");
                                     return false;
                                   }
                                   const img = new Image();
                                   img.src = URL.createObjectURL(file);
               
                                   img.onload = () => {
                                     const { width, height } = img;
                                     // Example: Minimum 600X400 pixels
                                     if (width === 600 && height === 400) {
                                           setimageError(""); // Clear errors if valid
               
                                           // Set preview and file for API
                                           getBase64(file, (url) => set_image(url));
                                           set_image_api(file);
                                          
                                     } else {
                                           setimageError("Image must be at least 600x400 pixels.");
                                     }
                                   
                                   };
                                     return false;
                                 
                                 }}
                                
                               >
                                 {image ? (
                                   <img
                                     src={image}
                                     alt="avatar"
                                     style={{
                                       width: "100%",
                                       height: "100%",
                                       objectFit: "cover",
                                     }}
                                   />
                                 ) : (
                                   uploadButton
                                 )}
                               </Upload>
               
                               {/* Error message under the uploader */}
                               {imageError && (
                                 <span
                                   style={{ color: "red", display: "block", marginTop: 8 }}
                                 >
                                   {imageError}
                                 </span>
                               )}
                               {/* Server-side validation error */}
                               {errors?.thumbnail && (
                                 <span
                                   style={{ color: "red", display: "block", marginTop: 8 }}
                                 >
                                   {errors?.thumbnail}
                                 </span>
                               )}
               
                                <p style={{ color: "#65e7c4", marginTop: "10px" }}>Note - Thumbnail must be smaller than or equal to 500KB and must be at least 600x400 pixels.</p>
                             </Form.Item>


                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="First Name">
                      <Input
                        placeholder="Enter your First Name"
                        value={first_name}
                        onChange={(e) => set_first_name(e.target.value)}
                      />
                      {errors?.first_name ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.first_name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Last Name">
                      <Input
                        value={last_name}
                        placeholder="Enter your Last Name"
                        onChange={(e) => set_last_name(e.target.value)}
                      />
                      {errors?.last_name ? (
                        <>
                          <span style={{ color: "red" }}>
                            {errors?.last_name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
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
                        value={designation}
                        placeholder="Enter designation"
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
                    placeholder="Enter learner email"
                    onChange={(e) => setEmail(e.target.value)}
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

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Address 1">
                      <Input
                        placeholder="Enter your 1st address"
                        value={address_line_1}
                        onChange={(e) => set_address_line1(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Address 2">
                      <Input
                        value={address_line_2}
                        placeholder="Enter your 2nd address"
                        onChange={(e) => set_address_line2(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Pin Code">
                  <Input
                    value={pin_code}
                    placeholder="Enter your pin code"
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
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
