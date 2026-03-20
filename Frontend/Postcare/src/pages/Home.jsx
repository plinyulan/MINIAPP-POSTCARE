import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import profileImg from "../img/profile.jpg";
import notiIcon from "../img/Noti.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/profile.png";

function getSixDaysInWeek(baseDate = new Date()) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - day);

  const days = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);

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
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("https://postcare-blackend-462349025453.asia-southeast1.run.app/home")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch appointments error:", err);
        setAppointments([]);
      });
  }, []);

  const calendarDays = useMemo(() => getSixDaysInWeek(today), [today]);

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

  const selectedDayAppointments = useMemo(() => {
    return upcomingAppointments.filter(
      (item) => item.appointment_date === selectedDate,
    );
  }, [upcomingAppointments, selectedDate]);

  const appointmentsToShow =
    selectedDayAppointments.length > 0
      ? selectedDayAppointments.slice(0, 3)
      : upcomingAppointments.slice(0, 3);

  return (
    <div className="home-shell">
      <div className="home-page">
        {/* Header */}
        <div className="head-info">
          <img src={profileImg} alt="profile" className="profile-avatar" />
          <div className="patient-info">
            <div className="hn-text">HN00001</div>
            <div className="sub-text">Patient Type: OPD</div>
            <div className="sub-text">Ms. Pathumwadee Darukanprut</div>
          </div>
        </div>

        {/* Top card */}
        <div className="top-appointment-card">
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

        {/* Calendar header */}
        <div className="section-head calendar-head">
          <div className="section-title">Calendar</div>
          <button className="see-all-btn">See all</button>
        </div>

        {/* Calendar row */}
        <div className="calendar-row">
          {calendarDays.map((day) => (
            <div
              key={day.iso}
              className="calendar-item"
              onClick={() => setSelectedDate(day.iso)}
            >
              <div
                className={`calendar-circle ${
                  selectedDate === day.iso ? "active" : ""
                }`}
              >
                {day.date}
              </div>
              <div className="calendar-day">
                {day.day === "Thu"
                  ? "Thru"
                  : day.day === "Tue"
                  ? "Tru"
                  : day.day}
              </div>
            </div>
          ))}
        </div>

        {/* Appointment header */}
        <div className="section-head appointment-head">
          <div className="section-title">Appointment</div>
          <button className="see-all-btn">See all</button>
        </div>

        {/* Appointment cards */}
        <div className="appointment-list">
          {appointmentsToShow.length > 0 ? (
            appointmentsToShow.map((item) => (
              <div
                className="appointment-card"
                key={`${item.id}-${item.time_slot}`}
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
            <>
              <div className="appointment-card">
                <div className="appointment-left">
                  <div className="ap-id">AP01</div>
                  <div className="ap-line">Clinic: X-ray (General)</div>
                  <div className="ap-line">Doctor: -</div>
                  <div className="ap-line">Location: Prajomkao HS.</div>
                </div>
                <div className="appointment-right">
                  <div className="approve-badge">Approve</div>
                  <div className="type-badge">OPD</div>
                </div>
              </div>

              <div className="appointment-card">
                <div className="appointment-left">
                  <div className="ap-id">AP02</div>
                  <div className="ap-line">Clinic: Blood presser(General)</div>
                  <div className="ap-line">Doctor: -</div>
                  <div className="ap-line">Location: Prajomkao HS.</div>
                </div>
                <div className="appointment-right">
                  <div className="approve-badge">Approve</div>
                  <div className="type-badge">OPD</div>
                </div>
              </div>

              <div className="appointment-card">
                <div className="appointment-left">
                  <div className="ap-id">AP03</div>
                  <div className="ap-line">Clinic: Diagnosis (General)</div>
                  <div className="ap-line">Doctor: -</div>
                  <div className="ap-line">Location: Prajomkao HS.</div>
                </div>
                <div className="appointment-right">
                  <div className="approve-badge">Approve</div>
                  <div className="type-badge">OPD</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom nav */}
        <div className="bottom-nav">
          <button className="nav-item">
            <img src={homeIcon} alt="home" className="nav-icon" />
          </button>

          <button className="nav-item">
            <img src={calendarIcon} alt="calendar" className="nav-icon" />
          </button>

          <button className="nav-item">
            <img src={taskIcon} alt="task" className="nav-icon" />
          </button>

          <button className="nav-item">
            <img src={profileIcon} alt="profile" className="nav-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
