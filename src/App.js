import "./App.css";
import MainPage from "./Component/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
