import { useEffect, useState } from "react";
import { initLiff } from "./liff";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const start = async () => {

      const liff = await initLiff();

      // เช็คว่า login หรือยัง
      if (!liff.isLoggedIn()) {
        liff.login();   // ถ้ายังไม่ login จะเด้งไปหน้า LINE login
        return;
      }

      // ดึงข้อมูล user
      const profile = await liff.getProfile();

      // ID ของ user ใน LINE
      const userId = profile.userId;

      setProfile(profile);

      console.log("LINE userId:", userId);

    };

    start();
  }, []);

  return (
    <div>
      <h1>Postcare</h1>
      {profile && (
        <div>
          <p>{profile.displayName}</p>
          <img src={profile.pictureUrl} width="100"/>
        </div>
      )}
    </div>
  );
}

export default App;