import { useState } from "react";
import "./LoginHN.css";
import axios from "axios";
import logo from "../img/Login.png";

function LoginHN() {
  const [hn, setHN] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // บังคับให้ขึ้นต้น HN
    const username = hn.startsWith("HN") ? hn : `HN${hn}`;

    try {
      const res = await axios.post(
        "https://postcare-blackend-462349025453.asia-southeast1.run.app/login",
        {
          username: username,
          password: password,
        },
      );

      console.log(res.data);

      // login สำเร็จ
      window.location.href = "/home";
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} className="login-img" />

      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="HN number"
            value={hn}
            onChange={(e) => {
              let value = e.target.value
              .replace("HN", "") // ลบ HN ถ้าพิมพ์มา
              .replace(/\D/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลข
              setHN(value);
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginHN;
