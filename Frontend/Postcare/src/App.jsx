import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./pages/LoginHN";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Services from "./pages/Services";
import Bloodpresser from "./pages/Bloodpresser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginHN />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bloodpresser" element={<Bloodpresser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;