import React, { useState, useEffect } from "react";
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

const OverviewCard = ({ title, count, Icon, trend }) => (
  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-md p-5 rounded-lg text-white hover:shadow-lg transition">
    <div className="flex items-center justify-between h-36">
      <div>
        <h2 className="text-md font-medium">{title}</h2>
        <p className="text-4xl font-bold">{count}</p>
        {trend && (
          <p className="text-sm mt-2">
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <Icon className="text-white text-5xl" />
    </div>
  </div>
);

const StatisticsCard = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

export default function AdminDashboard() {
  const [overviewData, setOverviewData] = useState({
    quizzes: 0,
    users: 0,
    questions: 0,
    admins: 0,
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
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your existing fetch calls...

        // Additional analytics fetch calls
        const [userActivity, quizStats, timeStats, rankings] =
          await Promise.all([
            fetch("http://localhost:5000/api/analytics/user-activity").then(
              (res) => res.json()
            ),
            fetch("http://localhost:5000/api/analytics/quiz-stats").then(
              (res) => res.json()
            ),
            fetch("http://localhost:5000/api/analytics/time-stats").then(
              (res) => res.json()
            ),
            fetch("http://localhost:5000/api/progress/rankings").then((res) =>
              res.json()
            ),
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

  if (loading || error) {
    return <div>{/* Your existing loading/error state */}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl border-b-2 border-violet-700 p-4 font-bold text-violet-700 mb-8">
        Admin Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <OverviewCard
          title="Total Quizzes"
          count={overviewData.quizzes}
          Icon={FaClipboardList}
          trend={5.2}
        />
        <OverviewCard
          title="Active Users"
          count={overviewData.users}
          Icon={FaUsers}
          trend={12.5}
        />
        <OverviewCard
          title="Total Questions"
          count={overviewData.questions}
          Icon={FaQuestionCircle}
          trend={8.1}
        />
        <OverviewCard
          title="Completion Rate"
          count={`${Math.round(overviewData.completionRate)}%`}
          Icon={FaCheckCircle}
          trend={3.7}
        />
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          className="bg-white border border-gray-300 rounded-md px-4 py-2"
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
              <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
              <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" />
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
              <Bar dataKey="completionRate" fill="#8884d8" />
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
              <Line type="monotone" dataKey="avgTime" stroke="#82ca9d" />
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
