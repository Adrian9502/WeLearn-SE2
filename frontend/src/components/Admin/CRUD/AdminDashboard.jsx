import {
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 circle-bg">
      {/* Dashboard Title */}
      <h1 className="text-4xl custom-border p-4 font-bold text-yellow-400 mb-8">
        Admin Dashboard
      </h1>

      {/* Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Quizzes Overview */}
        <div className="custom-border shadow-lg p-5 text-2xl text-center">
          <div className="flex items-center h-36 justify-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-md font-medium ">Total Quizzes</h2>
              <p className="text-4xl font-bold text-yellow-400">10</p>
            </div>
            {/* <FaClipboardList className="text-yellow-400 text-4xl" /> */}
          </div>
        </div>

        {/* Users Overview */}
        <div className="custom-border shadow-lg p-5 text-2xl text-center">
          <div className="flex items-center h-36 justify-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-md font-medium">Total Users</h2>
              <p className="text-3xl font-bold text-yellow-400">250</p>
            </div>
            {/* <FaUsers className="text-yellow-500 text-4xl" /> */}
          </div>
        </div>

        {/* Questions Overview */}
        <div className="custom-border shadow-lg p-5 text-2xl text-center">
          <div className="flex items-center h-36 justify-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-md font-medium">Total Questions</h2>
              <p className="text-3xl font-bold text-yellow-400">120</p>
            </div>
            {/* <FaQuestionCircle className="text-yellow-500 text-4xl" /> */}
          </div>
        </div>

        {/* Total Admins */}
        <div className="custom-border shadow-lg p-5 text-2xl text-center">
          <div className="flex items-center h-36 justify-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-md font-medium">Total Admins</h2>
              <p className="text-3xl font-bold text-yellow-400">450</p>
            </div>
            {/* <FaChartBar className="text-yellow-500 text-4xl" /> */}
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="custom-border shadow-lg p-5 text-2xl text-center">
        <h3 className="text-2xl font-semibold text-yellow-400 mb-6">
          Quiz Statistics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Example chart placeholder */}
          <div className="bg-gray-700 rounded-lg h-64 flex justify-center items-center text-yellow-400">
            [Chart Placeholder - User Participation]
          </div>
          <div className="bg-gray-700 rounded-lg h-64 flex justify-center items-center text-yellow-400">
            [Chart Placeholder - Average Scores]
          </div>
        </div>
      </div>
    </div>
  );
}
