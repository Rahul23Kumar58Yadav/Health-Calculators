import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signupLogin.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validation
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      if (registeredUsers.some((user) => user.email === email)) {
        throw new Error("Email already registered");
      }

      // Store user data (in a real app, this would be a backend API call)
      const newUser = {
        name,
        email,
        password,
        isVerified: false, // Add verification flag
        verificationToken: Math.random().toString(36).substring(2, 15), // Simple token
      };

      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      // Instead of auto-login, show success message and redirect to login
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>
        {error && <div className="error-message">{error}</div>}
        {isSuccess && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit">Signup</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button className="secondary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
