import React from "react";
import "../assests/Login.css"
import Logo from "../assests/culsight.png"
//import { login } from "../../authService";
import { Button } from "antd";
const Login = () => {
 
    return (
        <>
            <div className="login-wapper">
                <div className="logo">
                    <img alt="logo" src={Logo} />
                </div>
                <div className="login-form">
                    <h2 style={{ marginBottom: "15px" }}>Admin Login</h2>
                    <Button type="primary">Login Account</Button>
                </div>

            </div>
        </>
    )
}

export default Login;



