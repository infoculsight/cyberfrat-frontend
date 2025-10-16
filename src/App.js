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
        <Route path="/" element={<Login />} />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
