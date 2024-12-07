import { FaChartLine, FaQuestionCircle, FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import React from "react";
const Links = [
  {
    path: "/admin-dashboard/",
    icon: <FaChartLine size={20} />,
    label: "Dashboard",
  },
  {
    path: "/admin-dashboard/manage-quizzes",
    icon: <FaQuestionCircle size={20} />,
    label: "Manage Quizzes",
  },
  {
    path: "/admin-dashboard/manage-users",
    icon: <FaUser size={20} />,
    label: "Manage Users",
  },
  {
    path: "/admin-dashboard/manage-admins",
    icon: <RiAdminFill size={20} />,
    label: "Manage Admins",
  },
];

export default Links;
