import React, { useState } from 'react';
import '../css/signupPage.css';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../main.jsx';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSignUp(event) {
    event.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Please complete all fields before signing up.');
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

    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to Luna</h1>
        <p>Create your account to start organizing your projects.</p>

        <form onSubmit={handleSignUp}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>

          {errorMessage && (
            <p className="auth-error" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/projOverview">Sign In</a>
        </p>
      </div>

      <footer>© 2025 Luna Health Product Dashboard | INFO 340 Project</footer>
    </div>
  );
}

export default SignupPage;
