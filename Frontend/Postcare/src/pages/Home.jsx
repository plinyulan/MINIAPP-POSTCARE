import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import profileImg from "../img/profile.jpg";
import notiIcon from "../img/Noti.png";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

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

function parseAppointmentDateTime(item) {
  if (!item.appointment_date || !item.time_slot) return null;
  return new Date(`${item.appointment_date}T${item.time_slot}`);
}

export default function Home() {
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(
      "https://postcare-backend-462349025453.asia-southeast1.run.app/appointments",
    )
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch appointments error:", err);
        setAppointments([]);
      });
  }, []);

  const calendarDays = useMemo(() => getSixDaysEndingToday(today), [today]);

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
        <div className="head-info">
          <img src={profileImg} alt="profile" className="profile-avatar" />
          <div className="patient-info">
            <div className="hn-text">HN12345</div>
            <div className="sub-text">Patient Type: OPD</div>
            <div className="sub-text">Ms. Pathumwadee Darukanprut</div>
          </div>
        </div>

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

        <div className="section-head calendar-head">
          <div className="section-title">Calendar</div>
          <button className="see-all-btn" onClick={() => navigate("/calendar")}>
            See all
          </button>
        </div>

        <div className="calendar-row">
          {calendarDays.map((day) => {
            const isToday = day.iso === todayIso;

            return (
              <div
                key={day.iso}
                className="calendar-item"
                onClick={() => setSelectedDate(day.iso)}
              >
                <div className={`calendar-circle ${isToday ? "today" : ""}`}>
                  {day.date}
                </div>

                <div className={`calendar-day ${isToday ? "today-day" : ""}`}>
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
          <button className="see-all-btn" type="button">
            See all
          </button>
        </div>

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
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("home");
              navigate("/");
            }}
          >
            <img src={calendarIcon} alt="calendar" className="nav-icon" />
          </button>

          <button
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
            onClick={() => setActiveTab("task")}
          >
            <img src={taskIcon} alt="task" className="nav-icon" />
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <img src={profileIcon} alt="profile" className="nav-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
