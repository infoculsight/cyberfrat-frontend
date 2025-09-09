import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MasterTemplate from '../semulator/pages/MasterTemplate'
import Dashboard from '../semulator/pages/Dashboard'
import Smtp from '../semulator/pages/smtp/Smtp'
import AddSmtp from '../semulator/pages/smtp/AddSmtp'
import EditSmtp from '../semulator/pages/smtp/EditSmtp'
import UserGroup from '../semulator/pages/user-group/UserGroup'
import AssignUser from '../semulator/pages/user-group/AssignUser'
import EmailList from '../semulator/pages/email-template/EmailList'
import AddEmail from '../semulator/pages/email-template/AddEmail'
import EditEmail from '../semulator/pages/email-template/EditEmail'
import LandingPage from '../semulator/pages/landing-page/LandingPage'
import AddLandingPage from '../semulator/pages/landing-page/AddLandingPage'
import EditLandingPage from '../semulator/pages/landing-page/EditLandingPage'
import Campaign from '../semulator/pages/campaign/Campaign'
import AddCampaign from '../semulator/pages/campaign/AddCampaign'
import Users from '../semulator/pages/users/Users'
import AddUsers from '../semulator/pages/users/AddUsers'
import EditUser from '../semulator/pages/users/EditUser'
import ViewCampaign from '../semulator/pages/campaign/ViewCampaign'
import ImportedUsers from '../semulator/pages/users/ImportedUsers'
import ToolSetting from '../semulator/pages/tool-setting/ToolSetting'
import LmsLearnersGroup from '../semulator/pages/learners-group/LmsLearnersGroup'

function SemulatorRoutes() {
  return (
   <Routes>
      <Route path="/" element={<MasterTemplate />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users/>} />
        <Route path="imported-users/:tracking_id?" element={<ImportedUsers/>} />
        <Route path="add-user" element={<AddUsers />} />
        <Route path="edit-user/:id" element={<EditUser />} />
        <Route path="user-group" element={<UserGroup />} />
        <Route path="assign-user/:id" element={<AssignUser />} />
        <Route path="learners-group" element={<LmsLearnersGroup />} />
        <Route path="email-template" element={<EmailList />} />
        <Route path="add-email" element={<AddEmail />} />
        <Route path="edit-email/:id" element={<EditEmail />} />
        <Route path="landing-page" element={<LandingPage />} />
        <Route path="add-landingpage" element={<AddLandingPage />} />
        <Route path="edit-landingpage/:id" element={<EditLandingPage />} />
        <Route path="smtp" element={<Smtp />} />
        <Route path="add-smtp" element={<AddSmtp />} />
        <Route path="edit-smtp/:id" element={<EditSmtp />} />
        <Route path="campaign" element={<Campaign />} />
        <Route path="add-campaign" element={<AddCampaign />} />
        <Route path="view-campaign/:id" element={<ViewCampaign />} />
        <Route path="tool-setting" element={<ToolSetting />} />
      </Route>
    </Routes>
  )
}

export default SemulatorRoutes
