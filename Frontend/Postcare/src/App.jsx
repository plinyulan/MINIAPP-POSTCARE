import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./pages/LoginHN";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Services from "./pages/Services";
import Scheduletime from "./pages/Scheduletime";
import Bookingsuccess from "./pages/Bookingsuccess";
import Appointment from "./pages/Appointment"; 
import Profile from "./pages/Profile"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginHN />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/services" element={<Services />} />
        <Route path="/scheduletime" element={<Scheduletime />} />
        <Route path="/bookingsuccess" element={<Bookingsuccess />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;