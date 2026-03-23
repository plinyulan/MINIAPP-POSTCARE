import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./pages/LoginHN";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Services from "./pages/Services";
import Scheduletime from "./pages/Scheduletime";
import Bookingsuccess from "./pages/Bookingsuccess";


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

      </Routes>
    </BrowserRouter>
  );
}

export default App;