import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scheduletime.css";

import profileImg from "../img/profile.jpg";
import roomImg from "../img/RoomService.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

const getTodayBangkok = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

  const selectedServiceId = location.state?.serviceId || "01";
  const selectedServiceName = location.state?.serviceName || "Blood pressure";

  const [selectedRoom, setSelectedRoom] = useState(1);
  const selectedDate = getTodayBangkok();

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      setSlotError("");

      const res = await fetch(
        `${API_BASE}/available-slots?service_id=${selectedServiceId}&room_id=${selectedRoom}&date=${selectedDate}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Failed to fetch available slots");
      }

      setSlots(data);
    } catch (error) {
      console.error("fetchAvailableSlots error:", error);
      setSlots([]);
      setSlotError(error.message || "Unable to load available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();

    const interval = setInterval(() => {
      fetchAvailableSlots();
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedServiceId, selectedRoom]);

  const handleBook = async (slot) => {
    if (slot.status !== "available" || bookingLoading) return;

    try {
      setBookingLoading(true);

      const res = await fetch(`${API_BASE}/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: 1,
          patient_name: patient.name,
          service_id: selectedServiceId,
          room_id: selectedRoom,
          appointment_date: selectedDate,
          session_start: slot.session_start,
          session_end: slot.session_end,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Booking failed");
      }

      navigate("/bookingsuccess", {
        state: {
          appointmentId: data.appointment.id,
          serviceId: selectedServiceId,
          serviceName: selectedServiceName,
          roomId: selectedRoom,
          time: `${data.appointment.slot_start.slice(0, 5)}-${data.appointment.slot_end.slice(0, 5)}`,
          date: data.appointment.appointment_date,
          patientName: patient.name,
          hn: patient.hn,
        },
      });
    } catch (error) {
      console.error("handleBook error:", error);
      alert(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
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
            src={roomImg}
            alt="room"
            className="schedule-room-image"
          />
        </div>

        <div className="schedule-legend">
          <span className="schedule-legend-available">Available</span>
          <span className="schedule-legend-reserved">Reserved</span>
        </div>

        {loadingSlots && (
          <p className="schedule-message">Loading slots...</p>
        )}

        {!loadingSlots && slotError && (
          <p className="schedule-message schedule-error">{slotError}</p>
        )}

        {!loadingSlots && !slotError && slots.length === 0 && (
          <p className="schedule-message">No available sessions</p>
        )}

        {!loadingSlots && !slotError && slots.length > 0 && (
          <div className="schedule-slot-grid">
            {slots.map((slot, index) => (
              <button
                key={`${slot.session_start}-${slot.session_end}-${index}`}
                className={`schedule-slot-btn ${
                  slot.status === "available"
                    ? "schedule-slot-available"
                    : "schedule-slot-reserved"
                }`}
                disabled={slot.status !== "available" || bookingLoading}
                onClick={() => handleBook(slot)}
              >
                {slot.session_start}-{slot.session_end}
              </button>
            ))}
          </div>
        )}

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
              navigate("/services");
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