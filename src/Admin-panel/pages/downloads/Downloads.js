
import React from 'react';
import { Card, Tabs } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

function Downloads() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/')[2];
  const currentTab = currentPath || 'course-download';

  const tabKeyMap = {
    'course-download': '1',
    'package-download': '2',
    'livetest-download': '4',
    'quiz-download': '5',
  };

  const keyTabMap = {
    '1': 'course-download',
    '2': 'package-download',
    '4': 'livetest-download',
    '5': 'quiz-download',

  };

  // Redirect default
  React.useEffect(() => {
    if (location.pathname === '/download') {
      navigate('/download/course-download', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (key) => {
    navigate(`/download/${keyTabMap[key]}`);
  };

  const visibleTabs = ['1', '2', '4', '5'];

  return (
    <div className="lms-body">
      <Card>
        <h2>Download Report</h2>
        <Tabs activeKey={tabKeyMap[currentTab]} onChange={handleTabChange}>
          {visibleTabs.includes('1') && <TabPane tab="Course Reports" key="1" />}
          {visibleTabs.includes('2') && <TabPane tab="Package Reports" key="2" />}
          {/* {visibleTabs.includes('4') && <TabPane tab="Live Test Report" key="4" />} */}
          {visibleTabs.includes('5') && <TabPane tab="Quiz Report" key="5" />}
        </Tabs>
        <Outlet />
      </Card>
    </div>
  );
}

export default Downloads;
