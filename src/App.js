import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Routes, Route } from "react-router-dom";
import Login from "./Admin-panel/pages/login/Login";
import NotFound from "./Admin-panel/pages/NotFound";
import { getUser, logout } from './authService';
import Callback from "./Callback";
import './App.css'
import AdminRoutes from "./Routes/AdminRoutes";
import { jwtDecode } from "jwt-decode";
import ForgetPassword from "./Admin-panel/pages/login/ForgetPassword";


function App() {
  const [user, setUser] = useState(null);
  const [user_role, set_user_role] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // 👈 New
  const [balck_theme, set_balck_theme] = useState(true)
  useEffect(() => {
    getUser().then(use => {
      if (use) {
        setUser(use);
        const decoded = jwtDecode(use?.access_token);
        const panelRoles = decoded?.resource_access?.["LMS_FRONTEND"]?.roles || [];
        const local_theme = localStorage.getItem("dark_theme")
        if (panelRoles.includes('portal_admin')) {
          set_user_role('portal_admin');
          // parseInt(local_theme) === 0 ? set_balck_theme(false) : set_balck_theme(true)
        } else {
          logout();
        }
      }
      setCheckingAuth(false); // ✅ Done checking auth
    });
  }, []);

  if (checkingAuth) return null; // or a loader

  return (
     <ConfigProvider theme={{ algorithm: balck_theme ? theme.darkAlgorithm :  theme.defaultAlgorithm }}>
      <AntdApp>
        <Routes>
          <Route path="/callback" element={<Callback />} />

          {user ? (
            <Route
              path="/*"
              element={
                user_role === 'portal_admin' ? (
                  <AdminRoutes />
                ) : (
                  <NotFound />
                )
              }
            />
          ) : (
            <>
             <Route path="/" element={<Login />} /> 
            <Route path="/forget-password" element={<ForgetPassword />} />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}


export default App;