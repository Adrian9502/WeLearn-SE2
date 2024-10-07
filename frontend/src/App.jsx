import { Routes, Route } from "react-router-dom";
import AdminPages from "./components/Admin/AdminPages";
import Login from "./components/login/Login";

function App() {
  return (
    <main className="min-h-screen">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard/*" element={<AdminPages />} />
      </Routes>
    </main>
  );
}

export default App;
