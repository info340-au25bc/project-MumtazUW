import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import "../css/kanbanBacklog.css";

function Header(props) {
  const title = props && props.title ? props.title : "Project Backlog";

  return (
    <header className="backlog-header">
      <div className="header-left">
        <h1>{title}</h1>
      </div>

      <nav className="header-nav" aria-label="Page navigation">
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/notifications">Notifs</NavLink>
        <NavLink to="/backlog">BackLog</NavLink>
      </nav>

      <div className="profile">
        <NavLink to="/profile">
          <img
            src="https://semantic-ui.com/images/avatar2/large/kristy.png"
            alt="Profile Photo"
          />
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
