import React from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { Card, Tabs } from 'antd'

function ListDiscussion() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    {
      key: 'city',
      label: 'City',
    },
    {
      key: 'topic',
      label: 'Topic',
    },
  ]

  // active tab route se decide hoga
  const activeKey = location.pathname.includes('topic') ? 'topic' : 'city'

  return (
    <div className="lms-body">
      <Card>
        <h2>Discussion</h2>

        <Tabs
          activeKey={activeKey}
          items={items}
          onChange={(key) => navigate(key)}
        />

        <Outlet />
      </Card>
    </div>
  )
}

export default ListDiscussion
