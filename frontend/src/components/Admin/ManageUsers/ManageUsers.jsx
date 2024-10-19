import React, { useState, useEffect, useCallback, useMemo } from "react";
import ManageUsersModal from "./ManageUsersModal";
import DashboardManager from "../DashboardManager";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

// MAIN COMPONENT
const ManageUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
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
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      const transformedData = response.data.map((user) => ({
        ID: user._id,
        Name: user.fullName,
        Coins: user.coins,
        Username: user.username,
        Email: user.email,
        "Date of birth": new Date(user.dob).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        Role: user.isAdmin ? "Admin" : "User",
        "Date created": new Date(user.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      setUserData(transformedData);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserCreated = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserUpdated = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserDeleted = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const filteredData = useMemo(() => {
    return userData.filter((user) =>
      Object.values(user).some(
        (value) =>
          value !== undefined && // Check if value is defined
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [userData, searchTerm]);

  // SORTING ALGORITHM TO SORT DATA ASCENDING OR DESCENDING
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key].toString().toLowerCase();
        const bValue = b[sortConfig.key].toString().toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
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
      <div
        className="flex h-screen items-center justify-center mb-5"
        data-testid="loading-spinner"
      >
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
        title="Manage Users"
        handleOpenModal={handleOpenModal}
        tableColumns={[
          "ID",
          "Name",
          "Coins",
          "Username",
          "Email",
          "Date of birth",
          "Role",
          "Date created",
        ]}
        tableRows={sortedData}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <ManageUsersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCloseModal={handleCloseModal}
        type={modalType}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        onUserDeleted={handleUserDeleted}
      />
    </>
  );
};

export default ManageUsers;
