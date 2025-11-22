import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/roadmap.css';

function RoadmapPage() {
  return (
    <div className="roadmap-wrapper">
      {/* Header */}
      <header className="header">
        <h1>Product Roadmap</h1>
        <nav className="nav">
          <NavLink to="/backlog">Backlog</NavLink>
          <NavLink to="/roadmap" className="active">
            Roadmap
          </NavLink>
          <NavLink to="/notification">Notification</NavLink>
        </nav>
      </header>

      {/* Main Roadmap Content */}
      <main className="roadmap-container">
        {/* Legend */}
        <section className="legend">
          <span className="legend-item planned"></span> Planned
          <span className="legend-item progress"></span> In Progress
          <span className="legend-item done"></span> Complete
        </section>

        {/* Timeline */}
        <section className="timeline">
          <div className="timeline-header">
            <div className="phase-title"></div>
            <div className="timeline-months">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
            </div>
          </div>

          {/* Foundation */}
          <div className="phase">
            <div className="phase-title">Foundation</div>
            <div className="phase-bar">
              <div className="bar done" style={{ width: "30%" }}></div>
              <span className="bar-label">30%</span>
            </div>
          </div>

          {/* Core Features */}
          <div className="phase">
            <div className="phase-title">Core Features</div>
            <div className="phase-bar">
              <div className="bar progress" style={{ width: "60%" }}></div>
              <span className="bar-label">60%</span>
            </div>
          </div>

          {/* Collaboration */}
          <div className="phase">
            <div className="phase-title">Collaboration</div>
            <div className="phase-bar">
              <div className="bar planned" style={{ width: "40%" }}></div>
              <span className="bar-label">40%</span>
            </div>
          </div>

          {/* Integrations */}
          <div className="phase">
            <div className="phase-title">Integrations</div>
            <div className="phase-bar">
              <div className="bar planned" style={{ width: "30%" }}></div>
              <span className="bar-label">30%</span>
            </div>
          </div>

          {/* Analytics & Deployment */}
          <div className="phase">
            <div className="phase-title">Analytics & Deployment</div>
            <div className="phase-bar">
              <div className="bar planned" style={{ width: "50%" }}></div>
              <span className="bar-label">50%</span>
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

export default RoadmapPage;
