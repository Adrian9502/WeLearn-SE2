import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
  FaClock,
  FaTrophy,
  FaCheckCircle,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const OverviewCard = ({ title, count, Icon }) => (
  <div className="shadow-md px-6 py-8 rounded-lg hover:shadow-lg bg-gradient-to-bl from-purple-600 to-fuchsia-600 transition">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-medium mb-2">{title}</h2>
        <p className="text-4xl font-bold">{count}</p>
      </div>
      <Icon className="text-5xl" />
    </div>
  </div>
);

const StatisticsCard = ({ title, children }) => (
  <div className="bg-gradient-to-bl from-purple-600 to-fuchsia-700 shadow-lg rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center justify-around">
      {title}
    </h3>
    <div className="h-64 bg-slate-200 p-2 rounded-lg">{children}</div>
  </div>
);

export default function AdminDashboard() {
  const [overviewData, setOverviewData] = useState({
    quizzes: 0,
    users: 0,
    questions: 0,
    admins: 0,
    completionRate: 0,
  });
  const [analytics, setAnalytics] = useState({
    userActivity: [],
    quizCompletion: [],
    categoryDistribution: [],
    timeAnalytics: [],
    userProgress: [],
    difficultyDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Additional analytics fetch calls
        const [userActivity, quizStats, timeStats, rankings] =
          await Promise.all([
            fetch("/api/analytics/user-activity").then((res) => res.json()),
            fetch("/api/analytics/quiz-stats").then((res) => res.json()),
            fetch("/api/analytics/time-stats").then((res) => res.json()),
            fetch("/api/progress/rankings").then((res) => res.json()),
          ]);

        setAnalytics({
          userActivity: userActivity.data,
          quizCompletion: quizStats.completionData,
          categoryDistribution: quizStats.categoryData,
          timeAnalytics: timeStats.data,
          userProgress: rankings.completionRankings,
          difficultyDistribution: quizStats.difficultyData,
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch all users
        const fetchUser = await axios.get("/api/users");
        // fetch all admins
        const fetchAdmin = await axios.get("/api/admins");
        // fetch all quizzes
        const fetchQuizzes = await axios.get("/api/quizzes");

        const users = fetchUser.data;
        const admin = fetchAdmin.data;
        const quizzes = fetchQuizzes.data;
        const totalUsers = users.length;
        const totalAdmins = admin.length;
        const totalQuizzes = quizzes.length;
        const totalQuestions = quizzes.reduce((count, quiz) => {
          return count + (quiz.question ? 1 : 0);
        }, 0);

        // Fetch completion rate
        const fetchCompletionRate = await axios.get(
          "/api/progress/completion-stats"
        );

        // Set the combined overview data
        setOverviewData({
          quizzes: totalQuizzes,
          users: totalUsers,
          questions: totalQuestions,
          admins: totalAdmins,
          completionRate: fetchCompletionRate.data.completionRate,
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || error) {
    return <div>{/* Your existing loading/error state */}</div>;
  }

  return (
    <div
      className="min-h-screen w-full p-8 bg-slate-100"
      style={{ fontFamily: "Lexend" }}
    >
      <h1 className="text-4xl font-bold text-purple-600 mb-8">
        Admin Dashboard
      </h1>

      {/* Overview Cards */}
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
          title="Completion Rate"
          count={`${Math.round(overviewData.completionRate)}%`}
          Icon={FaCheckCircle}
        />
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          className="bg-purple-600 text-white border rounded-md px-4 py-2 hover:bg-purple-700 transition"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatisticsCard title="User Activity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" />
              <Line type="monotone" dataKey="newUsers" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </StatisticsCard>

        <StatisticsCard title="Quiz Completion Rates">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.quizCompletion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completionRate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </StatisticsCard>

        <StatisticsCard title="Average Completion Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.timeAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quizTitle" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgTime" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </StatisticsCard>

        <StatisticsCard title="Category Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {analytics.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </StatisticsCard>
      </div>
    </div>
  );
}
