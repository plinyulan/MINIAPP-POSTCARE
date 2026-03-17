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
    <div className="container">

      <img src={img} className="hero" />

      <div className="panel"></div>

      <h1 className="title">Login</h1>

      {/* HN INPUT */}
      <input
        className="hn-input"
        value={`HN${hn}`}
        onChange={handleHNChange}
        placeholder="HN number"
      />

      {/* PASSWORD */}
      <input
        type="password"
        className="password-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* BUTTON */}
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>

    </div>
  );
}

export default LoginHN;
