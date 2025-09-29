import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Routes, Route } from "react-router-dom";
import Login from "./Admin-panel/pages/Login";
import NotFound from "./Admin-panel/pages/NotFound";
import { getUser, logout } from './authService';
import Callback from "./Callback";
import './App.css'
import UsersRoutes from "./Routes/UsersRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import { jwtDecode } from "jwt-decode";
import SemulatorRoutes from "./Routes/SemulatorRoutes";
// import EmailTracking from "./semulator/pages/EmailTracking";
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
        } else if (panelRoles.includes('phishing_user')) {
          set_user_role('phishing_user');
          //  parseInt(local_theme) === 0 ? set_balck_theme(false) : set_balck_theme(true)
        } else if (panelRoles.includes('learner')) {
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
    // <ConfigProvider theme={{ algorithm: balck_theme ? theme.darkAlgorithm :  theme.defaultAlgorithm }}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FFD700",   // Gold
          colorBgBase: "#000000",    // Black background
          colorText: "#FFD700",      // Gold text
          borderRadius: 8,
          colorIcon: "#FFD700",      // 👈 All icons gold
          colorIconHover: "#e6c200",
        },
        components: {
          Button: {
            colorPrimary: "#FFD700",
            colorPrimaryHover: "#e6c200",
            colorPrimaryActive: "#bfa200",
            colorTextLightSolid: "#000000",
            colorTextDisabled: "#a49124c6" // black text inside button
          },
          Menu: {
            itemBg: "#000000",
            itemColor: "#FFD700",
            itemHoverColor: "#e6c200",
            itemSelectedColor: "#000000",
            itemSelectedBg: "#FFD700",
          },
          Table: {
            headerBg: "#141414",
            headerColor: "#FFD700",
            borderColor: "#FFD700",
            colorText: "#FFD700",
            headerSplitColor: "#FFD700",
          },
          Card: {
            colorBorder: "#FFD700",
            colorText: "#FFD700",
            colorBgContainer: "#0d0d0d",
          },
          Pagination: {
            colorPrimary: "#FFD700",
            colorPrimaryHover: "#FFC93F",
            itemActiveBg: "#333333",
            itemBg: "#000000",
            itemInputBg: "#1a1a1a",
            colorText: "#FFD700",
            colorBorder: "#FFD700",
            colorIcon: "#FFD700",
            colorIconHover: "#FFC93F",
            colorIconDisabled: "#FFC93F"
          },
          Tag: {
            colorText: "#FFD700",
            colorBorder: "#FFD700",
            colorBgContainer: "#000000",
            colorFill: "#FFD700",
            colorbg:"#84762577"
          },
          Input: {
            colorTextPlaceholder: "#fff", // ensure input placeholder gold
            activeBorderColor: "#FFD700",    // focus border gold
          },
          Select: {
            colorText: "#FFD700",              // normal gold text
            colorTextPlaceholder: "#FFD700",   // placeholder gold
            optionSelectedBg: "#FFD700",       // selected option bg gold
            optionSelectedColor: "#000000",    // selected text black
            selectorBg: "#000000",             // dropdown bg black
            activeBorderColor: "#FFD700",
            hoverBorderColor: "#e6c200",
            colorIconDisabled: "#FFD700",
            colorTextDisabled: "#9b8714ff",
            colorIcon: "#FFD700",        // 👈 dropdown arrow gold
            colorIconHover: "#e6c200",   // hover पर थोड़ा dark gold
          },
          Avatar: {
            colorText: "#000000",
            colorBg: "#FFD700", // Avatar background Gold
            colorBorder: "#FFD700",
          },
        },
      }}
    >
      <AntdApp>
        <Routes>
          <Route path="/callback" element={<Callback />} />

          {user ? (
            <Route
              path="/*"
              element={
                user_role === 'portal_admin' ? (
                  <AdminRoutes />
                ) : user_role === 'phishing_user' ? (
                  <SemulatorRoutes />
                ) : user_role === 'learner' ? (
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