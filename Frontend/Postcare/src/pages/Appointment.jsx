import React, { useEffect, useState } from "react";
import "./Appointment.css";
import profileImg from "../img/profile.jpg";

import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("task");

  const patient = {
    id: localStorage.getItem("patientId"),
    hn: localStorage.getItem("hn") || "HN00001",
    name:
      localStorage.getItem("patientName") || "Ms. Pathumwadee Darukanprut",
    type: localStorage.getItem("patientType") || "OPD",
    image: profileImg,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments/book/${patient.id}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${day} ${weekday}`;
  };

  const renderAppointmentCard = (item, index = 0, isDetailView = false) => (
    <div
      key={item.id}
      className={`appointment-card ${isDetailView ? "detail-selected" : ""}`}
      onClick={() => {
        if (!isDetailView) setSelectedAppointment(item);
      }}
    >
      <div className="appointment-card-left">
        <p className="ap-code">AP0{index + 1}</p>
        <p>Clinic: {item.service_name || "-"}</p>
        <p>Doctor: -</p>
        <p>Location: {item.location || "-"}</p>
      </div>

      <div className="appointment-card-right">
        {!isDetailView && (
          <span className="approve-badge">
            {item.status === "booked" ? "Approve" : item.status}
          </span>
        )}
        <span className="opd-badge">{patient.type}</span>
      </div>
    </div>
  );

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <img src={patient.image} alt="profile" className="patient-avatar" />
        <div className="patient-info">
          <h2>{patient.hn}</h2>
          <p>Patient Type: {patient.type}</p>
          <p>{patient.name}</p>
        </div>
      </div>

      <h3 className="appointment-title">Appointment</h3>

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && appointments.length === 0 && (
        <p className="error-text">not found appointment</p>
      )}

      {!loading && appointments.length > 0 && !selectedAppointment && (
        <>
          {appointments.map((item, index) => renderAppointmentCard(item, index))}
        </>
      )}

      {!loading && selectedAppointment && (
        <>
          {renderAppointmentCard(selectedAppointment, 0, true)}

          <div className="appointment-detail-box">
            <div className="detail-top">
              <h4>Status Appointment</h4>
              <span className="approve-badge">
                {selectedAppointment.status === "booked"
                  ? "Approve"
                  : selectedAppointment.status}
              </span>
            </div>

            <div className="detail-content">
              <p>
                <strong>Date:</strong> {formatDate(selectedAppointment.appointment_date)}{" "}
                {selectedAppointment.slot_start?.slice(0, 5)}-
                {selectedAppointment.slot_end?.slice(0, 5)}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedAppointment.patient_name || patient.name}
              </p>

              <p>
                <strong>Service :</strong>{" "}
                <span className="service-chip">
                  {selectedAppointment.service_name || "-"}
                </span>
              </p>

              <p>
                <strong>ServiceID:</strong>{" "}
                {selectedAppointment.service_id || "-"}
              </p>

              <p>
                <strong>Detail:</strong> Room {selectedAppointment.room_id || "-"}
              </p>
            </div>

            <button
              className="back-to-list-btn"
              onClick={() => setSelectedAppointment(null)}
            >
              Back
            </button>
          </div>
        </>
      )}

      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
           onClick={() => {setActiveTab("home");
              navigate("/home");
          }}
        >
          <img src={homeIcon} alt="home" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "calendar" ? "active" : ""}`}
           onClick={() => {setActiveTab("calendar");
              navigate("/calendar");
          }}
        >
          <img src={calendarIcon} alt="calendar" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "task" ? "active" : ""}`}
          onClick={() => {setActiveTab("task");
              navigate("/appointment");
          }}
        >
          <img src={taskIcon} alt="task" className="nav-icon" />
        </button>

        <button
          className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <img src={profileIcon} alt="profile" className="nav-icon" />
        </button>
      </div>
    </div>
  );
}