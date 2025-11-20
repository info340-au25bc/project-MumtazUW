import { Routes, Route, NavLink } from 'react-router-dom';
import ProjectOverviewPage from './Luna_Pages/ProjectOverviewPage';
import ProjectsPage from './Luna_Pages/ProjectsPage';
import BacklogPage from './Luna_Pages/BacklogPage';
import RoadmapPage from './Luna_Pages/RoadmapPage';
import NotificationsPage from './Luna_Pages/NotificationsPage';
import SignupPage from './Luna_Pages/SignupPage';
function App() {
  return (
    <div>
      <nav style={{ padding: '0.5rem 1rem', backgroundColor: '#eee' }}>
        <NavLink to="/" style={{ marginRight: '1rem' }}>Overview</NavLink>
        <NavLink to="/projects" style={{ marginRight: '1rem' }}>Projects</NavLink>
        <NavLink to="/backlog" style={{ marginRight: '1rem' }}>Backlog</NavLink>
        <NavLink to="/roadmap" style={{ marginRight: '1rem' }}>Roadmap</NavLink>
        <NavLink to="/notifications" style={{ marginRight: '1rem' }}>Notifications</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectOverviewPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/backlog" element={<BacklogPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}
export default App;
