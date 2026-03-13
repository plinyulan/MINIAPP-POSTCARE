import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginHN from "./pages/LoginHN";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginHN />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

