import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Routes, Route } from "react-router-dom";
import Login from "./User-panel/pages/Login";
import NotFound from "./User-panel/pages/NotFound";
import { getUser, logout } from './authService';
import Callback from "./Callback";
import './App.css'
import UsersRoutes from "./Routes/UsersRoutes";

import { jwtDecode } from "jwt-decode";

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
        if (panelRoles.includes('learner')) {
          set_user_role('learner');
          parseInt(local_theme) === 0 ? set_balck_theme(false) : set_balck_theme(true)
        } else {
          logout();
        }
      }
      setCheckingAuth(false); // ✅ Done checking auth
    });
  }, []);

  if (checkingAuth) return null; // or a loader

  return (
    <ConfigProvider theme={{
      algorithm: balck_theme ? theme.darkAlgorithm : theme.defaultAlgorithm, 
      token: {
        colorPrimary: '#e9c70ada',
      }
    }}>
      <AntdApp>
        <Routes>
          <Route path="/callback" element={<Callback />} />

          {user ? (
            <Route
              path="/*"
              element={
                user_role === 'learner' ? (
                  <UsersRoutes />
                ) : (
                  <NotFound />
                )
              }
            />
          ) : (
            <Route path="/" element={<Login />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}


export default App;