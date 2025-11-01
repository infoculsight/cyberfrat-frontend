
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../../authService';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user }) => {


  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      key: 'username',
      label: (
        <span style={{ textTransform: "capitalize" }} onClick={() => navigate("/account")}>
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
    <div style={{ float: "right" }}>
      <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Welcome, <b style={{textTransform:"capitalize"}}>{user?.user_info?.name}</b></span>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Avatar style={{ backgroundColor: '#e9c70ada', cursor: 'pointer' }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default UserDropdown;
