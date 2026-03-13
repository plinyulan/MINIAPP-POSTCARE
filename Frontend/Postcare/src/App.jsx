import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./LoginHN";
import Home from "./Home";

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