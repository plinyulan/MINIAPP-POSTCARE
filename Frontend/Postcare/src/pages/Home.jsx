import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import profileImg from "../img/profile.jpg";
import notiIcon from "../img/Noti.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

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
  if (!item.appointment_date || !item.time_slot) return null;
  return new Date(`${item.appointment_date}T${item.time_slot}`);
}

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();

  const [activeTab, setActiveTab] = useState("home");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const calendarDays = useMemo(() => getSixDaysStartingToday(today), [today]);
  const selectedDate = calendarDays[4]?.iso || ""; // เลือกอันที่ 5 ให้ตรงกับตัวอย่างวันที่ 14

  useEffect(() => {
    fetch(
      "https://postcare-backend-462349025453.asia-southeast1.run.app/appointments"
    )
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch appointments error:", err);
        setAppointments([]);
      })
      .finally(() => {
        setLoadingAppointments(false);
      });
  }, []);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return appointments
      .map((item, index) => ({
        ...item,
        displayId: item.id
          ? `AP${String(item.id).padStart(2, "0")}`
          : `AP${String(index + 1).padStart(2, "0")}`,
        dateTime: parseAppointmentDateTime(item),
      }))
      .filter((item) => item.dateTime && item.dateTime >= now)
      .sort((a, b) => a.dateTime - b.dateTime);
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const sameDay = upcomingAppointments.filter(
      (item) => item.appointment_date === selectedDate
    );

    return sameDay.length > 0
      ? sameDay.slice(0, 3)
      : upcomingAppointments.slice(0, 3);
  }, [upcomingAppointments, selectedDate]);

  return (
    <div className="home-shell">
      <div className="home-page">
        <div className="head-info">
          <img src={profileImg} alt="profile" className="profile-avatar" />
          <div className="patient-info">
            <div className="hn-text">HN00001</div>
            <div className="sub-text">Patient Type: OPD</div>
            <div className="sub-text">Ms. Pathumwadee Darukanprut</div>
          </div>
        </div>

        <div
          className="top-appointment-card"
          onClick={() => navigate("/service")}
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
            const isActive = index === 4;

            return (
              <div
                key={day.iso}
                className={`calendar-item ${isActive ? "clickable" : "disabled"}`}
                onClick={isActive ? () => {} : undefined}
              >
                <div className={`calendar-circle ${isActive ? "today" : ""}`}>
                  {day.date}
                </div>

                <div className={`calendar-day ${isActive ? "today-day" : ""}`}>
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
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((item) => (
              <div
                className="appointment-card"
                key={`${item.id}-${item.time_slot}`}
                onClick={() => navigate("/appointment")}
              >
                <div className="appointment-left">
                  <div className="ap-id">{item.displayId}</div>
                  <div className="ap-line">
                    Clinic: {item.service_name || "-"}
                    {item.department ? ` (${item.department})` : ""}
                  </div>
                  <div className="ap-line">
                    Doctor: {item.doctor_name || "-"}
                  </div>
                  <div className="ap-line">
                    Location: {item.location || "Prajomkao HS."}
                  </div>
                </div>

                <div className="appointment-right">
                  <div className="approve-badge">
                    {item.status || "Approve"}
                  </div>
                  <div className="type-badge">{item.patient_type || "OPD"}</div>
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