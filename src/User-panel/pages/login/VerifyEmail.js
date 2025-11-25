



import React, { useEffect, useState } from "react";
import "../../assests/Login.css"
import { Button } from "antd";
import { CopyrightOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link, useNavigate, useParams } from "react-router-dom";
import { EMAIL_VERIFY } from "../../apis/apis";
import CulsightPageLoader from "../../components/CulsightPageLoader";


const VerifyEmail = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const { token } = useParams();
    const Navigate = useNavigate();
    const [form_hidden, set_form_hidden] = useState(false);

   useEffect(() => {
    const EMAIL_VERIFY_API = async () => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("token", token);

        try {
            const response = await EMAIL_VERIFY(FORM_DATA);
            if (response?.data?.status) {
                set_form_hidden(true)

            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
        } finally {
            setLoader(false);
        }
    };
 
        EMAIL_VERIFY_API()
    }, [token])

    return (
        <>
            <div className="login-wapper">
                {loader ? <>
                    <CulsightPageLoader />
                </> : <>
                    {form_hidden ? <>
                        <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                            <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                            <p className="reset-text">Your Email Address is Verified Successfully</p>
                            <Button type="primary"  onClick={() => Navigate('/')} style={{ width: "100%", height: "42px", marginBottom: "20px" }}>   Login Now</Button>
                        </div>
                    </> : <>
                        <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                            <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                            <div style={{ position: "relative", marginTop: "80px", width: "100%", display: "block" }}><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>Token is not valid</p></div>
                        </div>
                    </>}

                   <div className="login-footer">
                            <div style={{marginLeft:"15px"}}>Copyright <CopyrightOutlined /> {new Date().getFullYear()} CyberFrat </div>
                            {/* <div>  <Link className="lms-link">Security Tips <InfoCircleOutlined /></Link></div> */}
                            <div style={{marginRight:"15px"}}>  <Link to="/terms-policy" className="lms-link">Terms & Policies</Link></div>
                        </div>
                </>}
            </div>
        </>
    )
}

export default VerifyEmail;


