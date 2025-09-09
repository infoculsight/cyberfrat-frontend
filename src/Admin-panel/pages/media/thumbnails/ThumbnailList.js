
import React from 'react'
import { Tabs } from "antd";
import MediaImages from "./MediaImages";

const { TabPane } = Tabs;
function ThumbnailList() {
  
  return (
    <div>
      <Tabs defaultActiveKey="course" type="card">


              <TabPane tab="User Media" key="user-media">
                <MediaImages folder_name="user_images" />
              </TabPane>

              <TabPane tab="Course Media" key="course-media">
                <MediaImages folder_name="course_images" />
              </TabPane>

              <TabPane tab="Chapter Media" key="chapter-media">
                <MediaImages folder_name="chapter_images" />
              </TabPane>

              <TabPane tab="Assingment Media" key="assingment-media">

                Image media list goes here.
              </TabPane>
              <TabPane tab="Section Media" key="section-media">
                <MediaImages folder_name="section_images" />
              </TabPane> 

      </Tabs>

    </div>
  )
}

export default ThumbnailList;
