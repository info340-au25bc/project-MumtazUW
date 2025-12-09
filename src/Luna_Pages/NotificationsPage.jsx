import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "../main"; // make sure your Firebase app & DB are initialized here
import "../css/notification.css";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [filter, setFilter] = useState("All");

  // ========= Load notifications from Firebase =========
  useEffect(() => {
    const notificationsRef = ref(db, "notifications");
    return onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array with id
        const notifArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setNotifications(notifArray);
      } else {
        setNotifications([]);
      }
    });
  }, []);

  // ========= Delete a single notification =========
  const deleteNotification = (id) => {
    remove(ref(db, `notifications/${id}`));
  };

  // ========= Toggle all notifications read/unread =========
  const toggleAllReadStatus = () => {
    const allRead = notifications.every((n) => n.status === "read");

    notifications.forEach((n) => {
      update(ref(db, `notifications/${n.id}`), { status: allRead ? "unread" : "read" });
    });
  };

  // ========= Sorting and filtering =========
  const sortedNotifications =
    sortOrder === "Newest" ? [...notifications] : [...notifications].reverse();

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
            <li><NavLink to="/">Project Overview</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/roadmap">Roadmap</NavLink></li>
            <li><NavLink to="/backlog">Tasks and Backlog</NavLink></li>
            <li><NavLink to="/notifications" className="active">Notifications</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main className="notifications-container">
        <div className="notification-controls">
          <button className="mark-read" onClick={toggleAllReadStatus}>
            {notifications.every((n) => n.status === "read")
              ? "Mark all as unread"
              : "Mark all as read"}
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