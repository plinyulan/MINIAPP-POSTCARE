import { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("กำลังโหลด...");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LIFF_ID = "2009434609-FgGvmV1M";

  useEffect(() => {
    const initLIFF = async () => {
      try {
        if (!window.liff) {
          setStatus("ไม่พบ LIFF SDK");
          return;
        }

        await window.liff.init({ liffId: LIFF_ID });

        if (!window.liff.isLoggedIn()) {
          setStatus("กำลังเข้าสู่ระบบ LINE...");
          window.liff.login();
          return;
        }

        setIsLoggedIn(true);

        const userProfile = await window.liff.getProfile();
        setProfile(userProfile);
        setStatus("เข้าสู่ระบบสำเร็จ");
      } catch (error) {
        console.error("LIFF init error:", error);
        setStatus("เกิดข้อผิดพลาดในการเชื่อมต่อ LINE");
      }
    };

    initLIFF();
  }, []);

  const handleLogout = () => {
    if (window.liff) {
      window.liff.logout();
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>POSTCARE+</h1>
        <p style={styles.subtitle}>LINE Mini App สำหรับติดตามการดูแลผู้ป่วย</p>

        <div style={styles.statusBox}>
          <strong>Status:</strong> {status}
        </div>

        {profile && (
          <div style={styles.profileBox}>
            <img
              src={profile.pictureUrl}
              alt="Profile"
              style={styles.avatar}
            />
            <h2 style={styles.name}>{profile.displayName}</h2>
            <p style={styles.text}>
              <strong>User ID:</strong> {profile.userId}
            </p>
            <p style={styles.text}>
              <strong>Status Message:</strong>{" "}
              {profile.statusMessage || "-"}
            </p>
          </div>
        )}

        {isLoggedIn && (
          <button onClick={handleLogout} style={styles.button}>
            ออกจากระบบ
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f8fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    color: "#2a7f62",
    fontSize: "28px",
  },
  subtitle: {
    marginTop: "8px",
    color: "#666",
    fontSize: "14px",
    marginBottom: "20px",
  },
  statusBox: {
    background: "#eef6f2",
    color: "#2d5c4d",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  profileBox: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
  },
  name: {
    margin: "8px 0",
    fontSize: "22px",
    color: "#222",
  },
  text: {
    fontSize: "14px",
    color: "#444",
    margin: "8px 0",
    wordBreak: "break-word",
  },
  button: {
    background: "#2a7f62",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default App;