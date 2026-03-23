import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scheduletime.css";

import profileImg from "../img/profile.jpg";
import roomImg from "../img/RoomService.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

export default function Scheduletime() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("calendar");

  const patient = {
    hn: "HN12345",
    type: "OPD",
    name: "Ms. Pathumwadee Darukanprut",
    image: profileImg,
  };

  const selectedServiceName = location.state?.serviceName || "Blood presser";
  const [selectedRoom, setSelectedRoom] = useState(1);

  const roomData = {
    1: {
      name: "Blood presser",
      image: roomImg,
      slots: [
        { id: 1, time: "8:00-10:00", status: "available" },
        { id: 2, time: "10:00-12:00", status: "available" },
        { id: 3, time: "13:00-15:00", status: "available" },
        { id: 4, time: "15:00-17:00", status: "reserved" },
      ],
    },
    2: {
      name: "Blood presser",
      image: roomImg,
      slots: [
        { id: 5, time: "8:00-10:00", status: "reserved" },
        { id: 6, time: "10:00-12:00", status: "available" },
        { id: 7, time: "13:00-15:00", status: "available" },
        { id: 8, time: "15:00-17:00", status: "available" },
      ],
    },
    3: {
      name: "Diagnosis",
      image: roomImg,
      slots: [
        { id: 9, time: "8:00-10:00", status: "available" },
        { id: 10, time: "10:00-12:00", status: "reserved" },
        { id: 11, time: "13:00-15:00", status: "available" },
        { id: 12, time: "15:00-17:00", status: "available" },
      ],
    },
    4: {
      name: "X-ray",
      image: roomImg,
      slots: [
        { id: 13, time: "8:00-10:00", status: "available" },
        { id: 14, time: "10:00-12:00", status: "available" },
        { id: 15, time: "13:00-15:00", status: "reserved" },
        { id: 16, time: "15:00-17:00", status: "available" },
      ],
    },
    5: {
      name: "X-ray",
      image: roomImg,
      slots: [
        { id: 17, time: "8:00-10:00", status: "reserved" },
        { id: 18, time: "10:00-12:00", status: "reserved" },
        { id: 19, time: "13:00-15:00", status: "available" },
        { id: 20, time: "15:00-17:00", status: "available" },
      ],
    },
  };

  const currentRoom = roomData[selectedRoom];

  const handleBook = (slot) => {
    if (slot.status === "reserved") return;

    navigate("/bookingsuccess", {
      state: {
        serviceName: selectedServiceName,
        roomId: selectedRoom,
        time: slot.time,
        date: new Date().toLocaleDateString(),
        patientName: patient.name,
        hn: patient.hn,
      },
    });
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <div className="schedule-patient-info">
          <img
            src={patient.image}
            alt="patient"
            className="schedule-patient-avatar"
          />

          <div className="schedule-patient-text">
            <h2>{patient.hn}</h2>
            <p>Patient Type: {patient.type}</p>
            <p>{patient.name}</p>
          </div>
        </div>
        <h3 className="schedule-section-title">Schedule time</h3>

        <div className="schedule-room-header">
          <span className="schedule-room-label">Room</span>

          <div className="schedule-room-buttons">
            {[1, 2, 3, 4, 5].map((room) => (
              <button
                key={room}
                className={`schedule-room-btn ${
                  selectedRoom === room ? "active" : ""
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="schedule-service-name">{selectedServiceName}</div>

        <div className="schedule-room-image-wrap">
          <img
            src={currentRoom.image}
            alt="room"
            className="schedule-room-image"
          />
        </div>

        <div className="schedule-legend">
          <span className="schedule-legend-available">Available</span>
          <span className="schedule-legend-reserved">Reserved</span>
        </div>

        <div className="schedule-slot-grid">
          {currentRoom.slots.map((slot) => (
            <button
              key={slot.id}
              className={`schedule-slot-btn ${
                slot.status === "available"
                  ? "schedule-slot-available"
                  : "schedule-slot-reserved"
              }`}
              disabled={slot.status === "reserved"}
              onClick={() => handleBook(slot)}
            >
              {slot.time}
            </button>
          ))}
        </div>

        <div className="schedule-bottom-nav">
          <button
            type="button"
            className={`schedule-nav-item ${
              activeTab === "home" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("home");
              navigate("/home");
            }}
          >
            <img src={homeIcon} alt="home" className="schedule-nav-icon" />
          </button>

          <button
            type="button"
            className={`schedule-nav-item ${
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
              className="schedule-nav-icon"
            />
          </button>

          <button
            type="button"
            className={`schedule-nav-item ${
              activeTab === "task" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("task");
            }}
          >
            <img src={taskIcon} alt="task" className="schedule-nav-icon" />
          </button>

          <button
            type="button"
            className={`schedule-nav-item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("profile");
            }}
          >
            <img
              src={profileIcon}
              alt="profile"
              className="schedule-nav-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
