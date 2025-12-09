import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import '../css/kanbanBacklog.css';
function Header() {
  return (
    <header className="backlog-header">
      <div className="header-left">
        <h1>Project Backlog</h1>
      </div>
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
