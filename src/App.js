import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Routes, Route } from "react-router-dom";
import Login from "./Admin-panel/pages/login/Login";
import NotFound from "./Admin-panel/pages/NotFound";
import { getUser } from './authService';
import './App.css'
import AdminRoutes from "./Routes/AdminRoutes";
import CulsightPageLoader from "./Admin-panel/components/CulsightPageLoader";
 
function App() {
  const [user, setUser] = useState(null);
  const [user_role, set_user_role] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [black_theme, set_black_theme] = useState(1);
 
  // ✅ Theme load from localStorage
  useEffect(() => {
   
    if (localStorage.getItem("dark_theme")) {
      const local_theme = localStorage.getItem("dark_theme");
      set_black_theme(local_theme);
    } else {
      set_black_theme('dark');
      localStorage.setItem("dark_theme", 'dark');
    }
  }, []);
 
  // ✅ User auth check
  useEffect(() => {
    (async () => {
   
      const u = await getUser();
      if (u) {
        setUser(u);
        if(u.user_info.admin){
           set_user_role("portal");
        }
       
        setCheckingAuth(false);
      }else{
        setCheckingAuth(false);
      }
   
    })();
  }, []);
 
 
  if (checkingAuth) return <CulsightPageLoader />;
 
  return (
    <ConfigProvider theme={{ algorithm: black_theme ? theme.darkAlgorithm :  theme.defaultAlgorithm }}>
      <AntdApp>
        <Routes>
          {user ? (
            <Route
              path="/*"
              element={ <AdminRoutes />}
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
 