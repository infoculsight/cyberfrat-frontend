
import { useState } from "react";
import "../../assests/Login.css"
import { Button, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, CopyrightOutlined, LoadingOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CF-PPT-1.png"
import { Link } from "react-router-dom";
import { AxiosFirst } from "../../config/config";

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
            const res = await AxiosFirst.post("login-view/", formData);
            if (res?.data?.status) {
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
                            <div style={{ position: "relative", width: "100%", display: "block" }}>{error ? <><p style={{ color: "red", fontWeight: "bold" }}>{error}</p></> : ''}</div>
                            <input className="black-input" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
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
                           



                            {loader ? <>
                                <Button type="primary" style={{ width: "100%", height: "42px" }}> <Spin indicator={<LoadingOutlined spin />} style={{ color: "#FFF" }} size="small" /></Button>
                            </> : <>
                                <Button type="primary" onClick={LOGIN_ACCOUNT} style={{ width: "100%", height: "42px" }}>  Sign In </Button>
                            </>}

                        </div>
                        <div className="login-footer">
                            <div style={{ marginLeft: "15px" }}>Copyright <CopyrightOutlined /> {new Date().getFullYear()} CyberFrat </div>
                            {/* <div>  <Link className="lms-link">Security Tips <InfoCircleOutlined /></Link></div> */}
                            <div style={{ marginRight: "15px",float:"right" }}>  <Link  className="lms-link" style={{ color: "#fff" }}>Terms & Policies</Link></div>
                        </div>
                    </div>

              
        </>
    )
}

export default Login;




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



