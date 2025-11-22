import React from 'react';
import '../css/signupPage.css';

function SignupPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to Luna</h1>
        <p>Create your account to start organizing your projects.</p>

        <form>
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" placeholder="Full Name" required />

          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Email" required />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="Password" required />

          <button type="submit">Sign Up</button>
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
