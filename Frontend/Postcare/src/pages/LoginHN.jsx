import { useState } from "react";
import "./LoginHN.css";
import axios from "axios";
import logo from "../img/Login.png";
import { set } from "mongoose";

function LoginHN() {
  const [hn, setHN] = useState("");
  const [password, setPassword] = useState("");

  const handleHNChange = (e) => {

    setHN(e.target.value);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await axios.post(
        "https://postcare-blackend-462349025453.asia-southeast1.run.app/login",
        {
          username,
          password,
        }
      );


     console.log(res.data);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
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