import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/projOverview.css';
import { getDatabase, ref, onValue, set as firebaseSet, push as firebasePush, remove } from 'firebase/database';

function ProjectOverviewPage() {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  useEffect(() => {
    const db = getDatabase();
    const linksRef = ref(db, 'projectLinks');

    const unsubscribe = onValue(linksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedLinks = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setLinks(formattedLinks);
      } else {
        setLinks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const db = getDatabase();
      const linksRef = ref(db, 'projectLinks');
      firebasePush(linksRef, newLink)
        .then(() => setNewLink({ name: '', url: '' }))
        .catch(err => console.error(err));
    }
  };

  const handleEditLink = (id, field, value) => {
    const db = getDatabase();
    const linkRef = ref(db, `projectLinks/${id}`);
    firebaseSet(linkRef, { ...links.find(link => link.id === id), [field]: value })
      .catch(err => console.error(err));
  };

  const handleDeleteLink = (id) => {
    const db = getDatabase();
    const linkRef = ref(db, `projectLinks/${id}`);
    remove(linkRef).catch(err => console.error(err));
  };

  return (
    <div className="project-overview-page">
      {/* Header */}
      <header>
        <div className="header-left">
          <h1>Project Overview</h1>
        </div>
        <div className="profile">
          <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" alt="Profile" />
        </div>
      </header>

      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li><NavLink to="/" className="active">Project Overview</NavLink></li>
              <li><NavLink to="/projects">Projects</NavLink></li>
              <li><NavLink to="/roadmap">Roadmap</NavLink></li>
              <li><NavLink to="/backlog">Tasks and Backlog</NavLink></li>
              <li><NavLink to="/notifications">Notifications</NavLink></li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main>
          {/* Hero Section: Project Summary */}
          <section className="hero-section summary-section">
            <h2>Project Summary</h2>
            <p><strong>Owner:</strong> Angel Hill</p>
            <p><strong>Status:</strong> In Progress</p>
            <p><strong>Goal:</strong> Launch MVP by Q1 2026</p>
            <p><strong>Description:</strong> Luna Health is a women’s health platform focused on reproductive care and education.</p>
          </section>

          {/* Hero Section: Metrics */}
          <section className="hero-section metrics-section">
            <h2>Project Metrics</h2>
            <div className="metrics">
              <div className="metric"><h3>3</h3><p>Tickets Open</p></div>
              <div className="metric"><h3>4</h3><p>In Progress</p></div>
              <div className="metric"><h3>76%</h3><p>Roadmap Complete</p></div>
              <div className="metric"><h3>65%</h3><p>Overall Completion</p></div>
            </div>
          </section>

          {/* Hero Section: Related Documents */}
          <section className="hero-section docs-section">
            <h2>Related Documents & Links</h2>

            <ul className="docs">
              {links.map(link => (
                <li key={link.id} className="doc-item">
                  <input
                    type="text"
                    value={link.name}
                    onChange={e => handleEditLink(link.id, 'name', e.target.value)}
                    className="link-input"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={e => handleEditLink(link.id, 'url', e.target.value)}
                    className="link-input"
                  />
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="open-link">Open</a>
                  <button className="delete-btn" onClick={() => handleDeleteLink(link.id)}>Delete</button>
                </li>
              ))}
            </ul>

            <div className="add-link">
              <input
                type="text"
                placeholder="Link Name"
                value={newLink.name}
                onChange={e => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                className="link-input"
              />
              <input
                type="text"
                placeholder="URL"
                value={newLink.url}
                onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="link-input"
              />
              <button className="add-btn" onClick={handleAddLink}>Add Link</button>
            </div>
          </section>
        </main>
      </div>

      <footer>© 2025 Luna Product Dashboard | INFO 340 Project</footer>
    </div>
  );
}

export default ProjectOverviewPage;