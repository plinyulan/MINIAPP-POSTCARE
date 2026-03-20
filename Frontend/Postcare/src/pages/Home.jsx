import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
//import  from "../img/Login.png";



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

function parseDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`);
}

export default function Home() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://postcare-blackend-462349025453.asia-southeast1.run.app/home")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const calendarDays = useMemo(() => getSixDaysInWeek(today), [today]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return appointments
      .map((item) => ({
        ...item,
        dateTime: parseDateTime(item.appointment_date, item.time_slot),
      }))
      .filter((item) => item.dateTime >= now)
      .sort((a, b) => a.dateTime - b.dateTime);
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    return upcomingAppointments.filter(
      (item) => item.appointment_date === selectedDate
    );
  }, [upcomingAppointments, selectedDate]);

  const appointmentsToShow =
    selectedDayAppointments.length > 0
      ? selectedDayAppointments
      : upcomingAppointments.slice(0, 3);

  return (
    <div>
      <h2>Calendar</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {calendarDays.map((day) => (
          <button
            key={day.iso}
            onClick={() => setSelectedDate(day.iso)}
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "none",
              background: selectedDate === day.iso ? "#457492" : "#8CAFC3",
              color: "white",
              cursor: "pointer",
            }}
          >
            <div>{day.date}</div>
            <div>{day.day}</div>
          </button>
        ))}
      </div>

      <h2>Appointment</h2>

      {loading ? (
        <p>Loading...</p>
      ) : appointmentsToShow.length > 0 ? (
        appointmentsToShow.map((item) => (
          <div
            key={item.id}
            style={{
              marginBottom: "16px",
              padding: "16px",
              borderRadius: "16px",
              background: "#e8f3f4",
            }}
          >
            <p><strong>Patient:</strong> {item.patient_name}</p>
            <p><strong>Service:</strong> {item.service_name}</p>
            <p><strong>Date:</strong> {item.appointment_date}</p>
            <p><strong>Time:</strong> {item.time_slot}</p>
          </div>
        ))
      ) : (
        <p>No upcoming appointments</p>
      )}
    </div>
  );
}