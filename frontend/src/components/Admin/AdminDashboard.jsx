import {
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";
import "./admin.css";
export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 bg-indigo-50">
      {/* Dashboard Title */}
      <h1 className="text-4xl border-b-2 border-indigo-600 p-4 font-bold text-indigo-800 mb-8">
        Admin Dashboard
      </h1>

      {/* Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Quizzes Overview */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md p-5 rounded-lg text-center text-white hover:shadow-lg transition">
          <div className="flex items-center justify-between h-36">
            <div>
              <h2 className="text-md font-medium">Total Quizzes</h2>
              <p className="text-4xl font-bold text-white">10</p>
            </div>
            <FaClipboardList className="text-white text-5xl" />
          </div>
        </div>

        {/* Users Overview */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md p-5 rounded-lg text-center text-white hover:shadow-lg transition">
          <div className="flex items-center justify-between h-36">
            <div>
              <h2 className="text-md font-medium">Total Users</h2>
              <p className="text-4xl font-bold text-white">250</p>
            </div>
            <FaUsers className="text-white text-5xl" />
          </div>
        </div>

        {/* Questions Overview */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md p-5 rounded-lg text-center text-white hover:shadow-lg transition">
          <div className="flex items-center justify-between h-36">
            <div>
              <h2 className="text-md font-medium">Total Questions</h2>
              <p className="text-4xl font-bold text-white">120</p>
            </div>
            <FaQuestionCircle className="text-white text-5xl" />
          </div>
        </div>

        {/* Total Admins */}
        <div className="bg-gradient-to-r from-violet-400 to-purple-500 shadow-md p-5 rounded-lg text-center text-white hover:shadow-lg transition">
          <div className="flex items-center justify-between h-36">
            <div>
              <h2 className="text-md font-medium">Total Admins</h2>
              <p className="text-4xl font-bold text-white">450</p>
            </div>
            <FaChartBar className="text-white text-5xl" />
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white shadow-md p-8 rounded-lg">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-6">
          Quiz Statistics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Example chart placeholder */}
          <div className="bg-indigo-100 rounded-lg h-64 flex justify-center items-center text-indigo-700">
            [Chart Placeholder - User Participation]
          </div>
          <div className="bg-indigo-100 rounded-lg h-64 flex justify-center items-center text-indigo-700">
            [Chart Placeholder - Average Scores]
          </div>
        </div>
      </div>
    </div>
  );
}
