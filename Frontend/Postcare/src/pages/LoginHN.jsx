import { useState } from "react";
import "./LoginHN.css";
import axios from "axios";
import logo from "../img/Login.png";

function LoginHN() {
  const [hn, setHN] = useState("");
  const [password, setPassword] = useState("");

  const handleHNChange = (e) => {
    let value = e.target.value
      .replace(/^HN/i, "")
      .replace(/\D/g, "");
    setHN(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = `HN${hn}`;

    try {
      const res = await axios.post(
        "https://postcare-blackend-462349025453.asia-southeast1.run.app/login",
        {
          username,
          password,
        }
      );

      console.log(res.data);
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Login" className="hero" />
      <div className="panel"></div>
      <h1 className="title">Login</h1>

      <input
        type="text"
        className="hn-input"
        onChange={handleHNChange}
        placeholder="HN number"
      />

      <input
        type="password"
        className="password-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default LoginHN;