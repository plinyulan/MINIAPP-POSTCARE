import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginHN.css";
import loginImg from "../img/Login.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

export default function LoginHN() {
  const navigate = useNavigate();

  const [hn, setHn] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: hn,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      console.log("LOGIN SUCCESS:", data);

      // 🔥 ตรงนี้คือหัวใจ
      localStorage.setItem("patientId", data.user.id);
      localStorage.setItem("hn", data.user.hn);
      localStorage.setItem("patientType", data.user.patient_type || "OPD");
      localStorage.setItem(
        "patientName",
        data.user.full_name || data.user.patient_name || ""
      );

      // ไปหน้า home
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="hn-login-page">
      <img src={loginImg} alt="POSTCARE Login" className="hn-login-image" />

      <div className="hn-login-panel">
        <h1 className="hn-login-title">Login</h1>

        <form className="hn-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="hn-login-input"
            placeholder="HN number"
            value={hn}
            onChange={(e) => setHn(e.target.value)}
          />

          <input
            type="password"
            className="hn-login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="hn-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}