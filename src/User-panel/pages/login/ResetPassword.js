



import React, { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CF-PPT-1.png"
import { Link } from "react-router-dom";
import { LOGIN_API } from "../../apis/apis";


const ResetPassword = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    return (
        <>
            <div className="login-wapper">
                <div className="logo">
                    <img alt="logo" src={Logo} />
                </div>
                <div className="login-form">
                    <h2 style={{ marginBottom: "15px" }}>Admin Login</h2>
                    <p>Enter new password</p>
                    <div style={{ position: "relative", width: "100%", display: "block" }}>{error ? <><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>

                    <div style={{ position: "relative", marginBottom: "15px" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="black-input"
                            placeholder="Old Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <EyeTwoTone className="password-eye" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeInvisibleOutlined className="password-eye" onClick={togglePasswordVisibility} />
                        )}
                    </div>

                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="black-input"
                            placeholder="Confirm Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <EyeTwoTone className="password-eye" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeInvisibleOutlined className="password-eye" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                     <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="black-input"
                            placeholder="Confirm Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <EyeTwoTone className="password-eye" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeInvisibleOutlined className="password-eye" onClick={togglePasswordVisibility} />
                        )}
                    </div>


                    <Button type="primary" style={{ width: "100%", height: "42px", marginBottom: "20px" }}>
                        {loader ? <>
                            <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" />
                        </> : <>
                            Reset Password
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

export default ResetPassword;


