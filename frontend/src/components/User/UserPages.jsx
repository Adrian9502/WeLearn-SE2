import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import SortingAlgo from "./Sorting Algo/SortingAlgo";
import BinaryAlgo from "./Binary Algo/BinaryAlgo";

export default function UserPages() {
  return (
    <Routes>
      {/* LOGIN AND DASHBOARD */}

      <Route path="home" element={<UserDashboard />} />
      {/* USER UI */}
      <Route path="sorting-algo" element={<SortingAlgo />} />
      <Route path="binary-algo" element={<BinaryAlgo />} />
    </Routes>
  );
}
