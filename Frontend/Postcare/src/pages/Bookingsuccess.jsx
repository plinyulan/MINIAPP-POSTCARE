import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

import profileImg from "../img/profile.jpg";
import roomImg from "../img/RoomService.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const data = location.state || {};

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: 1,
          patient_name: data.patientName,
          service_id: data.serviceId,
          room_id: data.roomId,
          appointment_date: data.date,
          session_start: data.session_start,
          session_end: data.session_end,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || result.message);
      }

      alert("Booking success ✅");
      navigate("/home");

    } catch (err) {
      alert(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        
        {/* Header */}
        <div className="booking-header">
          <img src={profileImg} className="avatar" />
          <div>
            <h2 className="hn">{data.hn}</h2>
            <p>Patient Type: OPD</p>
            <p>{data.patientName}</p>
          </div>
        </div>

        <h3 className="title">Schedule time</h3>

        {/* Room */}
        <div className="room">
          <span>Room</span>
          <div className="room-number active">{data.roomId}</div>
        </div>

        <div className="service-name">{data.serviceName}</div>

        {/* Image */}
        <img src={roomImg} className="room-img" />

        {/* Summary */}
        <h3 className="summary-title">Summary:</h3>

        <div className="summary-row">
          <span>RoomID 0{data.roomId}:</span>

          <span className="time">
            {data.session_start}-{data.session_end}
          </span>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>

        <p>Name: {data.patientName}</p>
        <p>Department: General</p>
      </div>
    </div>
  );
}