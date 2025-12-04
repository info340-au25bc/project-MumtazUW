import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/projectsPage.css';

import { getDatabase, ref, push, set, update, onValue } from "firebase/database";
import { db } from "../main.jsx";

// Modal from Bootstrap: https://getbootstrap.com/docs/4.0/components/modal/
const TESTPROJECTS = [
  {
    id: 1,
    title: "Project 1",
    description: "Doloremque commodi unde eaque! Et natus dolorum corrupti ut numquam.",
    image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 2,
    title: "Project 2",
    description: "Odio praesentium cum nemo nesciunt architecto, quam voluptate porro inventore.",
    image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 3,
    title: "Project 3",
    description: "Dignissimos consequuntur maxime harum debitis ratione, culpa iure pariatur quaerat?",
    image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 4,
    title: "Project 4",
    description: "Odit id earum commodi tempora voluptatum mollitia dolorum, perspiciatis nulla!",
    image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
  }
];

function ProjectsCard(props){
  return (
    <div className="card">
      <img src={props.image} alt="abstract project art" />
      <div className="card-text">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  React.useEffect(() => {
    const projectsRef = ref(db, "projects");
    onValue(projectsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProjects(loadedProjects);
      }
    });
  }, [db]);

  const [newProject, setNewProject] = useState({ title: "", description: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInput(event) {
    const { name, value } = event.target;
    setNewProject(prevProj => ({ ...prevProj, [name]: value }));
  }

  function handleAddProject(event) {
    event.preventDefault();
    if (!newProject.title || !newProject.description) return;

    const newProjectObject = {
      id: projects.length + 1,
      ...newProject,
      image: newProject.image || "https://semantic-ui.com/images/wireframe/image.png"
    };
    const projectsRef = ref(db, 'projects');
    const newProjectRef = push(projectsRef);  
    set(newProjectRef, newProjectObject);
    setNewProject({ title: "", description: "", image: "" });
    setIsModalOpen(false); 
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <header>
        <div className="header-left">
          <h1>Projects</h1>
        </div>
        <div className="profile">
          <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" alt="Profile" />
        </div>
      </header>

      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/">Project Overview</NavLink>
              </li>
              <li>
                <NavLink to="/projects" className="active">Projects</NavLink>
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
        </aside>

        {/* Main Section */}
        <main>
          <section className="projects-header-row">
            <h2>Your Projects</h2>
            <button className="add-project-btn" onClick={() => setIsModalOpen(true)}
            >
              + Add Project
            </button>
          </section>

          {/* Modal */}
          {isModalOpen && (
            <div
              className="modal fade show project-modal"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Project</h5>
                    <button
                      type="button"
                      className="buttonProj"
                      aria-label="Close"
                      onClick={() => setIsModalOpen(false)}
                      style={{ marginLeft: "auto" }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <form className="projects-form" onSubmit={handleAddProject}>
                    <div className="modal-body">
                      <div className="form-group mb-2">
                        <label htmlFor="project-title">Title</label>
                        <input
                          id="project-title"
                          aria-label="Project Title"
                          name="title"
                          type="text"
                          className="form-control"
                          placeholder="Enter Project Title"
                          value={newProject.title}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="project-description">Description</label>
                        <textarea
                          id="project-description"
                          aria-label="Project Description"
                          name="description"
                          className="form-control"
                          placeholder="Describe your project here"
                          value={newProject.description}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label id="project-image">Image URL</label>
                        <input
                          id="project-image"
                          aria-label="Project Image (URL)"
                          name="image"
                          type="text"
                          className="form-control"
                          placeholder="https://example.com/image.png"
                          value={newProject.image}
                          onChange={handleInput}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="buttonProj"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="buttonProj">
                        Add Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Cards */}
          <section className="card-container">
            {projects.map(project => (
              <ProjectsCard
                key={project.id}
                image={project.image}
                title={project.title}
                description={project.description}
              />
            ))}
          </section>
        </main>
      </div>

      <footer>
        © 2025 Luna Product Dashboard | INFO 340 Project
      </footer>
    </div>
  );
}

export default ProjectsPage;
