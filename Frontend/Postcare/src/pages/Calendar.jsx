import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";
import profileImg from "../img/profile.jpg";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";
import arrowDown from "../img/arrowdown.png";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const navigate = useNavigate();
  const today = new Date();

  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("calendar");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = i + 1;
      const jsDate = new Date(currentYear, currentMonth, date);

      const isPastDate =
        currentYear === today.getFullYear() &&
        currentMonth === today.getMonth() &&
        date < today.getDate();

      const isToday =
        currentYear === today.getFullYear() &&
        currentMonth === today.getMonth() &&
        date === today.getDate();

      return {
        date,
        day: dayNames[jsDate.getDay()],
        isPastDate,
        isToday,
      };
    });
  }, [daysInMonth, currentMonth, currentYear, today]);

  const handleDateClick = (dayObj) => {
    if (dayObj.isPastDate) return;
    navigate("/services");
  };

  return (
    <div className="calendar-page">
      <div className="head-information">
        <img src={profileImg} alt="profile" className="profile-image" />

        <div className="patient-info">
          <div className="hn-text">HN12345</div>
          <div className="sub-text">Patient Type: OPD</div>
          <div className="sub-text">Ms. Pathumwadee Darukanprut</div>
        </div>
      </div>

      <div className="calendar-header">
        <h2 className="calendar-title">Calendar</h2>

        <div className="month-wrapper">
          <button
            className="month-dropdown"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {monthNames[currentMonth]}
            <img
              src={arrowDown}
              alt="arrow"
              className={`month-arrow ${showDropdown ? "rotate" : ""}`}
            />
          </button>

          {showDropdown && (
            <div className="month-menu">
              {monthNames.map((month, index) => (
                <div
                  key={index}
                  className="month-item"
                  onClick={() => {
                    setCurrentMonth(index);
                    setShowDropdown(false);
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="calendar-grid">
        {days.map((item) => (
          <div key={item.date} className="calendar-item">
            <button
              type="button"
              className={`calendar-date ${item.isToday ? "selected" : ""} ${
                item.isPastDate ? "disabled" : ""
              }`}
              onClick={() => handleDateClick(item)}
              disabled={item.isPastDate}
            >
              {item.date}
            </button>
            <span className="calendar-day">{item.day}</span>
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
            navigate("/task");
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