import { Routes, Route } from "react-router-dom";
import AdminPages from "./components/Admin/AdminPages";
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";
import UserPages from "./components/User/UserPages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protecting the admin dashboard route for admin users only */}
      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPages />
          </ProtectedRoute>
        }
      />

      {/* Protecting the user dashboard route for regular users only */}
      <Route
        path="/user-dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserPages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
