import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";
import defaultProfileImg from "../img/profile.jpg";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hn = localStorage.getItem("hn") || "HN12345";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/patients/hn/${hn}`);

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("fetch profile error:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [hn]);

  if (loading) return <div className="profile-page">Loading...</div>;
  if (error) return <div className="profile-page">{error}</div>;
  if (!patient) return <div className="profile-page">No data</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={patient.profile_image || defaultProfileImg}
          alt="profile"
          className="profile-avatar"
          onError={(e) => {
            e.target.src = defaultProfileImg;
          }}
        />

        <h2 className="profile-hn">{patient.hn}</h2>
        <p className="profile-type">Patient Type: {patient.patient_type}</p>
        <p className="profile-name">{patient.full_name}</p>
      </div>

      <div className="profile-card">
        <h3>Personal Information:</h3>
        <p>Age: {patient.age || "-"}</p>
        <p>Gender: {patient.gender || "-"}</p>
        <p>Blood-Group: {patient.blood_group || "-"}</p>
        <p>PhoneNumber: {patient.phone_number || "-"}</p>
        <p>
          Birthday:{" "}
          {patient.birthday
            ? new Date(patient.birthday).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </p>
        <p>Address: {patient.address || "-"}</p>
      </div>

      <div className="profile-card medical-card">
        <h3>Medical Information:</h3>
        <p>DoctorName: {patient.doctor_name || "-"}</p>
      </div>

      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("home");
            navigate("/home");
          }}
        >
          <img src={homeIcon} alt="home" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("calendar");
            navigate("/services");
          }}
        >
          <img src={calendarIcon} alt="calendar" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "task" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("task");
            navigate("/appointment");
          }}
        >
          <img src={taskIcon} alt="task" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("profile");
            navigate("/profile");
          }}
        >
          <img src={profileIcon} alt="profile" className="nav-icon" />
        </button>
      </div>
    </div>
  );
}