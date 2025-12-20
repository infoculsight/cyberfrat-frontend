
import { useState } from "react";
import "../../assests/Login.css"
import { App, Button, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";
import {  SET_TEMP_NEW_PASSWORD } from "../../apis/apis";


const TemResetPassword = (props) => {

    const { notification } = App.useApp();
  
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [form_hidden, set_form_hidden] = useState(true);
    const [error, setError] = useState([]);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const isStrongPassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);

        if (password.length === 0) return ""; // nothing typed yet
        if (password.length < minLength) {
            return false;
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return false;
        }
        return true;
    };
    const NEW_PASSWORD_SET_API = async () => {
        setLoader(true);

        if (password === cpassword) {
            if (isStrongPassword(password)) {
                try {
                    const FORM_DATA = new FormData();
                    FORM_DATA.append("user_id", props.user_id);

                    FORM_DATA.append("new_password", cpassword);
                    const response = await SET_TEMP_NEW_PASSWORD(FORM_DATA);
                    if (response?.data?.status) {
                        set_form_hidden(true)
                        setError("");
                        notification.success({
                        message: "Successful",
                        description: response?.data?.message,
                        });
                       props.set_temporary_password(false)
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
            } else {
                setError(
                    "Password must be at least 8 characters long and Use A-Z, a-z, 0-9, and special char."
                );
                setLoader(false);
            }

        } else {
            setError(
                "Passwords do not match."
            );
            setLoader(false);
        }


    };
    return (
        <>
            <div className="login-wapper">

                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />

                    <h2 style={{ marginBottom: "35px" }}>Reset Password</h2>
                        <p style={{fontSize:"12px"}}>You’re using a temporary password. Please set a new password to proceed.</p>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="black-input"
                                placeholder="New Password"
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
                                value={cpassword}
                                onChange={(e) => setCPassword(e.target.value)}
                            />
                            {showPassword ? (
                                <EyeTwoTone className="password-eye" onClick={togglePasswordVisibility} />
                            ) : (
                                <EyeInvisibleOutlined className="password-eye" onClick={togglePasswordVisibility} />
                            )}
                        </div>



                        {loader ? <>
                            <Button type="primary" style={{ width: "100%", height: "42px", marginBottom: "20px" }}> <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" /> </Button>
                        </> : <>
                            <Button type="primary" onClick={NEW_PASSWORD_SET_API} style={{ width: "100%", height: "42px", marginBottom: "20px" }}>    Reset Password </Button>
                        </>}

                    <div style={{ position: "relative", marginTop: "80px", width: "100%", display: "block" }}>{error ? <><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
                </div>

            <div className="login-footer">
                            <div style={{marginLeft:"15px"}}>Copyright <CopyrightOutlined /> {new Date().getFullYear()} CyberFrat </div>
                            {/* <div>  <Link className="lms-link">Security Tips <InfoCircleOutlined /></Link></div> */}
                            <div style={{marginRight:"15px"}}>  <Link to="/terms-policy" className="lms-link">Terms & Policies</Link></div>
                        </div>
            </div>
        </>
    )
}

export default TemResetPassword;


