import React, { useState } from "react";
import LoginHN from "./pages/LoginHN";

function HomePage() {
  return <div>Home Page</div>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <HomePage />
  ) : (
    <LoginHN onLoginSuccess={() => setIsLoggedIn(true)} />
  );
}

export default App;

