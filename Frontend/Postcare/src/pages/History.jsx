import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";
import profileImg from "../img/profile.jpg";

import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

function normalizeDateOnly(value) {
  if (!value) return "";
  return String(value).split("T")[0];
}

function isPastAppointment(item) {
  if (!item?.appointment_date || !item?.slot_end) return false;

  const dateOnly = normalizeDateOnly(item.appointment_date);
  const endTime = String(item.slot_end).slice(0, 5);
  const appointmentEnd = new Date(`${dateOnly}T${endTime}:00`);
  const now = new Date();

  return appointmentEnd < now;
}

function formatDateDMY(value) {
  if (!value) return "-";
  const d = new Date(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export default function History() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("task");
  const [range, setRange] = useState("month");
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patient = {
    id: localStorage.getItem("patientId"),
    hn: localStorage.getItem("hn") || "HN00001",
    name:
      localStorage.getItem("patientName") ||
      "Ms. Pathumwadee Darukanprut",
    type: localStorage.getItem("patientType") || "OPD",
    image: profileImg,
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!patient.id) {
          setHistoryAppointments([]);
          return;
        }

        const res = await fetch(`${API_BASE}/appointments/book/${patient.id}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setHistoryAppointments(data.filter(isPastAppointment));
        } else {
          setHistoryAppointments([]);
        }
      } catch (error) {
        console.error("history fetch error:", error);
        setHistoryAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patient.id]);

  const filteredHistory = useMemo(() => {
    const now = new Date();

    return historyAppointments.filter((item) => {
      const date = new Date(item.appointment_date);
      const diffMs = now - date;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (range === "day") return diffDays <= 1;
      if (range === "week") return diffDays <= 7;
      if (range === "month") return diffDays <= 31;
      if (range === "year") return diffDays <= 366;
      return true;
    });
  }, [historyAppointments, range]);

  const groupedServices = useMemo(() => {
    const groups = {};

    filteredHistory.forEach((item) => {
      const key = item.service_name || "Unknown";

      if (!groups[key]) {
        groups[key] = {
          serviceName: key,
          count: 0,
          dates: [],
        };
      }

      groups[key].count += 1;
      groups[key].dates.push(normalizeDateOnly(item.appointment_date));
    });

    return Object.values(groups).map((group) => ({
      ...group,
      uniqueDates: [...new Set(group.dates)].sort(),
    }));
  }, [filteredHistory]);

  const maxCount = useMemo(() => {
    if (groupedServices.length === 0) return 1;
    return Math.max(...groupedServices.map((item) => item.count), 1);
  }, [groupedServices]);

  return (
    <div className="history-page">
      <div className="history-header">
        <img src={patient.image} alt="profile" className="history-avatar" />
        <div className="history-patient-info">
          <h2>{patient.hn}</h2>
          <p>Patient Type: {patient.type}</p>
          <p>{patient.name}</p>
        </div>
      </div>

      <h3 className="history-title">History</h3>

      <div className="history-filter-row">
        <button
          className={`history-filter-btn ${range === "day" ? "active" : ""}`}
          onClick={() => setRange("day")}
        >
          Day
        </button>

        <button
          className={`history-filter-btn ${range === "week" ? "active" : ""}`}
          onClick={() => setRange("week")}
        >
          Week
        </button>

        <button
          className={`history-filter-btn ${range === "month" ? "active" : ""}`}
          onClick={() => setRange("month")}
        >
          Month
        </button>

        <button
          className={`history-filter-btn ${range === "year" ? "active" : ""}`}
          onClick={() => setRange("year")}
        >
          Year
        </button>
      </div>

      <div className="history-chart-section">
        <div className="history-chart-label">Time</div>

        <div className="history-chart">
          {loading ? (
            <p className="history-empty">Loading...</p>
          ) : groupedServices.length > 0 ? (
            groupedServices.map((item, index) => (
              <div className="history-bar-item" key={`${item.serviceName}-${index}`}>
                <div
                  className={`history-bar history-bar-${index % 3}`}
                  style={{
                    height: `${Math.max(84, (item.count / maxCount) * 210)}px`,
                  }}
                />
                <div className="history-bar-name">{item.serviceName}</div>
              </div>
            ))
          ) : (
            <p className="history-empty">No history data</p>
          )}
        </div>
      </div>

      <div className="history-card-list">
        {groupedServices.map((item, index) => (
          <div className="history-card" key={`${item.serviceName}-${index}`}>
            <div className="history-card-title">{item.serviceName}</div>

            <div className="history-card-row">
              <span className="history-card-label">Time :</span>
              <span className="history-card-value">{item.count}</span>
            </div>

            <div className="history-card-row history-card-date-row">
              <span className="history-card-label">Date :</span>
              <span className="history-card-value history-card-dates">
                {item.uniqueDates.map((date, i) => (
                  <span key={`${date}-${i}`}>{formatDateDMY(date)}</span>
                ))}
              </span>
            </div>
          </div>
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
            navigate("/appointment");
          }}
        >
          <img src={taskIcon} alt="task" className="nav-icon" />
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("profile");
            navigate("/profile");
          }}
        >
          <img src={profileIcon} alt="profile" className="nav-icon" />
        </button>
      </div>
    </div>
  );
}