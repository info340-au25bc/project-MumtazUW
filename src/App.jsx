import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ProjectOverviewPage from './Luna_Pages/ProjectOverviewPage';
import ProjectsPage from './Luna_Pages/ProjectsPage';
import BacklogPage from './Luna_Pages/BacklogPage';
import RoadmapPage from './Luna_Pages/RoadmapPage';
import NotificationsPage from './Luna_Pages/NotificationsPage';
import SignupPage from './Luna_Pages/SignupPage';
import ProfilePage from "./Luna_Pages/ProfilePage.jsx";
import HomePage  from './Luna_Pages/Homepage.jsx';

function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<ProjectOverviewPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/backlog" element={<BacklogPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
