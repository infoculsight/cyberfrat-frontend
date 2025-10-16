import React, { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";
import Axios from "../../config/config";
const Login = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    const LOGIN_ACCOUNT = async () => {
        setLoader(true);
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const res = await Axios.post("login-view/", formData);

            if (res.data.status) {
                window.location.href = "/";
            } else {
                setError(res.data.error || "Login failed");
            }
        } catch (err) {
            console.log(err);
            setError("Network error");
        }
        setLoader(false);
    };
    return (
        <>
            <div className="login-wapper">
                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                    <p>Enter your details to sign in to your account</p>
                    <div style={{ position: "relative", width: "100%", display: "block" }}>{error ? <><p style={{  color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
                    <input className="black-input" placeholder="Employee ID" value={email} onChange={e => setEmail(e.target.value)} />
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="black-input"
                            placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <EyeTwoTone className="password-eye" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeInvisibleOutlined className="password-eye" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    <Link to="/forget-password" className="lms-link right" style={{ position: "relative", top: "-18px", left: "145px" }}>Forgot Password?</Link>
                    <Button type="primary" onClick={LOGIN_ACCOUNT} style={{ width: "100%", height: "42px" }}>
                        {loader ? <>
                            <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" />
                        </> : <>
                            Sign In
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

export default Login;


