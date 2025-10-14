import React, { useState, useEffect } from "react";
import {
  AccountBookOutlined,
  DashboardOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingFilled,
  UploadOutlined
} from "@ant-design/icons";
import { App, Button, Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assests/CFGold_Logo.png";
import { getUser, logout } from '../../authService';
import UserDropdown from '../components/UserDropdown';
import ThemeSetting from "../components/ThemeSetting";
import UserNotification from "../components/UserNotification";
import CulsightPageLoader from "../components/CulsightPageLoader";

const { Header, Sider, Content } = Layout;

const MasterTemplate = () => {
  const { modal } = App.useApp();
  const [user, setUser] = useState(null);
  const [master_loder, set_master_loder] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [balck_theme, set_balck_theme] = useState(true)


  useEffect(() => {

    getUser().then(usr => {
      setUser(usr);
      set_master_loder(false)
    });
  }, []);

  useEffect(() => {

    const pathToKey = {
      "/": { selected: "1" },
      "/courses": { selected: "2",open:"2" },
      "/view-course":{selected:"2",open:"2"},
      "/packages": { selected: "3",open:"3" },
      "/all-packages": {selected:"4",open:"4"},
      "/account": { selected: "7",oepn:"7" },
     
    };

    const path = location.pathname;
    const match = pathToKey[path];
    if (match) {
      setSelectedKeys([match.selected]);
      if (match.open) {
        setOpenKeys([match.open]);
      } else {
        setOpenKeys([]);
      }
    }
    const local_theme = localStorage.getItem("dark_theme")
    parseInt(local_theme) === 0 ? set_balck_theme(false) : set_balck_theme(true)
  }, [location.pathname]);

  const handleMenuClick = ({ key }) => {
    const keyToPath = {
      1: "/",
      2: "courses",
      3: "packages",
      4:"all-packages",
      7: "/account"
    };

    const route = keyToPath[key];

    if (key === "50") {
      modal.confirm({
        title: "Are you sure you want to logout?",
        okText: "Logout",
        cancelText: "Cancel",
        onOk: () => {
          logout();
        },
      });
    } else if (route) {
      navigate(route);
    }
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      {master_loder ? <>
        <CulsightPageLoader />
      </> : <>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={balck_theme ? { background: "#141414" } : {background: "#fff"}}
          >
            <div className="menu-logo" style={{marginTop:"20px"}}>
              <img alt="logo" src={Logo} />
            </div>

            <Menu
              style={{marginTop:"40px"}}
              className="gold-menu"
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              onClick={handleMenuClick}
              items={[
                {
                  key: "1",
                  icon: <HomeOutlined />,
                  label: "Dashboard",
                },
                {
                  key: "2",
                  icon: <DashboardOutlined />,
                  label: "My Courses",
                },
                {
                  key: "3",
                  icon: <AccountBookOutlined />,
                  label: "My Packages",
                },
                {
                  key: "4",
                  icon: <AccountBookOutlined />,
                  label: "All Packages",
                },
                // {
                //   key: "4",
                //   icon: <SnippetsOutlined />,
                //   label: "LiveTest Report",
                // },
                // {
                //   key: "5",
                //   icon: <SnippetsOutlined />,
                //   label: "QuizTest Report",
                // },
                // {
                //   key: "6",
                //   icon: <HeartOutlined />,
                //   label: "Wishlist",
                // },
                {
                  key: "7",
                  icon: <SettingFilled />,
                  label: "Account",
                },
                {
                  key: "50",
                  icon: <UploadOutlined />,
                  label: "Logout",
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={balck_theme ? {
                padding: "0",
                backgroundColor: "#141414",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              } : {
                padding: "0",
                 backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                    color: balck_theme ?"#fff" : "#141414",
                  }}
                />
                <span style={{ fontWeight: "bold", fontSize: "20px" }}>Learner Panel</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                  <ThemeSetting set_theme_style={set_balck_theme} />

                </div>
                <UserNotification />
                <UserDropdown user={user} />

              </div>
            </Header>
            <Content style={balck_theme ? { backgroundColor: "#000000" } : {}}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </>}
    </>
  );
};

export default MasterTemplate;
