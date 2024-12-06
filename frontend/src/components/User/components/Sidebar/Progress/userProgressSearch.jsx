import { useState, useEffect } from "react";

export function useProgressSearch(userProgress) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProgress, setFilteredProgress] = useState(userProgress || []);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  const searchProgress = (term) => {
    if (!Array.isArray(userProgress)) return [];
    return userProgress.filter((quiz) =>
      quiz.quizId.title.toLowerCase().includes(term.toLowerCase())
    );
  };

  const sortProgress = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;

      switch (key) {
        case "title":
          compareA = a.quizId.title.toLowerCase();
          compareB = b.quizId.title.toLowerCase();
          return direction === "asc"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        case "attempts":
          return direction === "asc"
            ? a.exercisesCompleted - b.exercisesCompleted
            : b.exercisesCompleted - a.exercisesCompleted;
        case "time":
          return direction === "asc"
            ? a.totalTimeSpent - b.totalTimeSpent
            : b.totalTimeSpent - a.totalTimeSpent;
        case "completed":
          compareA = a.completed ? 1 : 0;
          compareB = b.completed ? 1 : 0;
          return direction === "asc"
            ? compareA - compareB
            : compareB - compareA;
        case "unanswered":
          compareA = a.completed ? 0 : 1;
          compareB = b.completed ? 0 : 1;
          return direction === "asc"
            ? compareA - compareB
            : compareB - compareA;
        default:
          return 0;
      }
    });
  };

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: "desc" });
    setFilteredProgress(userProgress || []);
  };

  useEffect(() => {
    if (!Array.isArray(userProgress)) return;
    let filtered = searchProgress(searchTerm);
    if (sortConfig.key) {
      filtered = sortProgress(filtered, sortConfig.key, sortConfig.direction);
    }
    setFilteredProgress(filtered);
  }, [searchTerm, userProgress, sortConfig]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProgress,
    handleSort,
    handleReset,
    sortConfig,
  };
}
