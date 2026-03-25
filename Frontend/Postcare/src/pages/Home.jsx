import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import profileImg from "../img/profile.jpg";
import notiIcon from "../img/Noti.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

const API_BASE =
  "https://postcare-blackend-462349025453.asia-southeast1.run.app";

function getSixDaysEndingToday(baseDate = new Date()) {
  const days = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);

    days.push({
      fullDate: d,
      date: d.getDate(),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      iso: d.toISOString().split("T")[0],
    });
  }

  return days;
}

function normalizeDateOnly(value) {
  if (!value) return "";
  return String(value).split("T")[0];
}

function isUpcomingAppointment(item) {
  if (!item?.appointment_date || !item?.slot_end) return true;

  const dateOnly = normalizeDateOnly(item.appointment_date);
  const endTime = String(item.slot_end).slice(0, 5);
  const appointmentEnd = new Date(`${dateOnly}T${endTime}:00`);
  const now = new Date();

  return appointmentEnd >= now;
}

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();

  const [activeTab, setActiveTab] = useState("home");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const patient = {
    id: localStorage.getItem("patientId"),
    hn: localStorage.getItem("hn") || "HN12345",
    name:
      localStorage.getItem("patientName") ||
      "Ms. Pathumwadee Darukanprut",
    type: localStorage.getItem("patientType") || "OPD",
  };

  const calendarDays = useMemo(() => getSixDaysEndingToday(today), [today]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!patient.id) {
          setAppointments([]);
          setLoadingAppointments(false);
          return;
        }

        setLoadingAppointments(true);

        const url = `${API_BASE}/appointments/book/${patient.id}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        let normalizedAppointments = [];

        if (Array.isArray(data)) {
          normalizedAppointments = data;
        } else if (Array.isArray(data?.appointments)) {
          normalizedAppointments = data.appointments;
        } else if (data) {
          normalizedAppointments = [data];
        } else {
          normalizedAppointments = [];
        }

        const upcomingAppointments =
          normalizedAppointments.filter(isUpcomingAppointment);

        setAppointments(upcomingAppointments);
      } catch (error) {
        console.error("Fetch appointments error:", error);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [patient.id]);

  const appointmentsToShow = useMemo(() => {
    return [...appointments]
      .sort((a, b) => {
        const dateA = new Date(
          `${normalizeDateOnly(a.appointment_date)}T${a.slot_start || "00:00:00"}`
        );
        const dateB = new Date(
          `${normalizeDateOnly(b.appointment_date)}T${b.slot_start || "00:00:00"}`
        );
        return dateA - dateB;
      })
      .slice(0, 3)
      .map((item, index) => ({
        ...item,
        displayId: `AP${String(index + 1).padStart(2, "0")}`,
        appointment_date: normalizeDateOnly(item.appointment_date),
      }));
  }, [appointments]);

  return (
    <div className="home-shell">
      <div className="home-page">
        <div className="head-info">
          <img src={profileImg} alt="profile" className="profile-avatar" />
          <div className="patient-info">
            <div className="hn-text">{patient.hn}</div>
            <div className="sub-text">Patient Type: {patient.type}</div>
            <div className="sub-text">{patient.name}</div>
          </div>
        </div>

        <div className="top-appointment-card">
          <div className="top-appointment-text">
            <div>{patient.name}</div>
            <div>Attending physician:</div>
            <div>Dr. Thanakrit Wattanachai</div>
            <div>Department: General</div>
          </div>

          <img
            src={notiIcon}
            alt="notification"
            className="top-appointment-image"
          />
        </div>

        <div className="section-head calendar-head">
          <div className="section-title">Calendar</div>
          <button
            className="see-all-btn"
            type="button"
            onClick={() => navigate("/calendar")}
          >
            See all
          </button>
        </div>

        <div className="calendar-row">
          {calendarDays.map((day, index) => {
            const isLast = index === calendarDays.length - 1;

            return (
              <div
                key={day.iso}
                className={`calendar-item ${isLast ? "clickable" : "disabled"}`}
                onClick={isLast ? () => navigate("/calendar") : undefined}
              >
                <div className={`calendar-circle ${isLast ? "today" : ""}`}>
                  {day.date}
                </div>

                <div className={`calendar-day ${isLast ? "today-day" : ""}`}>
                  {day.day === "Thu"
                    ? "Thru"
                    : day.day === "Tue"
                    ? "Tru"
                    : day.day}
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-head appointment-head">
          <div className="section-title">Appointment</div>
          <button
            className="see-all-btn"
            type="button"
            onClick={() => navigate("/appointment")}
          >
            See all
          </button>
        </div>

        <div className="appointment-list">
          {loadingAppointments ? (
            <div className="appointment-card">
              <div className="appointment-left">
                <div className="ap-id">Loading...</div>
                <div className="ap-line">Please wait</div>
              </div>
            </div>
          ) : appointmentsToShow.length > 0 ? (
            appointmentsToShow.map((item, index) => (
              <div
                className="appointment-card"
                key={`${item.id || index}-${item.slot_start || index}`}
                onClick={() => navigate("/appointment")}
              >
                <div className="appointment-left">
                  <div className="ap-id">{item.displayId}</div>

                  <div className="ap-line">
                    Clinic: {item.service_name || "-"}
                  </div>

                  <div className="ap-line">
                    Doctor: {item.doctor_name || "-"}
                  </div>

                  <div className="ap-line">
                    Location: {item.location || "Prachomklao HS."}
                  </div>
                </div>

                <div className="appointment-right">
                  <div className="approve-badge">
                    {item.status === "booked"
                      ? "Approve"
                      : item.status || "Approve"}
                  </div>

                  <div className="type-badge">
                    {item.patient_type || patient.type || "OPD"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="appointment-card">
              <div className="appointment-left">
                <div className="ap-id">No data</div>
                <div className="ap-line">No upcoming appointments</div>
              </div>
            </div>
          )}
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
    </div>
  );
}