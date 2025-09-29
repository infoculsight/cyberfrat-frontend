import React from "react";
import "../assests/Login.css"
import Logo from "../assests/CF-PPT-1.png"
import { login } from "../../authService";
import { Button } from "antd";
const Login = () => {
 
    return (
        <>
            <div className="login-wapper">
                <div className="logo">
                    
                </div>
                <div className="login-form" style={{paddingBottom:"50px"}}>
                    <img alt="logo" src={Logo} width={350} style={{margin:"15px"}} />
                    <h2 style={{ marginBottom: "15px", fontSize:"30px" }}>Welcome to CyberFrat</h2><br/>

                    <h4 >Access your account securely and take control of your cybersecurity journey. Log in to stay connected with your learning, tools, and resources, all in one place. Your safety and privacy are our top priorities.</h4><br></br>

                   <Button style={{marginBottom:"20"}} type="primary" onClick={() => login()}>Login to Continue</Button>
                </div>

            </div>
        </>
    )
}

export default Login;



