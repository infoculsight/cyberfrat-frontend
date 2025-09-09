import { Badge, Button, Drawer, List, message } from 'antd';
import { useEffect, useState } from 'react';
import { BellFilled, CloseOutlined } from "@ant-design/icons";
import { VIEW_NOTIFICATION, REMOVE_NOTIFICATION, ALL_REMOVE_NOTIFICATION } from '../apis/apis';
import CulsightPageLoader from './CulsightPageLoader';
 
function UserNotification() {
  const [open, set_open] = useState(false);
  const [notifications, set_notifications] = useState([]);
  const [loading, set_loading] = useState(false);
 
  const show_drawer = () => {
    set_open(true);
    //LIST_API();
  };
 
  const on_close = () => set_open(false);
 

  const remove_notification = async (id) => {
    try {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", id); 
 
      const API_CALL = await REMOVE_NOTIFICATION(FORM_DATA);
 
      if (API_CALL?.data?.status) {
        set_notifications(prev => prev.filter(item => item.id !== id));
        message.success("Notification removed");
      } else {
        message.error("Failed to remove notification");
      }
    } catch (error) {
      console.error(error);
      message.error("Error removing notification");
    }
  };


  const clear_all_notifications = async () => {
    try {
      const FORM_DATA = new FormData();
      const API_CALL = await ALL_REMOVE_NOTIFICATION(FORM_DATA);
 
      if (API_CALL?.data?.status) {
        set_notifications([]);
        message.success("All notifications cleared");
      } else {
        message.error("Failed to clear notifications");
      }
    } catch (error) {
      console.error(error);
      message.error("Error clearing notifications");
    }
  };
 
  const LIST_API = async () => {
    try {
      set_loading(true);
      const FORM_DATA = new FormData();
      const API_CALL = await VIEW_NOTIFICATION(FORM_DATA);
 
      if (API_CALL?.data?.status) {
        set_notifications(API_CALL?.data?.data || []);
      } else {
        message.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching notifications");
    } finally {
      set_loading(false);
    }
  };
   useEffect(() => {
    LIST_API();
  }, []);

  return (
    <div>
      <Badge count={notifications.length} style={{ marginRight: "8px" }}>
        <BellFilled
          onClick={show_drawer}
          style={{ fontSize: "25px", marginRight: "10px", cursor: "pointer" }}
        />
      </Badge>
 
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Notification</strong>
            <Button
              type='link'
              onClick={clear_all_notifications}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </div>
        }
        placement="right"
        onClose={on_close}
        open={open}
        width={400}
      >
        {loading ? (
          <CulsightPageLoader />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={notifications}
            locale={{ emptyText: "No notifications" }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{item.title} - <span style={{color:"orange"}}>{item?.meta?.title}</span></strong>
                      <Button
                        type='text'
                        icon={<CloseOutlined />}
                        onClick={() => remove_notification(item.id)}
                      />
                    </div>
                  }
                  description={item.notification_text}
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
}
 
export default UserNotification;
 
 