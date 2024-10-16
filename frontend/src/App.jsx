import { Routes, Route } from "react-router-dom";
import AdminPages from "./components/Admin/AdminPages";
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protecting the admin dashboard route */}
      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute>
            <AdminPages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
