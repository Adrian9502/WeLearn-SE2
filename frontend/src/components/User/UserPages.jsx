import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./UserDashboard";

export default function UserPages() {
  return (
    <Routes>
      {/* where user take quiz */}
      <Route path="home" element={<UserDashboard />} />
    </Routes>
  );
}
