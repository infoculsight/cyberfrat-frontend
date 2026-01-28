import { useState, useEffect } from 'react';
import {
  BellFilled,
  DashboardOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  FolderOpenFilled,
  FormOutlined,
  MailFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  ProfileFilled,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App, Button, Layout, Menu } from 'antd';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assests/CF-PPT-1.png";
import { getUser, logout } from '../../authService';
import UserDropdown from '../components/UserDropdown';

const { Header, Sider, Content } = Layout;

const MasterTemplate = () => {
  const { modal } = App.useApp()
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
      '/learners': { selected: '3', open: '2' },
      '/add-learner': { selected: '3', open: '2' },
      '/edit-learner': { selected: '3', open: '2' },
      '/learners-group': { selected: '12', open: '2' },
      '/assign-learner': { selected: '12', open: '2' },
      '/instructors': { selected: '4', open: '2' },
      '/add-instructors': { selected: '4', open: '2' },
      '/import-instructors': { selected: '4', open: '2' },
      '/courses': { selected: '6', open: '5' },
      '/add-courses': { selected: '6', open: '5' },
      '/edit-course': { selected: '6', open: '5' },
      '/course-learners': { selected: '6', open: '5' },
      '/learner-report': { selected: '6', open: '5' },
      '/packages': { selected: '7', open: '5' },
      '/add-packages': { selected: '7', open: '5' },
      '/edit-package': { selected: '7', open: '5' },
      '/media': { selected: '8' },
      '/report': { selected: '9' },
      '/download': { selected: '10' },
      '/live-test': { selected: '11', open: '5' },
      '/add-live-test': { selected: '11', open: '5' },
      '/edit-live-test': { selected: '11', open: '5' },
      '/live-test-questions': { selected: '11', open: '5' },
      '/notification': { selected: '13' },
      '/add-notification': { selected: '13', open: '13' },
      '/edit-notification': { selected: '13', open: '13' },
      '/deleted-courses': { selected: '14', open: '5' },
      '/announcment': { selected: '15', open: '15' },
      '/add-announcment': { selected: '15', open: '15' },
      '/edit-announcment': { selected: '15', open: '15' },
      '/smtp': { selected: '16', open: '16' },
      '/add-smtp': { selected: '16', open: '16' },
      '/edit-smtp': { selected: '16', open: '16' },
      '/upcoming-trainings': { selected: '17', open: '17' },
      '/add-trainings': { selected: '17', open: '17' },
      '/edit-trainings': { selected: '17', open: '17' },
      '/discussion': { selected: '18' },

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
      '3': '/learners',
      '4': '/instructors',
      '6': '/courses',
      '7': '/packages',
      '8': '/media',
      '9': '/report',
      '10': '/download',
      '11': '/live-test',
      '12': '/learners-group',
      '13': '/notification',
      '14': '/deleted-courses',
      '15': '/announcment',
      '16': '/smtp',
      '17': '/upcoming-trainings',
      '18': '/discussion',

    };

    const route = keyToPath[key];
    if (route) {
      navigate(route);
    } else if (key === '50') {
      modal.confirm({
        title: "Are you sure you want to logout?",
        okText: "Logout",
        cancelText: "Cancel",
        onOk: () => {
          logout();
        },
      });
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
      {master_loder ? (
        <>Loading...........</>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "#141414", }}>
            <div className='menu-logo'>
              <img alt="logo" src={Logo} />
            </div>

            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              onClick={handleMenuClick}
              items={[
                { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
                {
                  key: '2',
                  icon: <UserOutlined />,
                  label: 'Users',
                  children: [
                    { key: '3', label: "Learners" },
                    { key: '12', label: "Learners Group" },
                  ]
                },
                {
                  key: '5',
                  icon: <FileTextOutlined />,
                  label: 'Content',
                  children: [
                    { key: '6', label: "Courses" },
                    { key: '14', label: "Deleted Courses" },
                    { key: '7', label: "Packages" },
                    { key: '11', label: "Live Test" },

                  ]
                },
                { key: '8', icon: <ProfileFilled />, label: 'Media' },
                { key: '17',icon: <FolderOpenFilled />, label: 'Upcoming Trainings' },
                { key: '9', icon: <FileSearchOutlined />, label: 'Report' },
                { key: '10', icon: <DownloadOutlined />, label: 'Download' },
                { key: '13', icon: <BellFilled />, label: 'Notification' },
                { key: '15', icon: <NotificationOutlined />, label: 'News' },
                { key: '16', icon: <MailFilled />, label: 'SMTP' },
                { key: '18', icon: <FormOutlined />, label: 'Discussion Form' },
                { key: '50', icon: <UploadOutlined />, label: 'Logout' },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: '0',
                backgroundColor: '#141414',
              }}
            >
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
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                Admin Panel
              </span>
              <UserDropdown user={user} />
            </Header>
            <Content style={{ backgroundColor: "#2c2c2c" }}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default MasterTemplate;