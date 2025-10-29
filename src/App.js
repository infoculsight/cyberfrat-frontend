// src/App.js
import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./User-panel/pages/NotFound";
import './App.css';
import UsersRoutes from "./Routes/UsersRoutes";
import { getUser } from "./authService";
import Login from "./User-panel/pages/login/Login";
import CulsightPageLoader from "./User-panel/components/CulsightPageLoader";
import ForgetPassword from "./User-panel/pages/login/ForgetPassword";
import ResetPassword from "./User-panel/pages/login/ResetPassword";
import ResetPasswordMessage from "./User-panel/pages/login/ResetPasswordMessage";
import VerifyEmail from "./User-panel/pages/login/VerifyEmail";
import VerifyEmailMessage from "./User-panel/pages/login/VerifyEmailMessage";

function App() {
  const [user, setUser] = useState(null);
  const [user_role, set_user_role] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const [balck_theme, set_balck_theme] = useState(true);

  useEffect(() => {
    setCheckingAuth(true);
    getUser().then(u => {
      if (u) {
        setUser(u);
        set_user_role("learner"); // for demo
      }
      setCheckingAuth(false);
    });
  }, []);

  if (checkingAuth) return <CulsightPageLoader />; // Loader during auth check

  return (
    <ConfigProvider theme={{
      algorithm: balck_theme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: { colorPrimary: '#e9c70ada' }
    }}>
      <AntdApp>
        <Routes>
      {user ? (
        <Route path="/*" element={user_role === "learner" ? <UsersRoutes /> : <NotFound />} />
      ) : (
        <>
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/reset-password-message" element={<ResetPasswordMessage />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
