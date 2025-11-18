import React, { useState, useEffect } from "react";
import {
  AccountBookOutlined,
  DashboardOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingFilled,
  SnippetsOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { App, Button, Layout, Menu, Grid, Drawer, Row, Col, Dropdown } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assests/CFGold_Logo.png";
import { getUser, logout } from '../../authService';
import UserDropdown from '../components/UserDropdown';
import ThemeSetting from "../components/ThemeSetting";
import UserNotification from "../components/UserNotification";
import CulsightPageLoader from "../components/CulsightPageLoader";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MasterTemplate = () => {
  const { modal } = App.useApp();
  const [user, setUser] = useState(null);
  const [master_loder, set_master_loder] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [balck_theme, set_balck_theme] = useState(true);

  // responsive hook
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
      set_master_loder(false);
    } else {
      getUser().then(usr => {
        setUser(usr);
        set_master_loder(false);
        localStorage.setItem("user", JSON.stringify(usr));
      });
    }
  }, []);

  useEffect(() => {
    const pathToKey = {
      "/": { selected: "1" },
      "/courses": { selected: "2", open: "2" },
      "/view-course": { selected: "2", open: "2" },
      "/packages": { selected: "3", open: "3" },
      "/all-packages": { selected: "4", open: "4" },
      "/account": { selected: "7", open: "7" },
      "/list-live-test": { selected: "8", open: "8" },
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

    const local_theme = localStorage.getItem("dark_theme");
    local_theme === 'dark' ? set_balck_theme(1) : set_balck_theme(0);
  }, [location.pathname]);

  const handleMenuClick = ({ key }) => {
    const keyToPath = {
      1: "/",
      2: "courses",
      3: "packages",
      4: "all-packages",
      7: "/account",
      8: "/list-live-test"
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
      if (isMobile) setCollapsed(true); // mobile par navigate hone ke baad menu close
    }
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const menuItems = [
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
    {
      key: "8",
      icon: <SnippetsOutlined />,
      label: "Live Test",
    },
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
  ];

  return (
    <>
      {master_loder ? (
        <CulsightPageLoader />
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          {isMobile ? (
            <Drawer
              placement="left"
              open={!collapsed}
              onClose={() => setCollapsed(true)}
              bodyStyle={{ padding: 0 }}
              width={220}
              style={{
                backgroundColor: balck_theme ? "#141414" : "#fff",
              }}
            >
              <div className="menu-logo" style={{ margin: "20px 0", textAlign: "center" }}>
                <img alt="logo" src={Logo} style={{ width: "120px" }} />
              </div>
              <Menu
                className="gold-menu"
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                onClick={handleMenuClick}
                items={menuItems}
              />
            </Drawer>
          ) : (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              onCollapse={(v) => setCollapsed(v)}
              breakpoint="md"
              collapsedWidth={isMobile ? 0 : 80}
              style={balck_theme ? { background: "#141414" } : { background: "#fff" }}
            >
              <div className="menu-logo" style={{ marginTop: "20px" }}>
                <img alt="logo" src={Logo} />
              </div>

              <Menu
                style={{ marginTop: "40px" }}
                className="gold-menu"
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                onClick={handleMenuClick}
                items={menuItems}
              />
            </Sider>
          )}

          <Layout>
            <Header
              style={
                balck_theme
                  ? {
                    padding: "0 10px",
                    backgroundColor: "#141414",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
                  : {
                    padding: "0 10px",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
              }
            >

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 48,
                    height: 48,
                    color: balck_theme ? "#fff" : "#141414",
                  }}
                />
                {!isMobile && (
                  <span style={{ fontWeight: "bold", fontSize: "20px" }}>Learner Panel</span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                {!isMobile && <ThemeSetting set_theme_style={set_balck_theme} />}


                <UserNotification />


                {!isMobile && <UserDropdown user={user} />}

                {isMobile && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={["click"]}
                    dropdownRender={() => (
                      <div
                        style={{
                          padding: "12px",
                          background: balck_theme ? "#222121ff" : "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          borderRadius: 8,
                          width: 220,
                        }}
                      >
                        <Row gutter={[12, 12]} justify="center">
                          <Col span={24}>
                            <ThemeSetting set_theme_style={set_balck_theme} />
                          </Col>
                          <Col span={24}>
                            <UserDropdown user={user} />
                          </Col>
                        </Row>
                      </div>
                    )}
                  >
                    <Button
                      type="text"
                      icon={<SettingFilled />}
                      style={{
                        color: balck_theme ? "#fff" : "#141414",
                      }}
                    />
                  </Dropdown>
                )}
              </div>
            </Header>

            <Content
              style={
                balck_theme
                  ? { backgroundColor: "#000000" }
                  : { backgroundColor: "#e6e6e6ff" }
              }
            >
              <Outlet context={{ user, setUser }} />
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default MasterTemplate;
