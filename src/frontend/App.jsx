import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import ResetPassword from "./Pages/Auth/ResetPassword.jsx";
import Home from "./Pages/Home/Home.jsx";
import SetAvatar from "./Pages/Avatar/setAvatar.jsx";
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
