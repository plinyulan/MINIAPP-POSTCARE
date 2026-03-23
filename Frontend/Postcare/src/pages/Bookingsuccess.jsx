import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  if (!booking) {
    return (
      <div className="success-page">
        <div className="success-card">
          <h2>Booking data not found</h2>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Back to Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1 className="success-title">Booking Successful</h1>
        <p className="success-subtitle">Your appointment has been confirmed</p>

        <div className="booking-detail">
          <div className="detail-row">
            <span>HN</span>
            <strong>{booking.hn}</strong>
          </div>
          <div className="detail-row">
            <span>Patient</span>
            <strong>{booking.patientName}</strong>
          </div>
          <div className="detail-row">
            <span>Service</span>
            <strong>{booking.serviceName}</strong>
          </div>
          <div className="detail-row">
            <span>Room</span>
            <strong>{booking.roomId}</strong>
          </div>
          <div className="detail-row">
            <span>Date</span>
            <strong>{booking.date}</strong>
          </div>
          <div className="detail-row">
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>
        </div>

        <div className="success-actions">
          <button className="primary-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}