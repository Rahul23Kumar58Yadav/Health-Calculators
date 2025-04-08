import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./signupLogin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const user = registeredUsers.find((user) => user.email === email);

      if (!user) {
        throw new Error("User not found. Please sign up.");
      }

      if (user.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }

      login({ email: user.email, displayName: user.name });
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
        <h2>Login</h2>
        {error && (
          <div className="error-message">
            {error}
            {error.includes("User not found") && (
              <button
                className="text-link"
                onClick={() => navigate("/signup")}
                style={{ marginLeft: "5px" }}
              >
                Sign up now
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button className="secondary-btn" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
