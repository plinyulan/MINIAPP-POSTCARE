import "./Home.css";
import profileImg from "../img/profile.jpg"; // เปลี่ยนเป็นรูปจริงของเธอ
import bannerImg from "../img/appointment.png"; // รูปปฏิทินในกล่องฟ้า

function Home() {
  const calendarDays = [
    { date: "10", day: "Sun" },
    { date: "11", day: "Mon" },
    { date: "12", day: "Tru" },
    { date: "13", day: "Wed" },
    { date: "14", day: "Thru", active: true },
    { date: "15", day: "Fri" },
  ];

  const appointments = [
    {
      id: "AP01",
      clinic: "X-ray (General)",
      doctor: "-",
      location: "Prajomkao HS.",
      status: "Approve",
      type: "OPD",
    },
    {
      id: "AP02",
      clinic: "Blood presser(General)",
      doctor: "-",
      location: "Prajomkao HS.",
      status: "Approve",
      type: "OPD",
    },
    {
      id: "AP03",
      clinic: "Diagnosis (General)",
      doctor: "-",
      location: "Prajomkao HS.",
      status: "Approve",
      type: "OPD",
    },
  ];

  return (
    <div className="home-page">
      <div className="home-header">
        <img src={profileImg} alt="profile" className="profile-img" />
        <div className="header-info">
          <p>HN00001</p>
          <p>Patient Type: OPD</p>
          <p>Ms. Pathumwadee Darukanprut</p>
        </div>
      </div>

      <div className="appointment-banner">
        <div className="banner-text">
          <p>Ms. Pathumwadee Darukanprut</p>
          <p>Attending physician:</p>
          <p>Dr. Thanakrit Wattanachai</p>
          <p>Department: General</p>
        </div>
        <img src={bannerImg} alt="appointment" className="banner-img" />
      </div>

      <div className="section-header">
        <h3>Calendar</h3>
        <button>See all</button>
      </div>

      <div className="calendar-row">
        {calendarDays.map((item, index) => (
          <div className="calendar-item" key={index}>
            <div className={`calendar-circle ${item.active ? "active" : ""}`}>
              {item.date}
            </div>
            <span>{item.day}</span>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h3>Appointment</h3>
        <button>See all</button>
      </div>

      <div className="appointment-list">
        {appointments.map((item) => (
          <div className="appointment-card" key={item.id}>
            <div className="appointment-left">
              <p>{item.id}</p>
              <p>Clinic: {item.clinic}</p>
              <p>Doctor: {item.doctor}</p>
              <p>Location: {item.location}</p>
            </div>

            <div className="appointment-right">
              <span className="status approve">{item.status}</span>
              <span className="type-badge">{item.type}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <span>
          <img src="home.png" alt="Home" />
        </span>
        <span>
            <img src="calendar.png" alt="Calendar" />
        </span>
        <span>
            <img src="appointment.png" alt="Appointment" />
        </span>
        <span>
            <img src="profile.png" alt="Profile" />
        </span>
      </div>
    </div>
  );
}

export default Home;