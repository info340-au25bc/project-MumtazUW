import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/notification.css";

const initialNotifications = [
  {
    id: 1,
    type: "New task added",
    text: "Redesign login page",
    time: "2h ago",
    status: "unread",
    category: "New Tasks",
  },
  {
    id: 2,
    type: "Task completed",
    text: "API Integration",
    time: "4h ago",
    status: "unread",
    category: "Completed Tasks",
  },
  {
    id: 3,
    type: "Task in progress",
    text: "UI polish for dashboard",
    time: "1d ago",
    status: "unread",
    category: "In Progress",
  },
  {
    id: 4,
    type: "Comment added",
    text: "Need to review milestones.",
    time: "2d ago",
    status: "unread",
    category: "All",
  },
  {
    id: 5,
    type: "New task added",
    text: "Set up automated testing",
    time: "3d ago",
    status: "unread",
    category: "New Tasks",
  },
  {
    id: 6,
    type: "Task completed",
    text: "Fix bug in payment gateway",
    time: "5d ago",
    status: "unread",
    category: "Completed Tasks",
  },
  {
    id: 7,
    type: "Comment added",
    text: "Discuss deployment strategy with team",
    time: "6d ago",
    status: "unread",
    category: "All",
  },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [filter, setFilter] = useState("All");

  // Delete a single notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, status: "read" }))
    );
  };

  // Sort based on initial array order
  const sortedNotifications =
    sortOrder === "Newest" ? [...notifications] : [...notifications].reverse();

  // Apply filtering
  const filteredNotifications =
    filter === "All"
      ? sortedNotifications
      : sortedNotifications.filter((n) => n.category === filter);

  return (
    <div className="notifications-page">
      <header className="header">
        <h1>Notifications</h1>
      </header>

      <aside className="sidebar" aria-label="Primary navigation">
        <h2>Navigation</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Project Overview</NavLink>
            </li>
            <li>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li>
              <NavLink to="/roadmap">Roadmap</NavLink>
            </li>
            <li>
              <NavLink to="/backlog">Tasks and Backlog</NavLink>
            </li>
            <li>
              <NavLink to="/notifications" className="active">
                Notifications
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="notifications-container">
        <div className="notification-controls">
          <button className="mark-read" onClick={markAllAsRead}>
            Mark all as read
          </button>

          <div className="filters">
            <label htmlFor="sort">Sort:</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>

            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Completed Tasks</option>
              <option>In Progress</option>
              <option>New Tasks</option>
            </select>
          </div>
        </div>

        <section className="notification-list">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification ${n.status === "unread" ? "unread" : ""}`}
            >
              <div className="icon"></div>
              <div className="content">
                <p>
                  <strong>{n.type}:</strong> {n.text}
                </p>
                <span className="time">{n.time}</span>
              </div>
              <div className="notification-buttons">
                <button
                  className="delete-btn"
                  onClick={() => deleteNotification(n.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredNotifications.length === 0 && <p>No notifications found.</p>}
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Luna Health Product Dashboard | INFO 340 Project</p>
      </footer>
    </div>
  );
}

export default NotificationsPage;