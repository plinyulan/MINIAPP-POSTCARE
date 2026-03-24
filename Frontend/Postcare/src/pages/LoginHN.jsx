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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hn || !password) {
      alert("Please enter HN number and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: hn,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("patientId", data.user.id);
      localStorage.setItem("hn", data.user.hn);
      localStorage.setItem("patientType", "OPD");
      localStorage.setItem(
        "patientName",
        data.user.full_name || data.user.patient_name || data.user.name || ""
      );

      navigate("/home");
    } catch (error) {
      console.error("login error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginhn-page">
      <div className="loginhn-phone">
        <img src={loginImg} alt="POSTCARE" className="loginhn-image" />

        <div className="loginhn-bottom"></div>

        <h1 className="loginhn-title">Login</h1>

        <form className="loginhn-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="loginhn-input loginhn-input-hn"
            placeholder="HN number"
            value={hn}
            onChange={(e) => setHn(e.target.value)}
          />

          <input
            type="password"
            className="loginhn-input loginhn-input-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="loginhn-button" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}