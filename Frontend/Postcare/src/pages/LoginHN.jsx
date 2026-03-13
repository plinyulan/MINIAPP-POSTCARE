import React, { useNavigate } from "react-router-dom";
import "./loginHN.css";
import loginImg from "./img/Login.png"; // เปลี่ยน path ตามไฟล์จริง

export default function LoginHN() {
  const navigate = useNavigate();
  
  const [hn, setHn] = useNavigate("");
  const [password, setPassword] = useNavigate("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HN:", hn);
    console.log("Password:", password);
    navigate("/home");
    
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

          <button type="submit" className="hn-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
