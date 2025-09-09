import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../../authService';

const UserDropdown = ({ user }) => {
  const handleLogout = () => {
    logout();
  };

  console.log(user)

  const menu = (
    <Menu>
      <Menu.Item key="username" icon={<UserOutlined />} disabled>
         <span style={{textTransform:"capitalize"}}> {user?.profile?.name || 'User'}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{float:"right"}}>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: "#fff" }}>Welcome, <b>{user?.profile?.name}</b></span>
      <Dropdown overlay={menu} trigger={['click']}>
        <Avatar style={{ backgroundColor: '#096e72', cursor: 'pointer' }} icon={<UserOutlined />} />
      </Dropdown>
    </div>
    </div>
  );
};

export default UserDropdown;
