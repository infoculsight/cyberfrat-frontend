
import "../../assests/Login.css"
import { Button } from "antd";
import { CopyrightOutlined, } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";


const VerifyEmailMessage = () => {
    return (
        <>
            <div className="login-wapper">

                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                      <p className="reset-text">Please check your email address and verify your account.</p>
                      <Button type="primary"  onClick={() => window.location.href = "/"} style={{ width: "100%", height: "42px", marginBottom: "20px" }}>   Login </Button>
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

export default VerifyEmailMessage;


