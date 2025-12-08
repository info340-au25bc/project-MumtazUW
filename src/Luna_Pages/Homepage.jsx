import React from "react";
import { NavLink } from "react-router-dom";
import "../css/homepage.css";

const HomePage = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">Luna Dashboard</div>

      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Organize, Track, Deliver.</h1>
          <p>
            Luna is an all in one workspace for managing tasks, projects, and
            teams. An INFO 340 Project
          </p>
          <NavLink to="/signup" className="cta-btn">
            Get Started
          </NavLink>
        </div>
        <div className="hero-illustration">
          <img src="/img/LunaDashboard.jpeg" alt="Dashboard Illustration" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Should You Use Luna</h2>
        <div className="card-grid">
          <div className="feature-card">
            <h3>Kanban Boards</h3>
            <p>
              Visualize your workflow and track progress in a simple, flexible
              board layout.
            </p>
          </div>
          <div className="feature-card">
            <h3>Timelines</h3>
            <p>Plan your roadmap with milestones and deadlines.</p>
          </div>
          <div className="feature-card">
            <h3>Team Collaboration</h3>
            <p>Comment, assign, and collaborate in real time.</p>
          </div>
          <div className="feature-card">
            <h3>Analytics</h3>
            <p>Measure progress with built in charts.</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo">
        <h2>Explore our workspace</h2>
        <div className="demo-cards">
          <div className="demo-card" tabIndex="0">
            <h3>Task Management</h3>
            <p>Click or hover to see more.</p>
            <div className="card-detail">
              <p>Create, track, and move tasks across columns.</p>
            </div>
          </div>
          <div className="demo-card" tabIndex="0">
            <h3>Roadmap Planning</h3>
            <p>Click or hover to see more.</p>
            <div className="card-detail">
              <p>Visualize long term goals with sprints and milestones.</p>
            </div>
          </div>
          <div className="demo-card" tabIndex="0">
            <h3>Team Collaboration</h3>
            <p>Click or hover to see more.</p>
            <div className="card-detail">
              <p>Communicate and share updates without leaving the platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 Luna Health Product Dashboard | INFO 340 Project</p>
      </footer>
    </div>
  );
};

export default HomePage;