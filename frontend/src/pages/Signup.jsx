import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./signupLogin.css";

// Password utility functions (could be moved to separate file)
const isStrongPassword = (password) => {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

// Basic SHA-1 hashing simulation (use crypto.subtle in production)
const simpleHash = async (password) => {
  return Promise.resolve(password.split("").reverse().join("")); // Replace with real hashing
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
    match: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate password rules on change
    setPasswordRules({
      length: formData.password.length >= 12,
      uppercase: /[A-Z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      special: /[^A-Za-z0-9]/.test(formData.password),
      match:
        formData.password === formData.confirmPassword &&
        formData.password !== "",
    });
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("All fields are required");
      }

      if (!isStrongPassword(formData.password)) {
        throw new Error("Password does not meet requirements");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Check for existing user
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];
      if (registeredUsers.some((user) => user.email === formData.email)) {
        throw new Error("Email already registered");
      }

      // Hash password (in real app, use proper hashing like bcrypt)
      const hashedPassword = await simpleHash(formData.password);

      // Create new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: hashedPassword, // Store only the hashed version
        createdAt: new Date().toISOString(),
      };

      // Update storage
      localStorage.setItem(
        "registeredUsers",
        JSON.stringify([...registeredUsers, newUser])
      );

      // Log user in
      login({ email: formData.email, displayName: formData.name });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && (
          <div className="error-message">
            {error}
            {error.includes("already registered") && (
              <button className="text-link" onClick={() => navigate("/login")}>
                Login instead
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="password-rules">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={passwordRules.length ? "valid" : "invalid"}>
                At least 12 characters
              </li>
              <li className={passwordRules.uppercase ? "valid" : "invalid"}>
                At least one uppercase letter
              </li>
              <li className={passwordRules.number ? "valid" : "invalid"}>
                At least one number
              </li>
              <li className={passwordRules.special ? "valid" : "invalid"}>
                At least one special character
              </li>
              <li className={passwordRules.match ? "valid" : "invalid"}>
                Passwords match
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading || !Object.values(passwordRules).every(Boolean)}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button
            className="secondary-btn"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
