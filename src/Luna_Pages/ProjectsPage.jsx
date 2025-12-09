import React from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from "./header";
import '../css/projectsPage.css';
//import '../css/global.css';

import { getDatabase, ref, push, set, update, onValue } from "firebase/database";
import { db } from "../main.jsx";

// Modal from Bootstrap: https://getbootstrap.com/docs/4.0/components/modal/

// tester photo: image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"

function ProjectsCard(props){
  let shortDescription = "";

  if (props.description) {
    if (props.description.length > 100) {
      shortDescription = props.description.slice(0, 100) + "...";
    } else {
      shortDescription = props.description;
    }
  }

  return (
    <div className="card">
      {/* Edit button (top right) */}
      <button
        type="button"
        className="card-icon card-icon-edit"
        aria-label={"Edit " + props.title}
        onClick={function(e) {
          e.stopPropagation();
          if (props.onEditClick) {
            props.onEditClick();
          }
        }}
      >
        <i className="bi bi-pencil card-icon-inner"></i>
      </button>

      {/* Arrow button (bottom right) */}
      <button
        type="button"
        className="card-icon card-icon-arrow"
        aria-label={"Go to " + props.title + " overview"}
        onClick={function(e) {
          e.stopPropagation();
          if (props.onArrowClick) {
            props.onArrowClick();
          }
        }}
      >
        <i className="bi bi-arrow-right-circle card-icon-inner"></i>
      </button>

      <img
        src={props.image}
        alt="abstract project art"
        className="card-main-image"
      />
      <div className="card-text">
        <h3>{props.title}</h3>
        <p>{shortDescription}</p>
      </div>
    </div>
  );
}
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const projectsRef = ref(db, "projects");
    onValue(projectsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setProjects(loadedProjects);
      }
    });
  }, []);

  const [newProject, setNewProject] = useState({ title: "", description: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


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
      image: newProject.image || "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
    };
    const projectsRef = ref(db, 'projects');
    const newProjectRef = push(projectsRef);
    set(newProjectRef, newProjectObject);
    setNewProject({ title: "", description: "", image: "" });
    setIsModalOpen(false);
  }
  function openEditModal(project) {
    setEditingProject(project);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setEditingProject(null);
    setIsEditModalOpen(false);
  }
function handleEditChange(event) {
  const { name, value } = event.target;
  setEditingProject(prev => ({
    ...prev,
    [name]: value
  }));
}

  function handleEditSubmit(event) {
    event.preventDefault();
    if (!editingProject) return;

    const projectRef = ref(db, "projects/" + editingProject.id);
    const { id, ...projectData } = editingProject;

    set(projectRef, projectData)
      .then(() => {
        closeEditModal();
      })
      .catch(err => {
        console.log(err);
      });
  }

  function handleDeleteProject() {
    if (!editingProject) return;

    const projectRef = ref(db, "projects/" + editingProject.id);
    set(projectRef, null)
      .then(() => {
        closeEditModal();
      })
      .catch(err => {
        console.log(err);
      });
  }
  function goToProjectOverview(projectId) {
    navigate(`/projects/${projectId}`);
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <Header />

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
               Add Project
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
                onEditClick={() => openEditModal(project)}
                onArrowClick={() => goToProjectOverview(project.id)}
              />
            ))}
          </section>

          {/* Editing Modal */}
          {isEditModalOpen && editingProject && (
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
                    <h5 className="modal-title">Edit Project</h5>
                    <button
                      type="button"
                      className="buttonProj"
                      aria-label="Close"
                      onClick={closeEditModal}
                      style={{ marginLeft: "auto" }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <form className="projects-form" onSubmit={handleEditSubmit}>
                    <div className="modal-body">
                      <div className="form-group mb-2">
                        <label htmlFor="edit-project-title">Title</label>
                        <input
                          id="edit-project-title"
                          aria-label="Edit Project Title"
                          name="title"
                          type="text"
                          className="form-control"
                          placeholder="Enter Project Title"
                          value={editingProject.title || ""}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-project-description">Description</label>
                        <textarea
                          id="edit-project-description"
                          aria-label="Edit Project Description"
                          name="description"
                          className="form-control"
                          placeholder="Describe your project"
                          value={editingProject.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-project-image">Image URL</label>
                        <input
                          id="edit-project-image"
                          aria-label="Edit Project Image (URL)"
                          name="image"
                          type="text"
                          className="form-control"
                          placeholder="https://example.com/image.png"
                          value={editingProject.image || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="buttonProj"
                        onClick={handleDeleteProject}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="buttonProj"
                        onClick={closeEditModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="buttonProj">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <footer>
        © 2025 Luna Product Dashboard | INFO 340 Project
      </footer>
    </div>
  );
}

export default ProjectsPage;
