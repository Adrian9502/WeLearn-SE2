import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
// Reusable OverviewCard component
const OverviewCard = ({ title, count, Icon }) => (
  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-md p-5 rounded-lg text-center text-white hover:shadow-lg transition">
    <div className="flex items-center justify-between h-36">
      <div>
        <h2 className="text-md font-medium">{title}</h2>
        <p className="text-4xl font-bold text-white">{count}</p>
      </div>
      <Icon className="text-white text-5xl" />
    </div>
  </div>
);

OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  Icon: PropTypes.elementType.isRequired,
};

// Reusable ChartPlaceholder component
const ChartPlaceholder = ({ label }) => (
  <div className="bg-indigo-100 rounded-lg h-64 flex justify-center items-center text-indigo-700">
    [Chart Placeholder - {label}]
  </div>
);

ChartPlaceholder.propTypes = {
  label: PropTypes.string.isRequired,
};

export default function AdminDashboard() {
  const [overviewData, setOverviewData] = useState({
    quizzes: 0,
    users: 0,
    questions: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch all users
        const fetchUser = await axios.get("http://localhost:5000/api/users");
        // fetch all admins
        const fetchAdmin = await axios.get("http://localhost:5000/api/admins");
        // fetch all quizzes
        const fetchQuizzes = await axios.get(
          "http://localhost:5000/api/quizzes"
        );
        const users = fetchUser.data;
        const admin = fetchAdmin.data;
        const quizzes = fetchQuizzes.data;
        const totalUsers = users.length;
        const totalAdmins = admin.length;
        const totalQuizzes = quizzes.length;
        const totalQuestions = quizzes.reduce((count, quiz) => {
          // Assuming each quiz object has a "question" property
          return count + (quiz.question ? 1 : 0); // Increase count for each quiz with a question
        }, 0);

        setOverviewData({
          quizzes: totalQuizzes,
          users: totalUsers,
          questions: totalQuestions,
          admins: totalAdmins,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center mb-5">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#6d28d9"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col text-2xl font-semibold text-slate-800 h-screen items-center justify-center mb-5">
        <h2>Something went wrong.</h2>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      {/* Dashboard Title */}
      <h1 className="text-4xl border-b-2 border-violet-700 p-4 font-bold text-violet-700 mb-8">
        Admin Dashboard
      </h1>

      {/* Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <OverviewCard
          title="Total Quizzes"
          count={overviewData.quizzes}
          Icon={FaClipboardList}
        />
        <OverviewCard
          title="Total Users"
          count={overviewData.users}
          Icon={FaUsers}
        />
        <OverviewCard
          title="Total Questions"
          count={overviewData.questions}
          Icon={FaQuestionCircle}
        />
        <OverviewCard
          title="Total Admins"
          count={overviewData.admins}
          Icon={FaChartBar}
        />
      </div>

      {/* Quiz Statistics Section */}
      <div className="bg-white shadow-md p-8 rounded-lg">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-6">
          Quiz Statistics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Example chart placeholders */}
          <ChartPlaceholder label="User Participation" />
          <ChartPlaceholder label="Average Scores" />
        </div>
      </div>
    </div>
  );
}
