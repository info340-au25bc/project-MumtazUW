import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/projOverview.css';

function ProjectOverviewPage() {
  return (
    <div className="project-overview-page">

      {/* Header */}
      <header>
        <div className="header-left">
         {/* <button className="hamburger" aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>
          <i className="bi bi-house-fill" aria-hidden="true"></i>*/}
          <h1>Project Overview</h1>
        </div>

        <div className="profile">
          <img
            src="https://semantic-ui.com/images/avatar2/large/kristy.png"
            alt="Profile"
          />
        </div>
      </header>

      {/* Layout Container */}
      <div className="container">

        {/* Sidebar */}
        <div className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/" className="active">
                  Project Overview
                </NavLink>
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
                <NavLink to="/notifications">Notifications</NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main>

          {/* Project Summary Card */}
          <div className="card project-summary">
            <h2>Project Summary</h2>

            <p><strong>Owner:</strong> Angel Hill</p>
            <p><strong>Status:</strong> In Progress</p>
            <p><strong>Goal:</strong> Launch MVP by Q1 2026</p>
            <p>
              <strong>Description:</strong> Luna Health is a women’s health
              platform focused on reproductive care and education.
            </p>

            <div className="metrics">
              <div className="metric">
                <h3>65%</h3>
                <p>Completion</p>
              </div>

              <div className="metric">
                <h3>12</h3>
                <p>Active Tasks</p>
              </div>

              <div className="metric">
                <h3>4</h3>
                <p>Team Members</p>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="card">
            <h2>Related Documents & Links</h2>

            <ul className="docs">
              <li><a href="#">Product Requirements (PRD.pdf)</a></li>
              <li><a href="#">Wireframes (Luna_UI.fig)</a></li>
              <li><a href="#">Team Charter (Luna_Charter.docx)</a></li>
              <li><a href="#">User Research Summary (Research.pdf)</a></li>
            </ul>
          </div>

        </main>
      </div>

    <footer>© 2025 Luna Product Dashboard | INFO 340 Project</footer>

    </div>
  );
}

export default ProjectOverviewPage;
