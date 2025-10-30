import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme, message } from "antd";
import { Routes, Route } from "react-router-dom";
import NotFound from "./User-panel/pages/NotFound";
import "./App.css";
import UsersRoutes from "./Routes/UsersRoutes";
import { getUser, logout } from "./authService";
import Login from "./User-panel/pages/login/Login";
import CulsightPageLoader from "./User-panel/components/CulsightPageLoader";
import ForgetPassword from "./User-panel/pages/login/ForgetPassword";
import ResetPassword from "./User-panel/pages/login/ResetPassword";
import ResetPasswordMessage from "./User-panel/pages/login/ResetPasswordMessage";
import VerifyEmail from "./User-panel/pages/login/VerifyEmail";

function App() {
  const [user, setUser] = useState(null);
  const [user_role, set_user_role] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [black_theme, set_black_theme] = useState(true);

  // ✅ Theme load from localStorage
  useEffect(() => {
    const local_theme = localStorage.getItem("dark_theme");
    if (local_theme !== null) {
      set_black_theme(parseInt(local_theme) === 1);
    } else {
      set_black_theme(true);
      localStorage.setItem("dark_theme", 1);
    }
  }, []);

  // ✅ User auth check
  useEffect(() => {
    (async () => {
      setCheckingAuth(true);
      const u = await getUser();
      if (u) {
        setUser(u);
        set_user_role("learner");
      }
      setCheckingAuth(false);
    })();
  }, []);


  if (checkingAuth) return <CulsightPageLoader />;

  return (
    <ConfigProvider
      theme={{
        algorithm: black_theme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#e9c70ada" },
      }}
    >
      <AntdApp>
        <Routes>
          {user ? (
            <Route
              path="/*"
              element={
                <UsersRoutes
                  black_theme={black_theme}
                  set_black_theme={set_black_theme}
                />
              }
            />
          ) : (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route
                path="/reset-password-message"
                element={<ResetPasswordMessage />}
              />
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
