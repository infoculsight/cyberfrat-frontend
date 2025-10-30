
import React, { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { InfoCircleOutlined, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";
import { RESET_PASSWORD_REQUEST } from "../../apis/apis";
const ForgetPassword = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState([]);
    const [form_hidden, set_form_hidden] = useState(false);

    const RESET_PASSWORD_REQUEST_API = async () => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("email", email);

        try {
            const response = await RESET_PASSWORD_REQUEST(FORM_DATA);
            if (response?.data?.status) {
                set_form_hidden(true)
                setError("");
            } else {
                setError(response?.data?.message);
            }
        } catch (error) {
            setError(
                "Server Error: " + (error?.response?.data?.message || "Unknown error")
            );
        } finally {
            setLoader(false);
        }
    };
    return (
        <>
            <div className="login-wapper">
                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                    <h2 style={{ marginBottom: "15px", marginTop: "20px", }}>Forget Password</h2>
                    {/* <p>Enter your details to sign in to your account</p> */}
                    {form_hidden ? <>
                        <p className="reset-text">Please check your email address and reset your password.</p>

                    </> : <>
                        <input className="black-input" style={{ marginTop: "40px" }} placeholder="Email ID" value={email} onChange={e => setEmail(e.target.value)} />


                        {loader ? <>
                            <Button type="primary" style={{ width: "100%", height: "42px", marginBottom: "20px" }}> <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" /></Button>
                        </> : <>
                            <Button type="primary" onClick={RESET_PASSWORD_REQUEST_API} style={{ width: "100%", height: "42px", marginBottom: "20px" }}>    Submit</Button>
                        </>}

                    </>}
                </div>
                <div style={{ position: "relative", width: "100%", display: "block", }}>{error ? <><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
                <div className="login-footer">
                    <div>Copyright <CopyrightOutlined /></div>
                    <div>  <Link className="lms-link">Security Tips <InfoCircleOutlined /></Link></div>

                    <div>  <Link className="lms-link">Terms & Policies</Link></div>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword;


