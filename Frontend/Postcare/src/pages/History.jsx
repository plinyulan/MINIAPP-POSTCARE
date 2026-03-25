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
  if (!item?.appointment_date) return false;

  const dateOnly = normalizeDateOnly(item.appointment_date);
  const endTime = item.slot_end ? String(item.slot_end).slice(0, 5) : "23:59";
  const appointmentEnd = new Date(`${dateOnly}T${endTime}:00`);

  return appointmentEnd < new Date();
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
    const base = [
      { serviceName: "Blood pressure", count: 0, dates: [] },
      { serviceName: "X-ray", count: 0, dates: [] },
      { serviceName: "Diagnosis", count: 0, dates: [] },
    ];

    filteredHistory.forEach((item) => {
      const raw = (item.service_name || "").toLowerCase();

      let target = null;
      if (raw === "blood pressure") target = "Blood pressure";
      else if (raw === "x-ray") target = "X-ray";
      else if (raw === "diagnosis") target = "Diagnosis";

      if (!target) return;

      const found = base.find((s) => s.serviceName === target);
      if (found) {
        found.count += 1;
        found.dates.push(normalizeDateOnly(item.appointment_date));
      }
    });

    return base.map((group) => ({
      ...group,
      uniqueDates: [...new Set(group.dates)].sort(),
    }));
  }, [filteredHistory]);

  const maxCount = useMemo(() => {
    const max = Math.max(...groupedServices.map((item) => item.count), 0);
    return Math.max(max, 4);
  }, [groupedServices]);

  const dashboardStats = useMemo(() => {
    const totalVisits = filteredHistory.length;

    const topServiceObj = groupedServices.reduce(
      (max, item) => (item.count > max.count ? item : max),
      { serviceName: "-", count: -1 }
    );

    const latestAppointment = [...filteredHistory].sort((a, b) => {
      const dateA = new Date(
        `${normalizeDateOnly(a.appointment_date)}T${a.slot_end || "00:00:00"}`
      );
      const dateB = new Date(
        `${normalizeDateOnly(b.appointment_date)}T${b.slot_end || "00:00:00"}`
      );
      return dateB - dateA;
    })[0];

    return {
      totalVisits,
      topService: topServiceObj.count > 0 ? topServiceObj.serviceName : "-",
      rangeCount: filteredHistory.length,
      lastVisit: latestAppointment
        ? formatDateDMY(latestAppointment.appointment_date)
        : "-",
    };
  }, [filteredHistory, groupedServices]);

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
          type="button"
        >
          Day
        </button>
        <button
          className={`history-filter-btn ${range === "week" ? "active" : ""}`}
          onClick={() => setRange("week")}
          type="button"
        >
          Week
        </button>
        <button
          className={`history-filter-btn ${range === "month" ? "active" : ""}`}
          onClick={() => setRange("month")}
          type="button"
        >
          Month
        </button>
        <button
          className={`history-filter-btn ${range === "year" ? "active" : ""}`}
          onClick={() => setRange("year")}
          type="button"
        >
          Year
        </button>
      </div>

      <div className="mini-dashboard">
        <div className="mini-card">
          <div className="mini-card-label">Total Visits</div>
          <div className="mini-card-value">{dashboardStats.totalVisits}</div>
        </div>

        <div className="mini-card">
          <div className="mini-card-label">Top Service</div>
          <div className="mini-card-value small">{dashboardStats.topService}</div>
        </div>

        <div className="mini-card">
          <div className="mini-card-label">
            {range === "day"
              ? "Today"
              : range === "week"
                ? "This Week"
                : range === "month"
                  ? "This Month"
                  : "This Year"}
          </div>
          <div className="mini-card-value">{dashboardStats.rangeCount}</div>
        </div>

        <div className="mini-card">
          <div className="mini-card-label">Last Visit</div>
          <div className="mini-card-value small">{dashboardStats.lastVisit}</div>
        </div>
      </div>

      <div className="history-chart-card">
        <div className="history-axis-y-title">Time</div>

        <div className="history-chart-simple">
          {loading ? (
            <p className="history-empty">Loading...</p>
          ) : (
            <>
              <div className="history-bars-row">
                {groupedServices.map((item, index) => {
                  const barHeight =
                    item.count <= 0 ? 8 : Math.max(8, (item.count / maxCount) * 160);

                  return (
                    <div
                      className="history-bar-item"
                      key={`${item.serviceName}-${index}`}
                    >
                      <div className="history-bar-wrap">
                        <div
                          className="history-bar-count"
                          style={{ bottom: `${barHeight + 8}px` }}
                        >
                          {item.count}
                        </div>

                        <div
                          className={`history-bar history-bar-${index % 3}`}
                          style={{ height: `${barHeight}px` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="history-x-row">
                <div className="history-axis-x-title">Service</div>

                {groupedServices.map((item, index) => (
                  <div
                    className="history-x-name"
                    key={`${item.serviceName}-label-${index}`}
                  >
                    {item.serviceName}
                  </div>
                ))}
              </div>
            </>
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
                {item.uniqueDates.length > 0 ? (
                  item.uniqueDates.map((date, i) => (
                    <span key={`${date}-${i}`}>{formatDateDMY(date)}</span>
                  ))
                ) : (
                  <span>-</span>
                )}
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