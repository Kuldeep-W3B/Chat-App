import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from './Register';
import Login from './Login.jsx';
import { UserContext } from "./UserContext.jsx";
import Chat from "./Chat";

export default function AppRoutes() {
  const { username } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        {username ? (
          <>
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
