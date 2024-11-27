import React, { useState, useEffect } from "react";
import { MdAdminPanelSettings } from "react-icons/md";

import axios from "axios";
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
import {
  FaQuestionCircle,
  FaUsers,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

const OverviewCard = ({ title, count, Icon }) => (
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] transition-all scale-[1.02]">
    <div className="relative rounded-xl bg-slate-950 p-7 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-slate-400 mb-2">{title}</h2>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {count ? (
              count
            ) : (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            )}
          </div>
        </div>
        <Icon className="text-5xl text-cyan-400" />
      </div>
    </div>
  </div>
);

const StatisticsCard = ({ title, children }) => (
  <div className="rounded-xl bg-slate-950 p-6 border border-slate-800">
    <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center justify-around">
      {title}
    </h3>
    <div className="h-64 rounded-lg bg-slate-900/50 p-4">{children}</div>
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

        // Fetch completion rate
        const fetchCompletionRate = await axios.get(
          "/api/progress/completion-stats"
        );

        // Set the combined overview data
        setOverviewData({
          quizzes: totalQuizzes,
          users: totalUsers,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const chartColors = {
    primary: "#6366f1",
    secondary: "#06b6d4",
    accent: "#f472b6",
    success: "#22c55e",
  };

  return (
    <div className="text-white p-8">
      <div>
        <h1 className="text-4xl mt-10 font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-8">
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
            title="Total Admins"
            count={overviewData.admins}
            Icon={MdAdminPanelSettings}
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
            className="bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-2 hover:bg-slate-700 transition"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatisticsCard title="User Activity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </StatisticsCard>

          <StatisticsCard title="Quiz Completion Rates">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.quizCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar
                  dataKey="completionRate"
                  fill={chartColors.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </StatisticsCard>

          <StatisticsCard title="Average Completion Time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="quizTitle" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke={chartColors.success}
                  strokeWidth={2}
                />
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
                      fill={
                        [
                          chartColors.primary,
                          chartColors.secondary,
                          chartColors.accent,
                          chartColors.success,
                        ][index % 4]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StatisticsCard>
        </div>
      </div>
    </div>
  );
}
