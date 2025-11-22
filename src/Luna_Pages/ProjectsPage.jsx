import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/projectsPage.css';

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
      <img
        src={props.image}
        alt="abstract project art"
      />  
    <div className="card-text">
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState(TESTPROJECTS);

  function handleAddProject() {
    const newProject = {
      id: projects.length + 1,
      title: `Project ${projects.length + 1}`,
      description: "New project description",
      image: "https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
    };
    setProjects(function(prevProjects) {;
      return prevProjects.concat(newProject);
    });
    }
  return (
    <div className="projects-page">
      {/* Header */}
      <header>
        <div className="header-left">
        {/*  <button className="hamburger" aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>*/}
          <h1>Projects</h1>
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
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/">
                  Project Overview
                </NavLink>
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

          {/* Header Row */}
          <section className="projects-header-row">
            <h2>Your Projects</h2>
            <button className="add-project-btn" onClick={handleAddProject}>Add Project</button>
          </section>

          {/* Cards */}
          <section className="card-container">
            {TESTPROJECTS.map(function(project) {
              return (
                <ProjectsCard
                  key={project.id}
                  image={project.image}
                  title={project.title}
                  description={project.description}
                />
              );
            })}
          </section>
        </main>

      </div>

      <footer>
        © 2025 Luna Health Product Dashboard | INFO 340 Project
      </footer>
    </div>
  );
}

export default ProjectsPage;
