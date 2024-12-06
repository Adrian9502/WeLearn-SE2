import React from "react";
import { FaClock as Clock, FaCoins as Coins } from "react-icons/fa";
import { GiTargeting as Target } from "react-icons/gi";
import { MdEmojiEvents as Award } from "react-icons/md";
import { IoFlash as Zap } from "react-icons/io5";

export const Categories = {
  quizCompletion: {
    title: "Quiz Masters",
    description: "Players who completed the most quizzes",
    icon: <Target className="text-green-400" size={20} />,
    scoreField: "completedQuizzes",
    formatScore: (score) => `${score} quizzes`,
  },
  speedsters: {
    title: "Speed Demons",
    description: "Fastest quiz completers",
    icon: <Zap className="text-blue-400" size={20} />,
    scoreField: "averageTime",
    formatScore: (time) => `${time.toFixed(1)}s avg`,
  },
  wealthiest: {
    title: "Coin Champions",
    description: "Players with the most coins",
    icon: <Coins className="text-yellow-400" size={20} />,
    scoreField: "coins",
    formatScore: (coins) => `${coins} coins`,
  },
  consistent: {
    title: "Consistency Kings",
    description: "Most regular players",
    icon: <Award className="text-purple-400" size={20} />,
    scoreField: "consecutiveDays",
    formatScore: (days) => `${days} days`,
  },
  efficiency: {
    title: "Efficiency Elite",
    description: "Highest success rate",
    icon: <Clock className="text-red-400" size={20} />,
    scoreField: "successRate",
    formatScore: (rate) => `${(rate * 100).toFixed(1)}%`,
  },
};
