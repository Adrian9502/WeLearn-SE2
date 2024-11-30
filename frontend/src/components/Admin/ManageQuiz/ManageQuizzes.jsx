import React, { useState, useEffect, useCallback, useMemo } from "react";
import ManageQuizzesModal from "./ManageQuizzesModal";
import DashboardManager from "../DashboardManager";
import axios from "axios";

// MAIN COMPONENT
const ManageQuizzes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "Title",
    direction: "asc",
  });
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // FETCH DATA TO DISPLAY IN TABLE
  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/quizzes");

      const transformedData = response.data.map((quiz) => ({
        ID: quiz._id,
        Title: quiz.title,
        Instructions: quiz.instructions,
        Questions: quiz.questions,
        Answer: quiz.answer,
        Type: quiz.type,
        Difficulty: quiz.difficulty,
        Category: quiz.category,
      }));

      setQuizData(transformedData);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleQuizCreated = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleQuizUpdated = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleQuizDeleted = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const filteredData = useMemo(() => {
    return quizData.filter((quiz) =>
      Object.values(quiz).some(
        (value) =>
          value !== undefined && // Check if value is defined
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [quizData, searchTerm]);

  // SORTING ALGORITHM TO SORT DATA ASCENDING OR DESCENDING
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue.toString().toLowerCase() < bValue.toString().toLowerCase()) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue.toString().toLowerCase() > bValue.toString().toLowerCase()) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // HANDLE SEARCH FUNCTION
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  // HANDLE SORT FUNCTION
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);
  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  // ERROR STATE
  if (error) {
    return (
      <div className="flex flex-col text-2xl font-semibold text-slate-800 h-screen items-center justify-center mb-5">
        <h2>Something went wrong.</h2>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      <DashboardManager
        title="Manage Quizzes"
        handleOpenModal={handleOpenModal}
        tableColumns={[
          "ID",
          "Title",
          "Instructions",
          "Questions",
          "Answer",
          "Type",
          "Difficulty",
          "Category",
        ]}
        tableRows={sortedData}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        sortConfig={sortConfig}
        onSort={handleSort}
        sortTitle={"Title"}
      />
      <ManageQuizzesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCloseModal={handleCloseModal}
        type={modalType}
        onQuizCreated={handleQuizCreated}
        onQuizUpdated={handleQuizUpdated}
        onQuizDeleted={handleQuizDeleted}
      />
    </>
  );
};

export default ManageQuizzes;
