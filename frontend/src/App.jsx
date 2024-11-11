import { Routes, Route } from "react-router-dom";
import AdminPages from "./components/Admin/AdminPages";
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";
import UserPages from "./components/User/UserPages";
import { UserProvider } from "./components/User/UserContext";
import AdminLogin from "./components/Login/AdminLogin";
function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />

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
    </UserProvider>
  );
}

export default App;
