import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <header className="backlog-header">
      <div className="header-left">
        <button className="hamburger" aria-label="Open menu">
          <i className="bi bi-list"></i>
        </button>
        <h1>Project Backlog</h1>
      </div>
      <div className="profile">
        <img
          src="https://semantic-ui.com/images/avatar2/large/kristy.png"
          alt="Profile"
        />
      </div>
    </header>
  );
}

export default Header;
