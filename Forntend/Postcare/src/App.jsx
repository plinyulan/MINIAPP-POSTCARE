import { useEffect, useState } from "react";
import { initLiff } from "./liff";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const start = async () => {
      try {
        const liff = await initLiff();
        if (!liff) return;

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("LIFF error:", error);
      }
    };

    start();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">POSTCARE+</h1>

        {profile ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={profile.pictureUrl}
              alt="profile"
              className="w-20 h-20 rounded-full"
            />
            <p className="text-lg font-semibold">{profile.displayName}</p>
            <p className="text-sm text-gray-500 break-all">{profile.userId}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading LINE profile...</p>
        )}
      </div>
    </div>
  );
}

export default App;