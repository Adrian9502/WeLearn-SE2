import React, { useState, useEffect, useCallback, useMemo } from "react";
import ManageUsersModal from "./ManageUsersModal";
import DashboardManager from "../DashboardManager";
import api from "../../../utils/axios";

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
      const response = await api.get("/api/users");

      // Fetch profile pictures for each user
      const usersWithProfiles = await Promise.all(
        response.data.map(async (user) => {
          try {
            const profileResponse = await api.get(
              `/api/users/${user._id}/profile-picture`
            );
            return {
              ID: user._id,
              Profile:
                profileResponse.data.profilePicture ||
                "https://cdn-icons-png.freepik.com/512/6858/6858441.png",
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
            };
          } catch (error) {
            console.error(
              `Error fetching profile for user ${user._id}:`,
              error
            );
            return {
              // Return user data with default profile picture
              ID: user._id,
              Profile: "https://cdn-icons-png.freepik.com/512/6858/6858441.png",
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
            };
          }
        })
      );

      setUserData(usersWithProfiles);
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        ></div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="flex flex-col text-2xl font-semibold text-slate-800 h-screen items-center justify-center mb-5">
        <h2>Something went wrong.</h2>
        <h2 data-testid="error-message">{error}</h2>
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
          "Profile",
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
        sortTitle={"Name"}
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
