import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduleTime.css";

import profileImg from "../img/profile.jpg";
import roomImg from "../img/RoomService.png"; 
// ตอนนี้ใช้รูปเดียวก่อน ถ้ามีหลายรูปค่อยแยก room1 room2 room3

export default function ScheduleTime() {
  const navigate = useNavigate();

  const patient = {
    hn: "HN00001",
    type: "OPD",
    name: "Ms. Pathumwadee Darukanprut",
    image: profileImg,
  };

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
      name: "X-Ray",
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
      name: "Dental",
      image: roomImg,
      slots: [
        { id: 13, time: "8:00-10:00", status: "available" },
        { id: 14, time: "10:00-12:00", status: "available" },
        { id: 15, time: "13:00-15:00", status: "reserved" },
        { id: 16, time: "15:00-17:00", status: "available" },
      ],
    },
    5: {
      name: "Eye Check",
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

  const handleBook = async (slot) => {
    if (slot.status === "reserved") return;

    // ตอนนี้จำลองว่าจองสำเร็จ
    // ถ้าเชื่อม backend จริง ค่อย fetch POST ไป API ตรงนี้

    navigate("/booking-success", {
      state: {
        serviceName: currentRoom.name,
        roomId: selectedRoom,
        time: slot.time,
        date: "2026-03-23",
        patientName: patient.name,
        hn: patient.hn,
      },
    });
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <div className="patient-info">
          <img src={patient.image} alt="patient" className="patient-avatar" />
          <div className="patient-text">
            <h2>{patient.hn}</h2>
            <p>Patient Type: {patient.type}</p>
            <p>{patient.name}</p>
          </div>
        </div>

        <h3 className="section-title">Schedule time</h3>

        <div className="room-header">
          <span className="room-label">Room</span>
          <div className="room-buttons">
            {[1, 2, 3, 4, 5].map((room) => (
              <button
                key={room}
                className={`room-btn ${selectedRoom === room ? "active" : ""}`}
                onClick={() => setSelectedRoom(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="service-name">{currentRoom.name}</div>

        <div className="room-image-wrap">
          <img src={currentRoom.image} alt="room" className="room-image" />
        </div>

        <div className="legend">
          <span className="legend-available">Available</span>
          <span className="legend-reserved">Reserved</span>
        </div>

        <div className="slot-grid">
          {currentRoom.slots.map((slot) => (
            <button
              key={slot.id}
              className={`slot-btn ${
                slot.status === "available" ? "available" : "reserved"
              }`}
              disabled={slot.status === "reserved"}
              onClick={() => handleBook(slot)}
            >
              {slot.time}
            </button>
          ))}
        </div>

         <div className="bottom-nav">
                <button
                  type="button"
                  className={`nav-item ${activeTab === "home" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("home");
                    navigate("/home");
                  }}
                >
                  <img src={homeIcon} alt="home" className="nav-icon" />
                </button>
        
                <button
                  type="button"
                  className={`nav-item ${activeTab === "calendar" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("calendar");
                    navigate("/calendar");
                  }}
                >
                  <img src={calendarIcon} alt="calendar" className="nav-icon" />
                </button>
        
                <button
                  type="button"
                  className={`nav-item ${activeTab === "task" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("task");
                  }}
                >
                  <img src={taskIcon} alt="task" className="nav-icon" />
                </button>
        
                <button
                  type="button"
                  className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("profile");
                  }}
                >
                  <img src={profileIcon} alt="profile" className="nav-icon" />
                </button>
        </div>
      </div>
    </div>
  );
}