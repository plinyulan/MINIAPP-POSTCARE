import React, { useState } from "react";
import "./loginHN.css";
import loginImage from "./img/Login.png"; // แก้ path ตามไฟล์จริงของเธอ

export default function LoginHN() {
  const [hn, setHn] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HN:", hn);
    console.log("Password:", password);

    // ตรงนี้ค่อยเอาไปต่อ backend / navigate หน้า home 
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <img src={loginImage} alt="Login" className="login-image" />
      </div>

      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="HN number"
            className="login-input"
            value={hn}
            onChange={(e) => setHn(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
