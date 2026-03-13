import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./pages/LoginHN";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginHN />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
