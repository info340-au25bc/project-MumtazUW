import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/global.css";
import { auth, db } from "../main.jsx";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { ref, onValue } from "firebase/database";

function ProfilePage() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setFirebaseUser(null);
        setProfile(null);
        setProjectCount(0);
        return;
      }
      setFirebaseUser(user);

      const profileRef = ref(db, "users/" + user.uid + "/profile");
      onValue(profileRef, (snapshot) => {
        setProfile(snapshot.val());
      });

      const projectsRef = ref(db, "projects");
      onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProjectCount(Object.keys(data).length);
        } else {
          setProjectCount(0);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  function handlePasswordReset() {
    if (!firebaseUser || !firebaseUser.email) {
      return;
    }
    setStatusMessage(null);

    sendPasswordResetEmail(auth, firebaseUser.email)
      .then(() => {
        setStatusMessage("Password reset email sent to " + firebaseUser.email);
      })
      .catch((error) => {
        console.error(error);
        setStatusMessage("Error sending reset email: " + error.message);
      });
  }

  let displayName = "Not set";
  if (profile && profile.name) {
    displayName = profile.name;
  } else if (firebaseUser && firebaseUser.displayName) {
    displayName = firebaseUser.displayName;
  }

  return (
    <div className="projects-page">
      <header>
        <div className="header-left">
          <h1>Profile</h1>
        </div>
        <div className="profile">
          <img
            src="https://semantic-ui.com/images/avatar2/large/kristy.png"
            alt="Profile"
          />
        </div>
      </header>

      <div className="container">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/overview">Project Overview</NavLink>
              </li>
              <li>
                <NavLink to="/projects">Projects</NavLink>
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
              <li>
                <NavLink to="/profile" className="active">
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main>
          <section className="profile-section">
            <h2>Your Profile</h2>
            {!firebaseUser && <p>You are not signed in.</p>}
            {firebaseUser && (
              <>
                <div className="profile-card card">
                  <h3>Basic Info</h3>
                  <p>
                    <strong>Name: </strong>
                    {displayName}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {firebaseUser.email}
                  </p>
                  {profile && profile.basicInfo && (
                    <p>
                      <strong>About you: </strong>
                      {profile.basicInfo}
                    </p>
                  )}
                </div>
                <div className="profile-card card">
                  <h3>Organizations</h3>
                  {profile && profile.organizations && (
                    <ul>
                      {Object.keys(profile.organizations).map((key) => (
                        <li key={key}>{profile.organizations[key]}</li>
                      ))}
                    </ul>
                  )}
                  {(!profile || !profile.organizations) && (
                    <p>No organizations listed yet.</p>
                  )}
                </div>

                <div className="profile-card card">
                  <h3>Metrics</h3>
                  <p>
                    <strong>Total projects (all users): </strong>
                    {projectCount}
                  </p>
                </div>

                <div className="profile-card card">
                  <h3>Password</h3>
                  <p>
                    To change your password, we’ll send a reset email to your
                    account email.
                  </p>
                  <button
                    type="button"
                    className="buttonProj"
                    onClick={handlePasswordReset}
                  >
                    Send password reset email
                  </button>
                  {statusMessage && (
                    <p className="status-message">{statusMessage}</p>
                  )}
                </div>
              </>)}
          </section>
        </main>
      </div>
      <footer>© 2025 Luna Product Dashboard | INFO 340 Project</footer>
    </div>
  );
}
export default ProfilePage;
