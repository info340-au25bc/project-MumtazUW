import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/notification.css';

function NotificationsPage() {
  return (
    <div className="notifications-page">

      {/* Header */}
      <header className="header">
        <h1>Notifications</h1>

        <nav className="nav">
          <NavLink to="/">Projects Overview</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/backlog">Backlog</NavLink>
          <NavLink to="/roadmap">Roadmap</NavLink>
          <NavLink to="/notifications" className="active">
            Notification
          </NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="notifications-container">

        {/* Top Controls Row */}
        <div className="notification-controls">
          <button className="mark-read">Mark all as read</button>

          <div className="filters">
            {/* Sort */}
            <label htmlFor="sort">Sort:</label>
            <select id="sort">
              <option>Newest</option>
              <option>Oldest</option>
            </select>

            {/* Filter */}
            <label htmlFor="filter">Filter:</label>
            <select id="filter">
              <option>All</option>
              <option>Completed Tasks</option>
              <option>In Progress</option>
              <option>New Tasks</option>
            </select>
          </div>
        </div>

        {/* Notification List */}
        <section className="notification-list">

          {/* Notification 1 */}
          <div className="notification unread">
            <div className="icon">{/* SVG icons go here later */}</div>

            <div className="content">
              <p><strong>New task added:</strong> “Redesign login page”</p>
              <span className="time">2h ago</span>
            </div>

            <div className="notification-buttons">
              <button className="archive-btn">Archive</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="notification">
            <div className="icon"></div>

            <div className="content">
              <p><strong>Task completed:</strong> “API Integration”</p>
              <span className="time">1d ago</span>
            </div>

            <div className="notification-buttons">
              <button className="archive-btn">Archive</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Notification 3 */}
          <div className="notification unread">
            <div className="icon"></div>

            <div className="content">
              <p><strong>Task in progress:</strong> “UI polish for dashboard”</p>
              <span className="time">3d ago</span>
            </div>

            <div className="notification-buttons">
              <button className="archive-btn">Archive</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Notification 4 */}
          <div className="notification">
            <div className="icon"></div>

            <div className="content">
              <p><strong>Comment added:</strong> “Need to review milestones.”</p>
              <span className="time">5d ago</span>
            </div>

            <div className="notification-buttons">
              <button className="archive-btn">Archive</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Luna Health Product Dashboard | INFO 340 Project</p>
      </footer>
    </div>
  );
}

export default NotificationsPage;
