// import React from "react";
// import "../../assests/Login.css"
// import Logo from "../../assests/CF-PPT-1.png"
// import { login } from "../../../authService";
// import { Button } from "antd";
// const Login = () => {

//     return (
//         <>
//             <div className="login-wapper">
//                 <div className="logo">

//                 </div>
//                 <div className="login-form" style={{paddingBottom:"50px"}}>
//                     <img alt="logo" src={Logo} width={350} style={{margin:"15px"}} />
//                     <h2 style={{ marginBottom: "15px", fontSize:"30px" }}>Welcome to CyberFrat</h2><br/>

//                     <h4 >Access your account securely and take control of your cybersecurity journey. Log in to stay connected with your learning, tools, and resources, all in one place. Your safety and privacy are our top priorities.</h4><br></br>

//                    <Button style={{marginBottom:"20"}} type="primary" onClick={() => login()}>Login to Continue</Button>
//                 </div>

//             </div>
//         </>
//     )
// }

// export default Login;




import React, { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CF-PPT-1.png"
import { Link } from "react-router-dom";
import { LOGIN_API } from "../../apis/apis";
const Login = () => {
    // const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const LOGIN_ACCOUNT = async () => {
        setLoader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append('email', email);
        FORM_DATA.append('password', password);
        const LOGIN_ACCOUNT_API = await LOGIN_API(FORM_DATA);
        if (LOGIN_ACCOUNT_API?.data?.status) {
            setError('')
            localStorage.setItem("login", true);
            localStorage.setItem("token", LOGIN_ACCOUNT_API?.data?.token);
            window.location.reload();
        } else {
            setError(LOGIN_ACCOUNT_API?.data?.error)
            setLoader(false)
        }
    };
    return (
        <>
            <div className="login-wapper">
                <div className="logo">
                    <img alt="logo" src={Logo} />
                </div>
                <div className="login-form">
                    <h2 style={{ marginBottom: "15px" }}>Admin Login</h2>
                    <p>Enter your details to sign in to your account</p>
                    <div style={{ position: "relative", width: "100%", display: "block" }}>{error ? <><p style={{ position: "absolute", width: "100%", top: "-46px", color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
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
                    <Link to="/forget-password" className="lms-link right" style={{ position: "relative", top: "-18px",left: "145px" }}>Forgot Password?</Link>
                    <Button type="primary" onClick={LOGIN_ACCOUNT} style={{ width: "100%", height: "42px" }}>
                        {loader ? <>
                            <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" />
                        </> : <>
                            Sign In
                        </>}
                    </Button>
                    <p style={{ marginBottom: "0px",marginTop:"10px" }}>Or</p>
                    <Link className="lms-link" style={{ marginBottom: "30px", marginTop: "15px", display: "inline-block" }}> Sign Up with SSO</Link>
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


