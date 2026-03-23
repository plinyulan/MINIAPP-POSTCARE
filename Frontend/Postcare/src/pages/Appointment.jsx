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
  const [activeTab, setActiveTab] = useState("task");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patient = {
    hn: localStorage.getItem("hn") || "HN00001",
    type: localStorage.getItem("patientType") || "OPD",
    name:
      localStorage.getItem("patientName") || "Ms. Pathumwadee Darukanprut",
    image: profileImg,
  };

  useEffect(() => {
    fetchBookedAppointments();
  }, []);

  const fetchBookedAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/appointment/book/${patient.hn}`);
      if (!res.ok) {
        throw new Error("Failed to fetch booked appointments");
      }

      const data = await res.json();
      setAppointments(data);

      if (data.length > 0) {
        setSelectedAppointment(data[0]);
      }
    } catch (err) {
      console.error(err);
      setError("not found appointment");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr, startTime, endTime) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    const day = date.getDate();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const start = startTime ? startTime.slice(0, 5) : "-";
    const end = endTime ? endTime.slice(0, 5) : "-";

    return `${day} ${weekday} ${start}-${end}`;
  };

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

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        appointments.map((item, index) => (
          <div
            key={item.id || index}
            className="appointment-card"
            onClick={() => setSelectedAppointment(item)}
          >
            <div className="appointment-card-left">
              <p className="ap-code">
                {item.appointment_code || `AP0${index + 1}`}
              </p>
              <p>Clinic: {item.clinic_name || item.clinic || "-"}</p>
              <p>Doctor: {item.doctor_name || item.doctor || "-"}</p>
              <p>Location: {item.hospital_name || item.location || "-"}</p>
            </div>

            <div className="appointment-card-right">
              <span className="approve-badge">
                {item.status || "Approve"}
              </span>
              <span className="opd-badge">
                {item.patient_type || patient.type || "OPD"}
              </span>
            </div>
          </div>
        ))}

      {selectedAppointment && (
        <div className="appointment-detail-box">
          <div className="detail-top">
            <h4>Status Appointment</h4>
            <span className="approve-badge">
              {selectedAppointment.status || "Approve"}
            </span>
          </div>

          <div className="detail-content">
            <p>
              <strong>Date:</strong>{" "}
              {formatDateTime(
                selectedAppointment.appointment_date,
                selectedAppointment.start_time,
                selectedAppointment.end_time
              )}
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
              <strong>Detail:</strong> {selectedAppointment.detail || "-"}
            </p>
          </div>
        </div>
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