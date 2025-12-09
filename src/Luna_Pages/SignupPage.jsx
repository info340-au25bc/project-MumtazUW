import React, { useState } from 'react';
import '../css/signupPage.css';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../main.jsx';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSignUp(event) {
    event.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Please complete all fields.');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const userRef = ref(db, `users/${result.user.uid}/profile`);
      await set(userRef, {
        name,
        email,
        basicInfo: '',
        organizations: []
      });

      navigate('/overview');

    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/overview');

    } catch {
      setErrorMessage("Invalid email or password.");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* Dynamic Title */}
        <h1>{isSignIn ? "Welcome Back" : "Welcome to Luna"}</h1>
        <p>{isSignIn ? "Sign in to continue." : "Create your account to start organizing your projects."}</p>

        {/* Dynamic Form */}
        <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>

          {/* Only show Full Name when SIGNING UP */}
          {!isSignIn && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                required={!isSignIn}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Dynamic Button */}
          <button type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}
        </form>

        {/* Toggle link between signup/signin */}
        <p className="auth-footer">
          {isSignIn ? (
            <>Don’t have an account? <span className="switch-link" onClick={() => setIsSignIn(false)}>Sign Up</span></>
          ) : (
            <>Already have an account? <span className="switch-link" onClick={() => setIsSignIn(true)}>Sign In</span></>
          )}
        </p>

      </div>

      <footer>© 2025 Luna Product Dashboard | INFO 340 Project</footer>
    </div>
  );
}

export default SignupPage;