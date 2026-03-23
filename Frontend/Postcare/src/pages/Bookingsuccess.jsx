import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Bookingsuccess.css";

import profileImg from "../img/profile.jpg";
import roomImg from "../img/RoomService.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

export default function Bookingsuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("task");

  const booking = location.state || {};

  const patient = {
    hn: booking.hn || "HN00001",
    type: "OPD",
    name: booking.patientName || "Ms. Pathumwadee Darukanprut",
    image: profileImg,
  };

  const roomId = booking.roomId || 1;
  const serviceName = booking.serviceName || "Blood pressure";
  const time = booking.time || "10:00-10:15";
  const date = booking.date || "";
  const department = "General";
  const doctorName = "Dr. Thanakrit Wattanachai";

  return (
    <div className="booking-success-page">
      <div className="booking-success-card">
        <div className="booking-success-patient-info">
          <img
            src={patient.image}
            alt="patient"
            className="booking-success-patient-avatar"
          />

          <div className="booking-success-patient-text">
            <h2>{patient.hn}</h2>
            <p>Patient Type: {patient.type}</p>
            <p>{patient.name}</p>
          </div>
        </div>

        <h3 className="booking-success-section-title">Schedule time</h3>

        <div className="booking-success-room-header">
          <span className="booking-success-room-label">Room</span>

          <div className="booking-success-room-buttons">
            {[1, 2, 3, 4, 5].map((room) => (
              <button
                key={room}
                className={`booking-success-room-btn ${
                  roomId === room ? "active" : ""
                }`}
                disabled
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-success-service-name">
          {serviceName.toLowerCase()}
        </div>

        <div className="booking-success-room-image-wrap">
          <img
            src={roomImg}
            alt="room"
            className="booking-success-room-image"
          />

          <img
            src={patient.image}
            alt="patient marker"
            className="booking-success-room-marker"
          />
        </div>

        <div className="booking-success-summary-title">Summary:</div>

        <div className="booking-success-summary-row top-row">
          <div className="booking-success-room-time">
            <span className="booking-success-room-id">
              RoomID {String(roomId).padStart(2, "0")}:
            </span>
            <span className="booking-success-time-pill">{time}</span>
          </div>

          <button
            className="booking-success-submit-btn"
            onClick={() => navigate("/home")}
          >
            Submit
          </button>
        </div>

        <div className="booking-success-total-row">Total</div>

        <div className="booking-success-detail">
          <p>
            <span>Name:</span> {patient.name}
          </p>
          <p>
            <span>Department:</span> {department}
          </p>
          <p>
            <span>Attending physician:</span> {doctorName}
          </p>
          {date && (
            <p>
              <span>Date:</span> {date}
            </p>
          )}
        </div>

        <div className="booking-success-bottom-nav">
          <button
            type="button"
            className={`booking-success-nav-item ${
              activeTab === "home" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("home");
              navigate("/home");
            }}
          >
            <img src={homeIcon} alt="home" className="booking-success-nav-icon" />
          </button>

          <button
            type="button"
            className={`booking-success-nav-item ${
              activeTab === "calendar" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("calendar");
              navigate("/calendar");
            }}
          >
            <img
              src={calendarIcon}
              alt="calendar"
              className="booking-success-nav-icon"
            />
          </button>

          <button
            type="button"
            className={`booking-success-nav-item ${
              activeTab === "task" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("task");
              navigate("/services");
            }}
          >
            <img src={taskIcon} alt="task" className="booking-success-nav-icon" />
          </button>

          <button
            type="button"
            className={`booking-success-nav-item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("profile");
            }}
          >
            <img
              src={profileIcon}
              alt="profile"
              className="booking-success-nav-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
}