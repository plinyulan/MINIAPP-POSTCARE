import React, { useEffect, useState } from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import profileImg from "../img/profile.jpg";
import homeIcon from "../img/home.png";
import calendarIcon from "../img/calendar.png";
import taskIcon from "../img/taskdaily.png";
import profileIcon from "../img/usercircle.png";

export default function Service() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("task");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patient = {
    hn: "HN12345",
    type: "OPD",
    name: "Ms. Pathumwadee Darukanprut",
    image: profileImg,
  };

  const handleServiceClick = (item) => {
    if (item.status?.toLowerCase() !== "available") return;

    if (item.service_name === "Blood presser") {
      navigate("/bloodpresser");
    } else if (item.service_name === "Diagnosis") {
      navigate("/diagnosis");
    } else if (item.service_name === "X-ray") {
      navigate("/xray");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://postcare-blackend-462349025453.asia-southeast1.run.app/services"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="service-page">
      <div className="service-header">
        <img src={patient.image} alt="patient" className="service-avatar" />

        <div className="service-header-text">
          <div className="service-hn">{patient.hn}</div>
          <div className="service-patient-type">
            Patient Type: {patient.type}
          </div>
          <div className="service-patient-name">{patient.name}</div>
        </div>
      </div>

      <h2 className="service-title">Service</h2>

      <div className="service-list">
        {loading && <p className="service-message">Loading...</p>}
        {error && <p className="service-message error">{error}</p>}

        {!loading && !error && services.length === 0 && (
          <p className="service-message">No services found</p>
        )}

        {!loading &&
          !error &&
          services.map((item) => {
            const isAvailable = item.status?.toLowerCase() === "available";

            return (
              <div
                className="service-card"
                key={item.id}
                onClick={() => handleServiceClick(item)}
              >
                <div className="service-card-content">
                  <div className="service-card-left">
                    <p>ServiceID : {item.service_id}</p>
                    <p>ServiceName: {item.service_name}</p>
                    <p>Department: {item.department}</p>
                    <p>Location: {item.location}</p>
                  </div>

                  <div className="service-card-right">
                    <span
                      className={`service-badge ${
                        isAvailable ? "available" : "reserved"
                      }`}
                    >
                      {isAvailable ? "Available" : "Reserved"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
          }}
        >
          <img src={taskIcon} alt="task" className="nav-icon" />
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("profile");
          }}
        >
          <img src={profileIcon} alt="profile" className="nav-icon" />
        </button>
      </div>
    </div>
  );
}