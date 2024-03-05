import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
