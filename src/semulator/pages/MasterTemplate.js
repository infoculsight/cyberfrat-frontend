import { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  MailFilled,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PicRightOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu } from 'antd';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assests/CF-PPT-1.png";
import { getUser, logout } from '../../authService';
import UserDropdown from '../components/UserDropdown';

const { Header, Sider, Content } = Layout;

const MasterTemplate = () => {

  const [user, setUser] = useState(null);
  const [master_loder, set_master_loder] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    getUser().then(usr => {
      setUser(usr);
      set_master_loder(false)
    });
  }, []);


  useEffect(() => {

  const pathToKey = {
    '/': { selected: '1' },
     '/smtp': { selected: '2', open: '2' },
    '/add-smtp': { selected: '2', open: '2' },
    '/edit-smtp': { selected: '2', open: '2' },
    '/users': { selected: '4', open: '3' },
    '/add-user': { selected: '3', open: '3' },
    '/edit-user': { selected: '3', open: '3' },
    '/imported-users': { selected: '5', open: '3' },
    '/user-group': { selected: '6', open: '6' },
    '/assign-user': { selected: '6', open: '6' },
    '/learners-group':{selected: '7',open:'7'},
    '/assign-learner':{selected: '7',open:'7'},
    '/email-template': { selected: '8', open: '8' },
    '/add-email': { selected: '8', open: '8' },
    '/landing-page': { selected: '9', open: '9' },
    '/add-landingpage': { selected: '9', open: '9' },
    '/edit-landingpage': { selected: '9', open: '9' },
    '/campaign': { selected: '10', open: '10' },
    '/add-campaign': { selected: '10', open: '10' },
    '/view-campaign': { selected: '10', open: '10' },
    '/tool-setting': { selected: '50', open: '50' },
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
  }, [location.pathname]);


  const handleMenuClick = ({ key }) => {
    const keyToPath = {
      '1': '/',
      '2': '/smtp',
      '4': '/users',
      '5':'/imported-users',
      '6': '/user-group',
      '7':'/learners-group',
      '8': '/email-template',
      '9': '/landing-page',
      '10': '/campaign',
      '50':'/tool-setting'
    };

    const route = keyToPath[key];
    if (route) {
      navigate(route);
    } else if (key === '50') {
      logout()
    }
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  if (!user) {
    return <Navigate path="/" />
  }

  return (
    <>
     <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#FFD700",  // Gold
              colorBgBase: "#000000",   // Black
              colorText: "#FFD700",
              colorBorder: "#FFD700",
            },
            components: {
              Menu: {
                itemBg: "#000000",
                itemColor: "#FFD700",
                itemHoverColor: "#e6c200",
                itemSelectedBg: "#FFD700",
                itemSelectedColor: "#000000",
              },
              Button: {
                colorPrimary: "#FFD700",
                colorPrimaryHover: "#e6c200",
                colorPrimaryActive: "#bfa200",
                colorTextLightSolid: "#000000",
              },
            },
          }}
        >
      {master_loder ? <>
        Loading...........
      </> : <>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={collapsed}  style={{ background: "#000000" }}>
            <div className='menu-logo'>
              <img alt="logo" src={Logo} />
            </div>

            <Menu
              // theme="dark"
              
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              onClick={handleMenuClick}
              items={[
                {
                  key: '1',
                  icon: <DashboardOutlined />,
                  label: 'Dashboard',
                },
                {
                  key: '2',
                  icon: <MailFilled />,
                  label: 'SMTP',
                },
                {
                  key: '3',
                  icon: <UserOutlined />,
                  label: 'Users',
                  children: [
                    { key: '4', label: "Users" },
                    { key: '5', label: "Imported Users" }
                  ]
                },
                {
                  key: '6',
                  icon: <UserOutlined />,
                  label: 'Users Group',
                },
                  {
                  key: '7',
                  icon: <UserOutlined />,
                  label: 'Learners Group',
                },
                {
                  key: '8',
                  icon: <MailOutlined />,
                  label: 'Email Template',
                },
                {
                  key: '9',
                  icon: <PicRightOutlined />,
                  label: 'Landing Page',
                },
                {
                  key: '10',
                  icon: <SecurityScanOutlined />,
                  label: 'Campaign',
                },
                 {
                  key: '50',
                  icon: <SecurityScanOutlined />,
                  label: 'Tool Setting',
                },

              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: '0',
                backgroundColor: '#000000',
              }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                  color: '#fff',
                }}
              />
               <span style={{fontWeight:"bold", fontSize:"20px"}}>Phishing Tool</span>
              <UserDropdown user={user} />
            </Header>
            <Content style={{ backgroundColor: "#2c2c2c" }}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </>}
      </ConfigProvider>
    </>
  );
};

export default MasterTemplate;
