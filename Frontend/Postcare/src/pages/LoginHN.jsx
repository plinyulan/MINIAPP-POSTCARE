import React, { useState } from "react";
import "../index.css";
import loginImg from "../img/Login.png";

function LoginHN({ onLoginSuccess }) {
  const [hn, setHn] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hn && password) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <img src={loginImg} alt="Medical Login" className="login-image" />
      </div>

      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="HN number"
            value={hn}
            onChange={(e) => setHn(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginHN;