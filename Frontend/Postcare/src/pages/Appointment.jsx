import React, { useEffect, useState } from "react";
import "./Appointment.css";

import profileImg from "../img/profile.jpg";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const patient = {
    id: localStorage.getItem("patientId"),
    hn: localStorage.getItem("hn"),
    name: localStorage.getItem("patientName"),
    type: localStorage.getItem("patientType"),
    image: profileImg,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/appointments/book/${patient.id}`
      );
      const data = await res.json();

      console.log("DATA:", data);

      if (data.length > 0) {
        setAppointments(data);
        setSelectedAppointment(data[0]);
      } else {
        setAppointments([]);
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-page">
      {/* HEADER */}
      <div className="appointment-header">
        <img src={profileImg} className="patient-avatar" />
        <div>
          <h2>{patient.hn}</h2>
          <p>Patient Type: {patient.type}</p>
          <p>{patient.name}</p>
        </div>
      </div>

      <h3 className="appointment-title">Appointment</h3>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* NO DATA */}
      {!loading && appointments.length === 0 && (
        <p>not found appointment</p>
      )}

      {/* LIST */}
      {appointments.map((item, index) => (
        <div
          key={item.id}
          className={`appointment-card ${
            selectedAppointment?.id === item.id ? "active" : ""
          }`}
          onClick={() => setSelectedAppointment(item)}
        >
          <div>
            <p className="ap-code">AP0{index + 1}</p>
            <p>Clinic: {item.service_name}</p>
            <p>Doctor: -</p>
            <p>Location: {item.location || "-"}</p>
          </div>

          <div>
            <span className="approve-badge">
              {item.status === "booked" ? "Approve" : item.status}
            </span>
            <span className="opd-badge">{patient.type}</span>
          </div>
        </div>
      ))}

      {/* DETAIL */}
      {selectedAppointment && (
        <div className="appointment-detail-box">
          <div className="detail-top">
            <h4>Status Appointment</h4>
            <span className="approve-badge">Approve</span>
          </div>

          <div className="detail-content">
            <p>
              <strong>Date:</strong>{" "}
              {selectedAppointment.appointment_date}{" "}
              {selectedAppointment.slot_start}-
              {selectedAppointment.slot_end}
            </p>

            <p>
              <strong>Name:</strong> {selectedAppointment.patient_name}
            </p>

            <p>
              <strong>Service :</strong>{" "}
              <span className="service-chip">
                {selectedAppointment.service_name}
              </span>
            </p>

            <p>
              <strong>ServiceID:</strong> {selectedAppointment.service_id}
            </p>

            <p>
              <strong>Detail:</strong> Room{" "}
              {selectedAppointment.room_id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}