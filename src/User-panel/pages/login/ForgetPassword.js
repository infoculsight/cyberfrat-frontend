
import React, { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { InfoCircleOutlined, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";
const ForgetPassword = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState([]);
 
    return (
        <>
           <div className="login-wapper">
                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                    <h2 style={{ marginBottom: "15px", marginTop:"20px", }}>Forget Password</h2>
                    {/* <p>Enter your details to sign in to your account</p> */}
                    <div style={{ position: "relative", width: "100%", display: "block",marginTop:"30px" }}>{error ? <><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
                    <input className="black-input" placeholder="Email ID" value={email} onChange={e => setEmail(e.target.value)} />

                    <Button type="primary"  style={{ width: "100%", height: "42px",marginBottom:"20px" }}>
                        {loader ? <>
                            <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" />
                        </> : <>
                            Submit
                        </>}
                    </Button>
                </div>
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


