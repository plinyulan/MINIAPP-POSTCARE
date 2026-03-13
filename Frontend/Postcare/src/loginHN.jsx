import React, { useState } from "react";
import "./LoginPage.css";
import img from "./img/Login.png";

export default function LoginPage() {
  const [hn, setHn] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HN:", hn);
    console.log("Password:", password);

    // ตรงนี้ค่อยเอาไปเชื่อม backend ทีหลัง
    // เช่น fetch / axios ไปที่ API login
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <img src={medicalImg} alt="Medical Login" className="login-image" />
      </div>

      <div className="login-form-wrapper">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
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