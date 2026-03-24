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

  const hn = localStorage.getItem("hn") || "HN12345";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/patients/hn/${hn}`);
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error("fetch profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [hn]);

  if (loading) return <div className="profile-page">Loading...</div>;
  if (!patient) return <div className="profile-page">No data</div>;

  return (
    <div className="profile-page">
      <div className="profile-top">
        <img
          src={patient.profile_image || defaultProfileImg}
          alt="profile"
          className="profile-top-avatar"
          onError={(e) => {
            e.target.src = defaultProfileImg;
          }}
        />

        <h2 className="profile-top-hn">{patient.hn}</h2>
        <p className="profile-top-type">Patient Type: {patient.patient_type}</p>
        <p className="profile-top-name">{patient.full_name}</p>
      </div>

      <div className="profile-info-card">
        <h3>Personal Information:</h3>
        <p>Age: {patient.age || "-"}</p>
        <p>Gender: {patient.gender || "-"}</p>
        <p>Blood-Group: {patient.blood_group || "-"}</p>
        <p>PhoneNumber: {patient.phone_number || "-"}</p>
        <p>
          Birthday:{" "}
          {patient.birthday
            ? new Date(patient.birthday).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </p>
        <p>Address: {patient.address || "-"}</p>
      </div>

      <div className="profile-medical-card">
        <h3>Medical Information:</h3>
        <p>DoctorName: {patient.doctor_name || "-"}</p>
      </div>

      <div className="profile-bottom-nav">
        <button
          className={`profile-nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("home");
            navigate("/home");
          }}
        >
          <img src={homeIcon} alt="home" className="profile-nav-icon" />
        </button>

        <button
          className={`profile-nav-item ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("calendar");
            navigate("/services");
          }}
        >
          <img src={calendarIcon} alt="calendar" className="profile-nav-icon" />
        </button>

        <button
          className={`profile-nav-item ${activeTab === "task" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("task");
            navigate("/appointment");
          }}
        >
          <img src={taskIcon} alt="task" className="profile-nav-icon" />
        </button>

        <button
          className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("profile");
            navigate("/profile");
          }}
        >
          <img src={profileIcon} alt="profile" className="profile-nav-icon" />
        </button>
      </div>
    </div>
  );
}