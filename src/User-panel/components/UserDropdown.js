
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../../authService';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user }) => {

  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };


  // const menu = (
  //   <Menu>
  //     <Menu.Item key="username" icon={<UserOutlined />}>
  //        <span style={{textTransform:"capitalize"}} onClick={() => navigate("/setting/personal-info")}> Profile </span>
  //     </Menu.Item>
  //     <Menu.Divider />
  //     <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
  //       Logout
  //     </Menu.Item>
  //   </Menu>
  // );

   const menuItems = [
      {
        key: 'username',
        label: (
          <span style={{ textTransform: "capitalize" }}  onClick={() => navigate("/account")}>
           Account
          </span>
        ),
        icon: <UserOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ];

  return (
    <div style={{float:"right"}}>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span>Welcome, <b>{user?.profile?.name}</b></span>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Avatar style={{ backgroundColor: '#096e72', cursor: 'pointer' }} icon={<UserOutlined />} />
      </Dropdown>
    </div>
    </div>
  );
};

export default UserDropdown;
