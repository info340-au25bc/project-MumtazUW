import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/projectsPage.css';

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
            <button className="add-project-btn">Add Project</button>
          </section>

          {/* Cards */}
          <section className="card-container">

            {/* Card 1 */}
            <ProjectsCard
              image="https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
              title="Project 1"
              description="Corporate Project Art"
            />
            <div className="card">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="abstract project art"
              />
              <div className="card-text">
                <h3>Project 1</h3>
                <p>
                  Doloremque commodi unde eaque! Et natus dolorum corrupti ut numquam.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="abstract project art"
              />
              <div className="card-text">
                <h3>Project 2</h3>
                <p>
                  Odio praesentium cum nemo nesciunt architecto, quam voluptate porro inventore.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="abstract project art"
              />
              <div className="card-text">
                <h3>Project 3</h3>
                <p>
                  Dignissimos consequuntur maxime harum debitis ratione, culpa iure pariatur quaerat?
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.icLF1gVCYreYaVVKihzDKAHaEb?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="abstract project art"
              />
              <div className="card-text">
                <h3>Project 4</h3>
                <p>
                  Odit id earum commodi tempora voluptatum mollitia dolorum, perspiciatis nulla!
                </p>
              </div>
            </div>

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
