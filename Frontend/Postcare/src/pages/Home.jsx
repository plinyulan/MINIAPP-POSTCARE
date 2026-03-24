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
  "https://postcare-backend-462349025453.asia-southeast1.run.app";

function getSixDaysStartingToday(baseDate = new Date()) {
  const days = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    days.push({
      fullDate: d,
      date: d.getDate(),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      iso: d.toISOString().split("T")[0],
    });
  }

  return days;
}

function parseAppointmentDateTime(item) {
  if (!item?.appointment_date) return null;

  const time = item.time_slot || "00:00:00";
  return new Date(`${item.appointment_date}T${time}`);
}

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();

  const [activeTab, setActiveTab] = useState("home");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const calendarDays = useMemo(() => getSixDaysStartingToday(today), [today]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);

        const res = await fetch(`${API_BASE}/appointments`);
        const data = await res.json();

        console.log("appointments from db:", data);

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch appointments error:", error);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return appointments
      .map((item, index) => {
        const dateTime = parseAppointmentDateTime(item);

        return {
          ...item,
          displayId: item.id
            ? `AP${String(item.id).padStart(2, "0")}`
            : `AP${String(index + 1).padStart(2, "0")}`,
          dateTime,
        };
      })
      .filter((item) => item.dateTime && item.dateTime >= now)
      .sort((a, b) => a.dateTime - b.dateTime);
  }, [appointments]);

  const appointmentsToShow = useMemo(() => {
    return upcomingAppointments.slice(0, 3);
  }, [upcomingAppointments]);

  return (
    <div className="home-shell">
      <div className="home-page">
        <div className="head-info">
          <img src={profileImg} alt="profile" className="profile-avatar" />
          <div className="patient-info">
            <div className="hn-text">HN12345</div>
            <div className="sub-text">Patient Type: OPD</div>
            <div className="sub-text">Ms. Pathumwadee Darukanprut</div>
          </div>
        </div>

        <div
          className="top-appointment-card"
        >
          <div className="top-appointment-text">
            <div>Ms. Pathumwadee Darukanprut</div>
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
            const isLast = index === calendarDays.length - 2; 

            return (
              <div
                key={day.iso}
                className={`calendar-item ${isLast ? "clickable" : "disabled"}`}
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
                key={`${item.id || index}-${item.time_slot || index}`}
                onClick={() => navigate("/appointment")}
              >
                <div className="appointment-left">
                  <div className="ap-id">{item.displayId}</div>

                  <div className="ap-line">
                    Clinic: {item.service_name || item.clinic_name || "-"}
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
                    {item.status || "Approve"}
                  </div>

                  <div className="type-badge">
                    {item.patient_type || "OPD"}
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