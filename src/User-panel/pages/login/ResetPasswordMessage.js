
import "../../assests/Login.css"
import { Button } from "antd";
import { InfoCircleOutlined, CopyrightOutlined } from "@ant-design/icons";
import Logo from "../../assests/CFGold_Logo.png"
import { Link } from "react-router-dom";


const ResetPasswordMessage = () => {

    return (
        <>
            <div className="login-wapper">

                <div className="login-form" style={{ marginTop: "70px", padding: "50px" }}>
                    <img alt="logo" src={Logo} style={{ maxWidth: "300px" }} />
                      <p className="reset-text">Password reset successfully.</p>
                      <Button type="primary" onClick={() => window.location.href = "/"} style={{ width: "100%", height: "42px", marginBottom: "20px" }}>   Login Now</Button>
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

export default ResetPasswordMessage;


