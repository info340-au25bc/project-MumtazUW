import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../css/projOverview.css';
import { getDatabase, ref, onValue, set as firebaseSet, push as firebasePush, remove } from 'firebase/database';

function ProjectOverviewPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(!!projectId);

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  useEffect(function () {
    if (!projectId) {
      setProject(null);
      setLoadingProject(false);
      return;
    }

    setLoadingProject(true);
    const db = getDatabase();
    const projectRef = ref(db, 'projects/' + projectId);

    const unsubscribe = onValue(projectRef, function (snapshot) {
      const data = snapshot.val();
      setProject(data || null);
      setLoadingProject(false);
    });

    return function () {
      unsubscribe();
    };
  }, [projectId]);

  useEffect(function () {
    const db = getDatabase();
    const linksRef = ref(db, 'projectLinks');

    const unsubscribe = onValue(linksRef, function (snapshot) {
      const data = snapshot.val();
      if (data) {
        const formattedLinks = Object.keys(data).map(function (key) {
          return { id: key, name: data[key].name, url: data[key].url };
        });
        setLinks(formattedLinks);
      } else {
        setLinks([]);
      }
    });

    return function () {
      unsubscribe();
    };
  }, []);

  function handleAddLink() {
    if (newLink.name && newLink.url) {
      const db = getDatabase();
      const linksRef = ref(db, 'projectLinks');
      firebasePush(linksRef, newLink)
        .then(function () {
          setNewLink({ name: '', url: '' });
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }

  function handleEditLink(id, field, value) {
    const db = getDatabase();
    const currentLink = links.find(function (link) {
      return link.id === id;
    });
    if (!currentLink) {
      return;
    }
    const linkRef = ref(db, 'projectLinks/' + id);
    const updated = {
      name: currentLink.name,
      url: currentLink.url
    };
    updated[field] = value;
    firebaseSet(linkRef, updated).catch(function (err) {
      console.error(err);
    });
  }
  function handleDeleteLink(id) {
    const db = getDatabase();
    const linkRef = ref(db, 'projectLinks/' + id);
    remove(linkRef).catch(function (err) {
      console.error(err);
    });
  }
  let headerTitle = 'Project Overview';
  let summaryDescription = 'Luna Health is a women’s health platform focused on reproductive care and education.';

  if (projectId && project) {
    if (project.title) {
      headerTitle = project.title;
    }
    if (project.description) {
      summaryDescription = project.description;
    }
  }
  if (projectId && loadingProject) {
    return (
      <div className="project-overview-page">
        <header>
          <div className="header-left">
            <h1>{headerTitle}</h1>
          </div>
          <div className="profile">
            <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" alt="Profile" />
          </div>
        </header>
        <div className="container">
          <main>
            <p>Loading project...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="project-overview-page">
      <header>
        <div className="header-left">
          <h1>{headerTitle}</h1>
        </div>
        <div className="profile">
          <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" alt="Profile" />
        </div>
      </header>
      <div className="container">
        <div className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li><NavLink to="/overview" className="active">Project Overview</NavLink></li>
              <li><NavLink to="/projects">Projects</NavLink></li>
              <li><NavLink to="/roadmap">Roadmap</NavLink></li>
              <li><NavLink to="/backlog">Tasks and Backlog</NavLink></li>
              <li><NavLink to="/notifications">Notifications</NavLink></li>
            </ul>
          </nav>
        </div>
        <main>
          <section className="hero-section summary-section">
            <h2>Project Summary</h2>
            <p><strong>Owner:</strong> Angel Hill</p>
            <p><strong>Status:</strong> In Progress</p>
            <p><strong>Goal:</strong> Launch MVP by Q1 2026</p>
            <p><strong>Description:</strong> {summaryDescription}</p>
          </section>
          <section className="hero-section metrics-section">
            <h2>Project Metrics</h2>
            <div className="metrics">
              <div className="metric"><h3>3</h3><p>Tickets Open</p></div>
              <div className="metric"><h3>4</h3><p>In Progress</p></div>
              <div className="metric"><h3>76%</h3><p>Roadmap Complete</p></div>
              <div className="metric"><h3>65%</h3><p>Overall Completion</p></div>
            </div>
          </section>

          <section className="hero-section docs-section">
            <h2>Related Documents & Links</h2>
            <ul className="docs">
              {links.map(function (link) {
                return (
                  <li key={link.id} className="doc-item">
                    <input
                      type="text"
                      value={link.name}
                      onChange={function (e) { handleEditLink(link.id, 'name', e.target.value); }}
                      className="link-input"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={function (e) { handleEditLink(link.id, 'url', e.target.value); }}
                      className="link-input"
                    />
                    <a href={link.url} className="open-link">
                      Open
                    </a>
                    <button className="delete-btn" onClick={function () { handleDeleteLink(link.id); }}>
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="add-link">
              <input
                type="text"
                placeholder="Link Name"
                value={newLink.name}
                onChange={function (e) {
                  setNewLink(function (prev) {
                    return { name: e.target.value, url: prev.url };
                  });
                }}
                className="link-input"
              />

              <input
                type="text"
                placeholder="URL"
                value={newLink.url}
                onChange={function (e) {
                  setNewLink(function (prev) {
                    return { name: prev.name, url: e.target.value };
                  });
                }}
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
