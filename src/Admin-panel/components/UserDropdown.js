
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../../authService';

const UserDropdown = ({ user }) => {
  const handleLogout = () => {
    logout();
  };


  // const menu = (
  //   <Menu>
  //     <Menu.Item key="username" icon={<UserOutlined />} disabled>
  //        <span style={{textTransform:"capitalize"}}> {user?.profile?.name || 'User'}</span>
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
        <span style={{ textTransform: "capitalize",color:"#FFC93F" }}>
          {user?.profile?.name || 'User'}
        </span>
      ),
      icon: <UserOutlined />,
      disabled: true,
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
      <span style={{ color: "#fff" }}>Welcome, <b>{user?.profile?.name}</b></span>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Avatar style={{ backgroundColor: '#FFD700',color:"black", cursor: 'pointer' }} icon={<UserOutlined />} />
      </Dropdown>
    </div>
    </div>
  );
};

export default UserDropdown;


// overlay={menu}